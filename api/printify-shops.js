import { printifyRequest, sendJson } from './_printify.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const result = await printifyRequest('/shops.json');
    sendJson(res, result.status, result.data);
  } catch (error) {
    sendJson(res, 500, { error: error.message || 'Unable to reach Printify' });
  }
}
