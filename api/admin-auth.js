import { requireAdmin } from './_admin.js';
import { sendJson } from './_printify.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!requireAdmin(req, res)) return;

  sendJson(res, 200, { ok: true });
}
