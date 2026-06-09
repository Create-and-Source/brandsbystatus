import { sendJson } from './_printify.js';

export function requireAdmin(req, res) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const providedPassword = req.headers['x-admin-password'];

  if (!expectedPassword) {
    sendJson(res, 500, { error: 'Missing ADMIN_PASSWORD' });
    return false;
  }

  if (!providedPassword || providedPassword !== expectedPassword) {
    sendJson(res, 401, { error: 'Unauthorized' });
    return false;
  }

  return true;
}
