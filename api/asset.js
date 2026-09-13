const fs = require('fs');
const path = require('path');
const { isAuthenticated, unlocked } = require('./_gate');

const ALLOWED = {
  'foto1.png': ['foto1.png', 'image/png'],
  'foto2.png': ['foto2.png', 'image/png'],
  'foto3.png': ['foto3.png', 'image/png'],
  'foto4.png': ['foto4.png', 'image/png'],
  'lagu.mp3': ['lagu.mp3', 'audio/mpeg'],
};

module.exports = (req, res) => {
  if (!unlocked()) {
    res.status(404).end();
    return;
  }
  if (!isAuthenticated(req)) {
    res.status(401).end();
    return;
  }

  const name = String(req.query?.name || '');
  const entry = ALLOWED[name];
  if (!entry) {
    res.status(404).end();
    return;
  }

  const [fileName, contentType] = entry;
  const file = path.join(process.cwd(), 'protected', 'assets', fileName);
  if (!fs.existsSync(file)) {
    res.status(404).end();
    return;
  }

  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'private, no-store');
  res.send(fs.readFileSync(file));
};
