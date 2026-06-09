import { sendJson } from './_printify.js';
import { getPrintifyProducts } from './printify-products.js';
import { getCatalogCategories, supabaseRequest } from './_supabase.js';
import { getSiteUrl, stripeRequest } from './_stripe.js';

const SHIPPING_RATE_CENTS = Number(process.env.SHIPPING_RATE_CENTS || 599);

function findVariant(product, variantId) {
  return (product.variants || []).find((variant) => String(variant.id) === String(variantId) && variant.isEnabled);
}

function validateCartItems(cartItems, products) {
  const lineItems = [];
  const orderItems = [];

  for (const item of cartItems) {
    const product = products.find((candidate) => candidate.id === item.product_id);
    const variant = product ? findVariant(product, item.variant_id) : null;
    const quantity = Math.max(1, Math.min(10, Number(item.quantity || 1)));

    if (!product || !variant) {
      return {
        error: `Unable to verify ${item.name || item.product_id}. Refresh the product and try again.`,
      };
    }

    const unitAmount = Math.max(100, Math.round(Number(variant.price || product.price) * 100));
    const description = [item.color, item.size].filter(Boolean).join(' / ');

    lineItems.push({
      name: product.name,
      description,
      image: item.image || product.image,
      unitAmount,
      quantity,
    });

    orderItems.push({
      product_id: product.id,
      variant_id: Number(variant.id),
      quantity,
      name: product.name,
      color: item.color || '',
      size: item.size || '',
      image: item.image || product.image,
      unit_amount: unitAmount,
    });
  }

  return { lineItems, orderItems };
}

function appendLineItem(params, item, index) {
  params.append(`line_items[${index}][quantity]`, String(item.quantity));
  params.append(`line_items[${index}][price_data][currency]`, 'usd');
  params.append(`line_items[${index}][price_data][unit_amount]`, String(item.unitAmount));
  params.append(`line_items[${index}][price_data][product_data][name]`, item.name);
  if (item.description) params.append(`line_items[${index}][price_data][product_data][description]`, item.description);
  if (item.image) params.append(`line_items[${index}][price_data][product_data][images][0]`, item.image);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const cartItems = Array.isArray(req.body?.items) ? req.body.items : [];
  if (!cartItems.length) {
    sendJson(res, 400, { error: 'Cart is empty' });
    return;
  }

  const productsResult = await getPrintifyProducts();
  if (!productsResult.ok) {
    sendJson(res, productsResult.status, productsResult.data);
    return;
  }

  const catalogResult = await getCatalogCategories();
  const hiddenProductIds = new Set(catalogResult.data?.hiddenProductIds || []);
  const purchasableProducts = (productsResult.data.products || []).filter((product) => !hiddenProductIds.has(product.id));

  const validation = validateCartItems(cartItems, purchasableProducts);
  if (validation.error) {
    sendJson(res, 400, { error: validation.error });
    return;
  }

  const pendingOrder = await supabaseRequest('/checkout_orders', {
    method: 'POST',
    body: JSON.stringify({
      status: 'pending_payment',
      cart: validation.orderItems,
      currency: 'usd',
    }),
  });

  if (!pendingOrder.ok) {
    sendJson(res, pendingOrder.status, pendingOrder.data);
    return;
  }

  const orderId = pendingOrder.data?.[0]?.id;
  const siteUrl = getSiteUrl(req);
  const params = new URLSearchParams();

  params.append('mode', 'payment');
  params.append('success_url', `${siteUrl}/checkout-success?session_id={CHECKOUT_SESSION_ID}`);
  params.append('cancel_url', `${siteUrl}/?checkout=cancelled`);
  params.append('client_reference_id', orderId);
  params.append('metadata[checkout_order_id]', orderId);
  params.append('phone_number_collection[enabled]', 'true');
  params.append('shipping_address_collection[allowed_countries][0]', 'US');

  validation.lineItems.forEach((item, index) => appendLineItem(params, item, index));

  if (SHIPPING_RATE_CENTS > 0) {
    params.append('shipping_options[0][shipping_rate_data][type]', 'fixed_amount');
    params.append('shipping_options[0][shipping_rate_data][fixed_amount][amount]', String(SHIPPING_RATE_CENTS));
    params.append('shipping_options[0][shipping_rate_data][fixed_amount][currency]', 'usd');
    params.append('shipping_options[0][shipping_rate_data][display_name]', 'Standard shipping');
  }

  const sessionResult = await stripeRequest('/checkout/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!sessionResult.ok) {
    sendJson(res, sessionResult.status, sessionResult.data);
    return;
  }

  await supabaseRequest(`/checkout_orders?id=eq.${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      stripe_session_id: sessionResult.data.id,
      amount_total: sessionResult.data.amount_total,
      currency: sessionResult.data.currency,
    }),
  });

  sendJson(res, 200, {
    url: sessionResult.data.url,
    sessionId: sessionResult.data.id,
  });
}
