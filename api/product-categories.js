import { requireAdmin } from './_admin.js';
import { sendJson } from './_printify.js';
import { getCatalogCategories, supabaseRequest } from './_supabase.js';

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
      : result.data?.error || result.data?.message || 'Unable to update categories',
  });
}

async function getCategories(res) {
  const result = await getCatalogCategories();
  sendJson(res, result.status, result.data);
}

async function createCategory(req, res) {
  const name = String(req.body?.name || '').trim();
  const description = String(req.body?.description || '').trim();
  const sortOrder = Number(req.body?.sort_order || 0);
  const slug = slugify(req.body?.slug || name);

  if (!name) {
    sendJson(res, 400, { error: 'Category name is required' });
    return;
  }

  const result = await supabaseRequest('/categories', {
    method: 'POST',
    body: JSON.stringify({
      name,
      slug,
      description,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    }),
  });

  if (!result.ok && (result.status === 409 || String(result.data?.message || '').includes('duplicate key'))) {
    const categoriesResult = await supabaseRequest('/categories?select=*&order=sort_order.asc,name.asc');
    const matchingCategory = (categoriesResult.data || []).find((category) =>
      category.name?.toLowerCase() === name.toLowerCase() || category.slug === slug
    );

    if (categoriesResult.ok && matchingCategory) {
      sendJson(res, 200, { existing: true, category: matchingCategory });
      return;
    }
  }

  sendSupabaseMutationResult(res, result);
}

async function updateCategory(req, res) {
  const categoryId = req.body?.categoryId;
  const name = String(req.body?.name || '').trim();

  if (!categoryId || !name) {
    sendJson(res, 400, { error: 'categoryId and name are required' });
    return;
  }

  const result = await supabaseRequest(`/categories?id=eq.${encodeURIComponent(categoryId)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      name,
      slug: slugify(req.body?.slug || name),
      updated_at: new Date().toISOString(),
    }),
  });

  sendSupabaseMutationResult(res, result);
}

async function deleteCategory(req, res) {
  const categoryId = req.body?.categoryId;

  if (!categoryId) {
    sendJson(res, 400, { error: 'categoryId is required' });
    return;
  }

  const result = await supabaseRequest(`/categories?id=eq.${encodeURIComponent(categoryId)}`, {
    method: 'DELETE',
  });

  sendSupabaseMutationResult(res, result.ok ? { ...result, data: { ok: true } } : result);
}

async function assignProduct(req, res) {
  const categoryId = req.body?.categoryId;
  const productId = req.body?.productId;

  if (!categoryId || !productId) {
    sendJson(res, 400, { error: 'categoryId and productId are required' });
    return;
  }

  const result = await supabaseRequest('/product_category_assignments', {
    method: 'POST',
    headers: {
      Prefer: 'resolution=ignore-duplicates,return=representation',
    },
    body: JSON.stringify({
      category_id: categoryId,
      product_id: productId,
    }),
  });

  sendSupabaseMutationResult(res, result);
}

async function unassignProduct(req, res) {
  const categoryId = req.body?.categoryId;
  const productId = req.body?.productId;

  if (!categoryId || !productId) {
    sendJson(res, 400, { error: 'categoryId and productId are required' });
    return;
  }

  const result = await supabaseRequest(
    `/product_category_assignments?category_id=eq.${encodeURIComponent(categoryId)}&product_id=eq.${encodeURIComponent(productId)}`,
    { method: 'DELETE' }
  );

  sendSupabaseMutationResult(res, result.ok ? { ...result, data: { ok: true } } : result);
}

async function hideProduct(req, res) {
  const productId = req.body?.productId;

  if (!productId) {
    sendJson(res, 400, { error: 'productId is required' });
    return;
  }

  const result = await supabaseRequest('/hidden_products', {
    method: 'POST',
    headers: {
      Prefer: 'resolution=ignore-duplicates,return=representation',
    },
    body: JSON.stringify({ product_id: productId }),
  });

  sendSupabaseMutationResult(res, result);
}

async function showProduct(req, res) {
  const productId = req.body?.productId;

  if (!productId) {
    sendJson(res, 400, { error: 'productId is required' });
    return;
  }

  const result = await supabaseRequest(`/hidden_products?product_id=eq.${encodeURIComponent(productId)}`, {
    method: 'DELETE',
  });

  sendSupabaseMutationResult(res, result.ok ? { ...result, data: { ok: true } } : result);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await getCategories(res);
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!requireAdmin(req, res)) return;

  try {
    if (req.body?.action === 'createCategory') {
      await createCategory(req, res);
      return;
    }

    if (req.body?.action === 'updateCategory') {
      await updateCategory(req, res);
      return;
    }

    if (req.body?.action === 'deleteCategory') {
      await deleteCategory(req, res);
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

    if (req.body?.action === 'hideProduct') {
      await hideProduct(req, res);
      return;
    }

    if (req.body?.action === 'showProduct') {
      await showProduct(req, res);
      return;
    }

    sendJson(res, 400, { error: 'Unknown action' });
  } catch (error) {
    sendJson(res, 500, { error: error.message || 'Unable to update categories' });
  }
}
