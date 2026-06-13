import { requireAdmin } from './_admin.js';
import { sendJson } from './_printify.js';
import { getCatalogCollections, supabaseRequest, supabaseStorageUpload } from './_supabase.js';

const IMAGE_BUCKET = 'collection-images';
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

function slugify(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sendSupabaseMutationResult(res, result) {
  if (result.ok) {
    sendJson(res, result.status, result.data);
    return;
  }

  const missingSetup = result.status === 500 || (result.status === 404 && result.data?.code === 'PGRST205');

  sendJson(res, missingSetup ? 503 : result.status, {
    error: missingSetup
      ? 'Supabase is not ready yet. Add the Supabase env vars and run supabase-schema.sql.'
      : result.data?.error || result.data?.message || 'Unable to update collections',
  });
}

async function getCollections(res) {
  const result = await getCatalogCollections();
  sendJson(res, result.status, result.data);
}

async function createCollection(req, res) {
  const name = String(req.body?.name || '').trim();
  const description = String(req.body?.description || '').trim();
  const sortOrder = Number(req.body?.sort_order || 0);
  const slug = slugify(req.body?.slug || name);

  if (!name) {
    sendJson(res, 400, { error: 'Collection name is required' });
    return;
  }

  const result = await supabaseRequest('/collections', {
    method: 'POST',
    body: JSON.stringify({
      name,
      slug,
      description,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    }),
  });

  if (!result.ok && (result.status === 409 || String(result.data?.message || '').includes('duplicate key'))) {
    const collectionsResult = await supabaseRequest('/collections?select=*&order=sort_order.asc,name.asc');
    const matchingCollection = (collectionsResult.data || []).find((collection) =>
      collection.name?.toLowerCase() === name.toLowerCase() || collection.slug === slug
    );

    if (collectionsResult.ok && matchingCollection) {
      sendJson(res, 200, { existing: true, collection: matchingCollection });
      return;
    }
  }

  sendSupabaseMutationResult(res, result);
}

async function updateCollection(req, res) {
  const collectionId = req.body?.collectionId;
  const name = String(req.body?.name || '').trim();
  const description = String(req.body?.description || '').trim();

  if (!collectionId || !name) {
    sendJson(res, 400, { error: 'collectionId and name are required' });
    return;
  }

  const result = await supabaseRequest(`/collections?id=eq.${encodeURIComponent(collectionId)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      name,
      description,
      slug: slugify(req.body?.slug || name),
      updated_at: new Date().toISOString(),
    }),
  });

  sendSupabaseMutationResult(res, result);
}

async function deleteCollection(req, res) {
  const collectionId = req.body?.collectionId;

  if (!collectionId) {
    sendJson(res, 400, { error: 'collectionId is required' });
    return;
  }

  const result = await supabaseRequest(`/collections?id=eq.${encodeURIComponent(collectionId)}`, {
    method: 'DELETE',
  });

  sendSupabaseMutationResult(res, result.ok ? { ...result, data: { ok: true } } : result);
}

async function assignProduct(req, res) {
  const collectionId = req.body?.collectionId;
  const productId = req.body?.productId;

  if (!collectionId || !productId) {
    sendJson(res, 400, { error: 'collectionId and productId are required' });
    return;
  }

  const result = await supabaseRequest('/product_collection_assignments', {
    method: 'POST',
    headers: {
      Prefer: 'resolution=ignore-duplicates,return=representation',
    },
    body: JSON.stringify({
      collection_id: collectionId,
      product_id: productId,
    }),
  });

  sendSupabaseMutationResult(res, result);
}

async function unassignProduct(req, res) {
  const collectionId = req.body?.collectionId;
  const productId = req.body?.productId;

  if (!collectionId || !productId) {
    sendJson(res, 400, { error: 'collectionId and productId are required' });
    return;
  }

  const result = await supabaseRequest(
    `/product_collection_assignments?collection_id=eq.${encodeURIComponent(collectionId)}&product_id=eq.${encodeURIComponent(productId)}`,
    { method: 'DELETE' }
  );

  sendSupabaseMutationResult(res, result.ok ? { ...result, data: { ok: true } } : result);
}

function decodeDataUrl(dataUrl = '') {
  const match = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;

  return {
    contentType: match[1],
    buffer: Buffer.from(match[2], 'base64'),
  };
}

async function addCollectionImage(req, res) {
  const collectionId = req.body?.collectionId;
  const orientation = req.body?.orientation;
  const fileName = String(req.body?.fileName || 'collection-image.png');
  const alt = String(req.body?.alt || '').trim();
  const sortOrder = Number(req.body?.sort_order || 0);
  const decoded = decodeDataUrl(req.body?.dataUrl);

  if (!collectionId || !['horizontal', 'portrait_4x5'].includes(orientation)) {
    sendJson(res, 400, { error: 'collectionId and a valid orientation are required' });
    return;
  }

  if (!decoded) {
    sendJson(res, 400, { error: 'Upload a JPG, PNG, or WebP image.' });
    return;
  }

  if (decoded.buffer.length > MAX_UPLOAD_BYTES) {
    sendJson(res, 413, { error: 'Image is too large. Keep uploads under 4 MB for now.' });
    return;
  }

  const extension = decoded.contentType.includes('png')
    ? 'png'
    : decoded.contentType.includes('webp')
      ? 'webp'
      : 'jpg';
  const safeName = slugify(fileName.replace(/\.[^.]+$/, '')) || 'collection-image';
  const storagePath = `${collectionId}/${orientation}/${Date.now()}-${safeName}.${extension}`;
  const uploadResult = await supabaseStorageUpload(IMAGE_BUCKET, storagePath, decoded.buffer, decoded.contentType);

  if (!uploadResult.ok) {
    sendSupabaseMutationResult(res, uploadResult);
    return;
  }

  const imageResult = await supabaseRequest('/collection_images', {
    method: 'POST',
    body: JSON.stringify({
      collection_id: collectionId,
      orientation,
      url: uploadResult.publicUrl,
      storage_path: storagePath,
      alt,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    }),
  });

  sendSupabaseMutationResult(res, imageResult);
}

async function deleteCollectionImage(req, res) {
  const imageId = req.body?.imageId;

  if (!imageId) {
    sendJson(res, 400, { error: 'imageId is required' });
    return;
  }

  const result = await supabaseRequest(`/collection_images?id=eq.${encodeURIComponent(imageId)}`, {
    method: 'DELETE',
  });

  sendSupabaseMutationResult(res, result.ok ? { ...result, data: { ok: true } } : result);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await getCollections(res);
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!requireAdmin(req, res)) return;

  try {
    if (req.body?.action === 'createCollection') {
      await createCollection(req, res);
      return;
    }

    if (req.body?.action === 'updateCollection') {
      await updateCollection(req, res);
      return;
    }

    if (req.body?.action === 'deleteCollection') {
      await deleteCollection(req, res);
      return;
    }

    if (req.body?.action === 'assignProduct') {
      await assignProduct(req, res);
      return;
    }

    if (req.body?.action === 'unassignProduct') {
      await unassignProduct(req, res);
      return;
    }

    if (req.body?.action === 'addImage') {
      await addCollectionImage(req, res);
      return;
    }

    if (req.body?.action === 'deleteImage') {
      await deleteCollectionImage(req, res);
      return;
    }

    sendJson(res, 400, { error: 'Unknown action' });
  } catch (error) {
    sendJson(res, 500, { error: error.message || 'Unable to update collections' });
  }
}
