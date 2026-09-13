const crypto = require('crypto');

const USERNAME = process.env.LOGIN_USER;
const PASSWORD = process.env.LOGIN_PASS;
const SECRET = process.env.GATE_SECRET;

function sign(value) {
  return crypto.createHmac('sha256', SECRET).update(value).digest('hex');
}

function makeCookie() {
  const payload = Buffer.from(JSON.stringify({ ok: true, iat: Date.now() })).toString('base64url');
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

module.exports = (req, res) => {
  if (!USERNAME || !PASSWORD || !SECRET) {
    res.status(500).json({ ok: false, error: 'Server belum dikonfigurasi.' });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }

  const username = String(body.username || '');
  const password = String(body.password || '');

  if (username !== USERNAME || password !== PASSWORD) {
    res.status(401).json({ ok: false, error: 'Username atau password salah 💔' });
    return;
  }

  res.setHeader('Set-Cookie', `bday_gate=${makeCookie()}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`);
  res.status(200).json({ ok: true });
};
