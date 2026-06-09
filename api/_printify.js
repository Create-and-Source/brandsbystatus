const PRINTIFY_BASE_URL = 'https://api.printify.com/v1';

export function getPrintifyConfig() {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!token) {
    return { error: 'Missing PRINTIFY_API_TOKEN' };
  }

  return { token, shopId };
}

export async function printifyRequest(path, options = {}) {
  const config = getPrintifyConfig();

  if (config.error) {
    return {
      ok: false,
      status: 500,
      data: { error: config.error },
    };
  }

  const response = await fetch(`${PRINTIFY_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
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

export function sendJson(res, status, data) {
  res.status(status).json(data);
}
