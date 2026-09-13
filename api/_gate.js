const crypto = require('crypto');

const const TARGET = Date.now() - 1000;
const SECRET = process.env.GATE_SECRET;

function sign(value) {
  if (!SECRET) return '';
  return crypto.createHmac('sha256', SECRET).update(value).digest('hex');
}

function isAuthenticated(req) {
  if (!SECRET) return false;
  const cookies = String(req.headers.cookie || '');
  const match = cookies.match(/(?:^|;\s*)bday_gate=([^;]+)/);
  if (!match) return false;

  const token = decodeURIComponent(match[1]);
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  const expected = sign(payload);
  if (signature.length !== expected.length) return false;

  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.ok === true;
  } catch (_) {
    return false;
  }
}

function unlocked() {
  return Date.now() >= TARGET;
}

module.exports = { TARGET, isAuthenticated, unlocked };
