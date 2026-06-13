export default async function handler(req, res) {
  const { code, shop } = req.query;

  if (!code) {
    res.status(400).json({ error: 'No code provided. Use the install link.' });
    return;
  }

  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  const shopDomain = shop || process.env.SHOPIFY_SHOP_DOMAIN;

  if (!clientId || !clientSecret || !shopDomain) {
    res.status(500).json({ error: 'Missing SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET, or SHOPIFY_SHOP_DOMAIN' });
    return;
  }

  try {
    const tokenResponse = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await tokenResponse.json();

    if (data.access_token) {
      res.status(200).json({
        success: true,
        access_token: data.access_token,
        scope: data.scope,
        message: 'Copy this access_token and give it to Claude.',
      });
    } else {
      res.status(400).json({ error: 'Token exchange failed', details: data });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
