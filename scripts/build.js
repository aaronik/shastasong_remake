'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const build = path.join(root, 'build');
const entries = ['index.html', 'assets', 'archive'];

fs.rmSync(build, { recursive: true, force: true });
fs.mkdirSync(build, { recursive: true });

for (const entry of entries) {
  const source = path.join(root, entry);
  if (!fs.existsSync(source)) {
    throw new Error(`Required source is missing: ${entry}`);
  }
  fs.cpSync(source, path.join(build, entry), { recursive: true });
}

// Prevent GitHub Pages from processing the archived site with Jekyll.
fs.writeFileSync(path.join(build, '.nojekyll'), '');

function countFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).reduce(
    (count, item) => count + (item.isDirectory()
      ? countFiles(path.join(directory, item.name))
      : 1),
    0
  );
}

console.log(`Built ${countFiles(build)} files in build/`);
