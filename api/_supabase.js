const TABLES = {
  categories: 'categories',
  assignments: 'product_category_assignments',
  hiddenProducts: 'hidden_products',
  collections: 'collections',
  collectionAssignments: 'product_collection_assignments',
  collectionImages: 'collection_images',
};

export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) return { error: 'Missing SUPABASE_URL' };
  if (!serviceRoleKey) return { error: 'Missing SUPABASE_SERVICE_ROLE_KEY' };

  return {
    restUrl: `${url.replace(/\/$/, '')}/rest/v1`,
    serviceRoleKey,
  };
}

export async function supabaseRequest(path, options = {}) {
  const config = getSupabaseConfig();

  if (config.error) {
    return {
      ok: false,
      status: 500,
      data: { error: config.error },
    };
  }

  const response = await fetch(`${config.restUrl}${path}`, {
    ...options,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export async function supabaseStorageUpload(bucket, path, file, contentType) {
  const config = getSupabaseConfig();

  if (config.error) {
    return {
      ok: false,
      status: 500,
      data: { error: config.error },
    };
  }

  const baseUrl = config.restUrl.replace('/rest/v1', '');
  const response = await fetch(`${baseUrl}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': contentType || 'application/octet-stream',
      'x-upsert': 'false',
    },
    body: file,
  });

  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
    publicUrl: `${baseUrl}/storage/v1/object/public/${bucket}/${path}`,
  };
}

function isMissingCatalogTable(result) {
  return result.status === 404 && result.data?.code === 'PGRST205';
}

export async function getCatalogCategories() {
  const [categoriesResult, assignmentsResult, hiddenProductsResult] = await Promise.all([
    supabaseRequest(`/${TABLES.categories}?select=*&order=sort_order.asc,name.asc`),
    supabaseRequest(`/${TABLES.assignments}?select=*`),
    supabaseRequest(`/${TABLES.hiddenProducts}?select=product_id`),
  ]);

  const missingHiddenProductsTable = isMissingCatalogTable(hiddenProductsResult);

  if (!categoriesResult.ok || !assignmentsResult.ok || (!hiddenProductsResult.ok && !missingHiddenProductsTable)) {
    const setupMessage = categoriesResult.data?.error || assignmentsResult.data?.error || hiddenProductsResult.data?.error;
    const setupPending =
      setupMessage ||
      isMissingCatalogTable(categoriesResult) ||
      isMissingCatalogTable(assignmentsResult);

    if (setupPending) {
      return {
        ok: true,
        status: 200,
        data: {
          categories: [],
          assignments: [],
          hiddenProductIds: [],
          setupRequired: true,
          message: setupMessage || 'Run supabase-schema.sql in Supabase to enable custom categories.',
        },
      };
    }

    if (!categoriesResult.ok) return categoriesResult;
    if (!assignmentsResult.ok) return assignmentsResult;
    return hiddenProductsResult;
  }

  return {
    ok: true,
    status: 200,
    data: {
      categories: categoriesResult.data || [],
      assignments: assignmentsResult.data || [],
      hiddenProductIds: missingHiddenProductsTable
        ? []
        : (hiddenProductsResult.data || []).map((product) => product.product_id),
      hiddenProductsSetupRequired: missingHiddenProductsTable,
    },
  };
}

export async function getCatalogCollections() {
  const [collectionsResult, assignmentsResult, imagesResult] = await Promise.all([
    supabaseRequest(`/${TABLES.collections}?select=*&order=sort_order.asc,name.asc`),
    supabaseRequest(`/${TABLES.collectionAssignments}?select=*`),
    supabaseRequest(`/${TABLES.collectionImages}?select=*&order=sort_order.asc,created_at.asc`),
  ]);

  if (!collectionsResult.ok || !assignmentsResult.ok || !imagesResult.ok) {
    const setupMessage = collectionsResult.data?.error || assignmentsResult.data?.error || imagesResult.data?.error;
    const setupPending =
      setupMessage ||
      isMissingCatalogTable(collectionsResult) ||
      isMissingCatalogTable(assignmentsResult) ||
      isMissingCatalogTable(imagesResult);

    if (setupPending) {
      return {
        ok: true,
        status: 200,
        data: {
          collections: [],
          assignments: [],
          images: [],
          setupRequired: true,
          message: setupMessage || 'Run supabase-schema.sql in Supabase to enable custom collections.',
        },
      };
    }

    if (!collectionsResult.ok) return collectionsResult;
    if (!assignmentsResult.ok) return assignmentsResult;
    return imagesResult;
  }

  return {
    ok: true,
    status: 200,
    data: {
      collections: collectionsResult.data || [],
      assignments: assignmentsResult.data || [],
      images: imagesResult.data || [],
    },
  };
}
