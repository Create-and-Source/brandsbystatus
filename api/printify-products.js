import { getPrintifyConfig, printifyRequest, sendJson } from './_printify.js';
import { getShopifyProducts } from './_shopify.js';

function titleCase(value = '') {
  return String(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getEnabledVariants(product) {
  return (product.variants || []).filter((variant) => variant.is_enabled !== false);
}

function collectOptionValues(product, key) {
  const matchingOption = (product.options || []).find((option) =>
    String(option.name || '').toLowerCase().includes(key)
  );
  const enabledOptionIds = new Set(
    getEnabledVariants(product).flatMap((variant) => (Array.isArray(variant.options) ? variant.options : []))
  );

  return (matchingOption?.values || [])
    .filter((value) => enabledOptionIds.has(value.id))
    .map((value) => ({
      id: value.id,
      title: value.title,
      swatches: value.colors || [],
    }));
}

function getVariantPrice(product) {
  const enabledVariants = getEnabledVariants(product);
  const prices = enabledVariants
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price) && price > 0);

  if (!prices.length) return 0;
  return Math.round(Math.min(...prices) / 100);
}

function getImageVariantId(src = '') {
  const match = src.match(/\/mockup\/[^/]+\/(\d+)\//);
  return match ? Number(match[1]) : null;
}

function buildColorImages(product, colorOptions) {
  const enabledVariants = getEnabledVariants(product);
  const images = product.images || product.mockup_images || [];
  const imageRank = { front: 1, other: 2, back: 3 };
  const colorImages = {};

  for (const color of colorOptions) {
    const variantIds = new Set(
      enabledVariants
        .filter((variant) => Array.isArray(variant.options) && variant.options.includes(color.id))
        .map((variant) => Number(variant.id))
    );

    const matchingImages = images
      .map((image) => ({ ...image, embeddedVariantId: getImageVariantId(image.src) }))
      .filter((image) => image.embeddedVariantId && variantIds.has(image.embeddedVariantId))
      .sort((a, b) => {
        if (a.is_default !== b.is_default) return a.is_default ? -1 : 1;
        return (imageRank[a.position] || 10) - (imageRank[b.position] || 10);
      });
    const gallery = [...new Set(matchingImages.map((image) => image.src))].slice(0, 10);

    if (gallery.length) {
      colorImages[color.title] = {
        image: gallery[0],
        secondaryImage: gallery[1] || gallery[0],
        gallery,
      };
    }
  }

  return colorImages;
}

function buildProductGallery(product) {
  const images = product.images || product.mockup_images || [];
  const imageRank = { front: 1, other: 2, back: 3 };

  const gallery = [...images]
    .sort((a, b) => {
      if (a.is_default !== b.is_default) return a.is_default ? -1 : 1;
      return (imageRank[a.position] || 10) - (imageRank[b.position] || 10);
    })
    .map((image) => image.src)
    .filter(Boolean)
    .filter((src, index, gallery) => gallery.indexOf(src) === index)
    .slice(0, 18);

  return gallery.length > 1 ? [gallery[gallery.length - 1], ...gallery.slice(0, -1)] : gallery;
}

export function mapPrintifyProduct(product) {
  const firstImage = product.images?.[0]?.src || product.mockup_images?.[0]?.src || '';
  const secondImage = product.images?.[1]?.src || product.mockup_images?.[1]?.src || firstImage;
  const colorOptions = collectOptionValues(product, 'color');
  const sizeOptions = collectOptionValues(product, 'size');
  const colors = colorOptions.map((option) => option.title);
  const sizes = sizeOptions.map((option) => option.title);
  const firstEnabledVariant = getEnabledVariants(product)[0];

  return {
    id: product.id,
    printifyProductId: product.id,
    printProviderId: product.print_provider_id,
    defaultVariantId: firstEnabledVariant?.id,
    name: product.title,
    collection: titleCase(product.product_type || product.blueprint_id || 'Printify'),
    price: getVariantPrice(product),
    image: firstImage,
    secondaryImage: secondImage,
    gallery: buildProductGallery(product),
    colors: colors.length ? colors : ['Default'],
    sizes: sizes.length ? sizes : ['One Size'],
    colorOptions: colorOptions.length ? colorOptions : colors.map((title) => ({ title, swatches: [] })),
    sizeOptions: sizeOptions.length ? sizeOptions : sizes.map((title) => ({ title })),
    colorImages: buildColorImages(product, colorOptions),
    description: product.description?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || 'Made to order through Printify.',
    variants: (product.variants || []).map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      price: Number.isFinite(Number(variant.price)) ? Math.round(Number(variant.price) / 100) : 0,
      isEnabled: variant.is_enabled !== false,
      options: variant.options || {},
    })),
  };
}

export async function getPrintifyProducts() {
  const config = getPrintifyConfig();
  if (config.error) {
    return { ok: false, status: 500, data: { error: config.error } };
  }

  if (!config.shopId) {
    return {
      ok: false,
      status: 500,
      data: { error: 'Missing PRINTIFY_SHOP_ID. Call /api/printify-shops to find it.' },
    };
  }

  try {
    const pageSize = 50;
    const firstPage = await printifyRequest(`/shops/${config.shopId}/products.json?page=1&per_page=${pageSize}`);

    if (!firstPage.ok) {
      return firstPage;
    }

    const lastPage = Number(firstPage.data?.last_page || 1);
    const remainingPages = Array.from({ length: Math.max(0, lastPage - 1) }, (_, index) => index + 2);
    const remainingResults = await Promise.all(
      remainingPages.map((page) => printifyRequest(`/shops/${config.shopId}/products.json?page=${page}&per_page=${pageSize}`))
    );

    const failedPage = remainingResults.find((result) => !result.ok);
    if (failedPage) {
      return failedPage;
    }

    const sourceProducts = [firstPage, ...remainingResults].flatMap((result) =>
      Array.isArray(result.data?.data) ? result.data.data : result.data || []
    );

    return {
      ok: true,
      status: 200,
      data: {
        products: sourceProducts.map(mapPrintifyProduct),
        sourceCount: sourceProducts.length,
      },
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: { error: error.message || 'Unable to load Printify products' },
    };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const forceRefresh = req.query?.refresh === '1';

  if (forceRefresh) {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('CDN-Cache-Control', 'no-store');
    res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
    res.setHeader('CDN-Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.setHeader('Vercel-CDN-Cache-Control', 's-maxage=60, stale-while-revalidate=120');
  }

  const [printifyResult, shopifyResult] = await Promise.all([
    getPrintifyProducts(),
    getShopifyProducts(),
  ]);

  if (!printifyResult.ok) {
    sendJson(res, printifyResult.status, printifyResult.data);
    return;
  }

  const printifyProducts = printifyResult.data?.products || [];
  const shopifyProducts = shopifyResult.data?.products || [];
  const allProducts = [...printifyProducts, ...shopifyProducts];

  sendJson(res, 200, {
    products: allProducts,
    sourceCount: allProducts.length,
    printifyCount: printifyProducts.length,
    shopifyCount: shopifyProducts.length,
  });
}
