const SHOPIFY_API_VERSION = '2026-04';

export function getShopifyConfig() {
  const token = process.env.SHOPIFY_ACCESS_TOKEN;
  const shop = process.env.SHOPIFY_SHOP_DOMAIN;

  if (!token || !shop) {
    return { error: 'Missing SHOPIFY_ACCESS_TOKEN or SHOPIFY_SHOP_DOMAIN' };
  }

  return { token, shop };
}

export async function shopifyRequest(path) {
  const config = getShopifyConfig();
  if (config.error) {
    return { ok: false, status: 500, data: { error: config.error } };
  }

  const response = await fetch(`https://${config.shop}/admin/api/${SHOPIFY_API_VERSION}${path}`, {
    headers: {
      'X-Shopify-Access-Token': config.token,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

function extractOptions(product, key) {
  const option = (product.options || []).find((o) =>
    String(o.name || '').toLowerCase().includes(key)
  );
  if (!option) return [];
  return (option.values || []).map((value, i) => ({
    id: `${option.id}-${i}`,
    title: typeof value === 'string' ? value : value.value || value,
    swatches: [],
  }));
}

function buildShopifyGallery(product) {
  return (product.images || []).map((img) => img.src).filter(Boolean);
}

function buildShopifyColorImages(product, colorOptions) {
  const colorImages = {};
  for (const color of colorOptions) {
    const matchingImages = (product.images || []).filter((img) =>
      (img.variant_ids || []).some((vid) =>
        (product.variants || []).some(
          (v) => v.id === vid && (v.option1 === color.title || v.option2 === color.title || v.option3 === color.title)
        )
      )
    );
    const gallery = matchingImages.map((img) => img.src).filter(Boolean);
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

export function mapShopifyProduct(product) {
  const colorOptions = extractOptions(product, 'color');
  const sizeOptions = extractOptions(product, 'size');
  const colors = colorOptions.map((o) => o.title);
  const sizes = sizeOptions.map((o) => o.title);
  const gallery = buildShopifyGallery(product);
  const firstImage = product.image?.src || gallery[0] || '';
  const prices = (product.variants || [])
    .map((v) => parseFloat(v.price))
    .filter((p) => p > 0);
  const price = prices.length ? Math.round(Math.min(...prices)) : 0;

  return {
    id: `shopify-${product.id}`,
    shopifyProductId: product.id,
    source: 'shopify',
    name: product.title,
    collection: product.product_type || 'Shopify',
    price,
    image: firstImage,
    secondaryImage: gallery[1] || firstImage,
    gallery: gallery.slice(0, 18),
    colors: colors.length ? colors : ['Default'],
    sizes: sizes.length ? sizes : ['One Size'],
    colorOptions: colorOptions.length ? colorOptions : [{ title: 'Default', swatches: [] }],
    sizeOptions: sizeOptions.length ? sizeOptions : [{ title: 'One Size' }],
    colorImages: buildShopifyColorImages(product, colorOptions),
    description: (product.body_html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || 'Available on Shopify.',
    variants: (product.variants || []).map((v) => ({
      id: v.id,
      sku: v.sku,
      price: Math.round(parseFloat(v.price) || 0),
      isEnabled: v.available !== false,
      options: { option1: v.option1, option2: v.option2, option3: v.option3 },
    })),
  };
}

export async function getShopifyProducts() {
  const config = getShopifyConfig();
  if (config.error) {
    return { ok: true, status: 200, data: { products: [], sourceCount: 0 } };
  }

  try {
    const allProducts = [];
    let url = `/products.json?limit=250&status=active`;

    while (url) {
      const result = await shopifyRequest(url);
      if (!result.ok) return result;

      const products = result.data?.products || [];
      allProducts.push(...products);

      // Shopify pagination via Link header not available in this flow,
      // but 250 limit covers most stores. Break if fewer than limit.
      if (products.length < 250) break;
      url = null;
    }

    return {
      ok: true,
      status: 200,
      data: {
        products: allProducts.map(mapShopifyProduct),
        sourceCount: allProducts.length,
      },
    };
  } catch (error) {
    console.error('Shopify fetch error:', error);
    return { ok: true, status: 200, data: { products: [], sourceCount: 0 } };
  }
}
