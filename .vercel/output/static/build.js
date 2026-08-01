const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === 'public' || entry.name === '.vercel' || entry.name === '.vscode') continue;
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const root = __dirname;

// Output to dist, public, and .vercel/output/static
copyDir(root, path.join(root, 'dist'));
copyDir(root, path.join(root, 'public'));
copyDir(root, path.join(root, '.vercel', 'output', 'static'));

// Write .vercel/output/config.json
const vercelConfig = {
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/app", "dest": "/app.html" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
};

fs.mkdirSync(path.join(root, '.vercel', 'output'), { recursive: true });
fs.writeFileSync(
  path.join(root, '.vercel', 'output', 'config.json'),
  JSON.stringify(vercelConfig, null, 2)
);

console.log('Build completed successfully: synced to dist/, public/, and .vercel/output/.');
