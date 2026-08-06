'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const references = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map(match => match[1]);
const failures = [];

for (const reference of references) {
  if (/^(?:https?:|mailto:|#)/.test(reference)) continue;
  const clean = decodeURIComponent(reference.split('#')[0].split('?')[0]);
  if (!fs.existsSync(path.join(root, clean))) failures.push(clean);
}

for (const required of ['index.html', 'assets/style.css', 'assets/script.js', 'archive/index.html']) {
  if (!fs.existsSync(path.join(root, required))) failures.push(required);
}

if (failures.length) {
  console.error(`Missing local files:\n${[...new Set(failures)].map(file => `  - ${file}`).join('\n')}`);
  process.exit(1);
}

console.log(`Passed: ${references.length} homepage references and required files are valid.`);
