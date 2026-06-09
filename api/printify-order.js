import { getPrintifyConfig, printifyRequest, sendJson } from './_printify.js';
import { requireAdmin } from './_admin.js';

function required(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function validateOrder(body) {
  const address = body?.address_to || {};
  const lineItems = Array.isArray(body?.line_items) ? body.line_items : [];
  const missing = [];

  for (const field of ['first_name', 'last_name', 'email', 'country', 'region', 'address1', 'city', 'zip']) {
    if (!required(address[field])) missing.push(`address_to.${field}`);
  }

  if (!lineItems.length) missing.push('line_items');

  for (const [index, item] of lineItems.entries()) {
    for (const field of ['product_id', 'variant_id', 'quantity']) {
      if (!required(item[field])) missing.push(`line_items[${index}].${field}`);
    }
  }

  return missing;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!requireAdmin(req, res)) return;

  const config = getPrintifyConfig();
  if (config.error) {
    sendJson(res, 500, { error: config.error });
    return;
  }

  if (!config.shopId) {
    sendJson(res, 500, { error: 'Missing PRINTIFY_SHOP_ID' });
    return;
  }

  const missing = validateOrder(req.body);
  if (missing.length) {
    sendJson(res, 400, { error: 'Missing required order fields', missing });
    return;
  }

  try {
    const payload = {
      external_id: req.body.external_id || `bbs-${Date.now()}`,
      label: req.body.label || 'Brands By Status website order',
      line_items: req.body.line_items.map((item) => ({
        product_id: item.product_id,
        variant_id: Number(item.variant_id),
        quantity: Number(item.quantity),
      })),
      shipping_method: Number(req.body.shipping_method || 1),
      send_shipping_notification: Boolean(req.body.send_shipping_notification),
      address_to: req.body.address_to,
    };

    const result = await printifyRequest(`/shops/${config.shopId}/orders.json`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    sendJson(res, result.status, result.data);
  } catch (error) {
    sendJson(res, 500, { error: error.message || 'Unable to create Printify order' });
  }
}
