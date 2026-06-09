import { printifyRequest, sendJson } from './_printify.js';
import { supabaseRequest } from './_supabase.js';
import { stripeRequest } from './_stripe.js';

function splitName(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || 'Customer',
    lastName: parts.slice(1).join(' ') || 'Customer',
  };
}

function getShippingAddress(session) {
  const shipping = session.shipping_details || {};
  const customer = session.customer_details || {};
  const address = shipping.address || customer.address || {};
  const name = splitName(shipping.name || customer.name || '');

  return {
    first_name: name.firstName,
    last_name: name.lastName,
    email: customer.email,
    phone: customer.phone || '',
    country: address.country,
    region: address.state,
    address1: address.line1,
    address2: address.line2 || '',
    city: address.city,
    zip: address.postal_code,
  };
}

function hasAddress(address) {
  return ['first_name', 'last_name', 'email', 'country', 'region', 'address1', 'city', 'zip'].every((field) =>
    Boolean(String(address[field] || '').trim())
  );
}

async function readCheckoutOrder(sessionId) {
  const result = await supabaseRequest(
    `/checkout_orders?stripe_session_id=eq.${encodeURIComponent(sessionId)}&select=*&limit=1`
  );

  if (!result.ok) return result;

  return {
    ok: true,
    status: 200,
    data: result.data?.[0] || null,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const sessionId = req.method === 'POST' ? req.body?.session_id : req.query?.session_id;
  if (!sessionId) {
    sendJson(res, 400, { error: 'Missing session_id' });
    return;
  }

  const sessionResult = await stripeRequest(`/checkout/sessions/${encodeURIComponent(sessionId)}`);
  if (!sessionResult.ok) {
    sendJson(res, sessionResult.status, sessionResult.data);
    return;
  }

  const session = sessionResult.data;
  if (session.payment_status !== 'paid') {
    sendJson(res, 402, { error: 'Stripe session is not paid yet', payment_status: session.payment_status });
    return;
  }

  const checkoutOrderResult = await readCheckoutOrder(session.id);
  if (!checkoutOrderResult.ok) {
    sendJson(res, checkoutOrderResult.status, checkoutOrderResult.data);
    return;
  }

  const checkoutOrder = checkoutOrderResult.data;
  if (!checkoutOrder) {
    sendJson(res, 404, { error: 'Checkout order not found' });
    return;
  }

  if (checkoutOrder.status === 'printify_created') {
    sendJson(res, 200, {
      ok: true,
      alreadyFulfilled: true,
      printifyOrder: checkoutOrder.printify_order,
    });
    return;
  }

  const addressTo = getShippingAddress(session);
  if (!hasAddress(addressTo)) {
    sendJson(res, 400, { error: 'Stripe session is missing shipping details' });
    return;
  }

  const payload = {
    external_id: `stripe-${session.id}`,
    label: `Brands By Status paid order ${session.id}`,
    line_items: (checkoutOrder.cart || []).map((item) => ({
      product_id: item.product_id,
      variant_id: Number(item.variant_id),
      quantity: Number(item.quantity),
    })),
    shipping_method: Number(process.env.PRINTIFY_SHIPPING_METHOD || 1),
    send_shipping_notification: false,
    address_to: addressTo,
  };

  const printifyResult = await printifyRequest(`/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!printifyResult.ok) {
    await supabaseRequest(`/checkout_orders?id=eq.${encodeURIComponent(checkoutOrder.id)}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'printify_failed',
        customer: { address_to: addressTo, stripe_customer_details: session.customer_details },
        printify_order: printifyResult.data,
      }),
    });
    sendJson(res, printifyResult.status, printifyResult.data);
    return;
  }

  await supabaseRequest(`/checkout_orders?id=eq.${encodeURIComponent(checkoutOrder.id)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'printify_created',
      customer: { address_to: addressTo, stripe_customer_details: session.customer_details },
      printify_order: printifyResult.data,
      printify_order_id: printifyResult.data?.id || null,
      amount_total: session.amount_total,
      currency: session.currency,
    }),
  });

  sendJson(res, 200, {
    ok: true,
    printifyOrder: printifyResult.data,
  });
}
