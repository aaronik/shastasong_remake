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

for (const required of ['index.html', 'thank-you.html', 'assets/style.css', 'assets/script.js', 'assets/thank-you.js', 'archive/index.html', 'public/CNAME']) {
  if (!fs.existsSync(path.join(root, required))) failures.push(required);
}

const cname = fs.existsSync(path.join(root, 'public/CNAME'))
  ? fs.readFileSync(path.join(root, 'public/CNAME'), 'utf8').trim()
  : '';
if (cname !== 'shastasong.aaronik.com') failures.push('public/CNAME must contain only shastasong.aaronik.com');

let themedPages = 0;
function checkArchivePages(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) checkArchivePages(full);
    else if (/\.html?$/i.test(entry.name)) {
      const contents = fs.readFileSync(full);
      // Three original image files have misleading .html extensions.
      if (!contents.subarray(0, 4096).toString().toLowerCase().includes('<html')) continue;
      themedPages++;
      if (!contents.includes(Buffer.from('archive-theme.css')) || !contents.includes(Buffer.from('archive-theme.js'))) failures.push(path.relative(root, full));
    }
  }
}
checkArchivePages(path.join(root, 'archive'));
if (!themedPages) failures.push('No archive HTML pages found');

if (failures.length) {
  console.error(`Missing local files:\n${[...new Set(failures)].map(file => `  - ${file}`).join('\n')}`);
  process.exit(1);
}

console.log(`Passed: ${references.length} homepage references and ${themedPages} themed archive pages are valid.`);
