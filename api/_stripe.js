const STRIPE_BASE_URL = 'https://api.stripe.com/v1';

export function getStripeConfig() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return { error: 'Missing STRIPE_SECRET_KEY' };
  }

  return { secretKey };
}

export async function stripeRequest(path, options = {}) {
  const config = getStripeConfig();

  if (config.error) {
    return {
      ok: false,
      status: 500,
      data: { error: config.error },
    };
  }

  const response = await fetch(`${STRIPE_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.secretKey}`,
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

export function getSiteUrl(req) {
  const configuredUrl = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (configuredUrl) {
    return configuredUrl.startsWith('http') ? configuredUrl : `https://${configuredUrl}`;
  }

  const host = req.headers.host;
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}
