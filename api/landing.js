const fs = require('fs');
const path = require('path');
const { isAuthenticated, unlocked } = require('./_gate');

module.exports = (req, res) => {
  if (!unlocked()) {
    res.status(403).json({ ok: false, locked: true });
    return;
  }
  if (!isAuthenticated(req)) {
    res.status(401).json({ ok: false, loginRequired: true });
    return;
  }

  const file = path.join(process.cwd(), 'protected', 'landing.html');
  const html = fs.readFileSync(file, 'utf8');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store');
  res.status(200).send(html);
};
