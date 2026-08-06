'use strict';

const fs = require('fs');
const path = require('path');

const archive = path.resolve(__dirname, '..', 'archive');
const pages = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.html?$/i.test(entry.name)) pages.push(full);
  }
}
walk(archive);

const header = `<header class="archive-header">
  <a class="archive-brand" href="__ROOT__index.html"><span class="archive-brand-mark">S</span><span>Shastasong<small>Mount Shasta, California</small></span></a>
  <nav class="archive-nav" aria-label="Main navigation">
    <a href="__ROOT__index.html#music">Music</a>
    <a href="__ROOT__index.html#events">Events</a>
    <a href="__ARCHIVE__Antons_bio/Antons_bio.html">Anton</a>
    <a href="__ARCHIVE__Laura_Berryhill_page/Laura_Berryhill_page.html">Laura</a>
    <a href="__ARCHIVE__Parvati_page/Parvati.html">Parvati</a>
    <a href="mailto:anton@shastasong.com">Contact</a>
  </nav>
</header>
<div class="archive-banner"><a href="__ROOT__index.html">Shastasong</a> <span> / Complete music, stories & resources</span></div>`;

const footer = `<footer class="archive-footer">
  <div class="archive-footer-main"><div><h2>Shastasong</h2><p>Transformational music from Mount Shasta.</p></div>
  <div class="archive-footer-links"><a href="__ARCHIVE__Antons_CDs/Antons_CDs.html">Discography</a><a href="__ARCHIVE__tour_page/tour_page.html">Tour schedule</a><a href="__ARCHIVE__Youtube_Videos_Page/Youtube_Videos_Page.html">Videos</a><a href="__ARCHIVE__ordering_info/ordering_info.html">Order CDs</a><a href="mailto:anton@shastasong.com">Email Anton</a></div></div>
  <div class="archive-footer-bottom">© Shastasong · Mount Shasta, California</div>
</footer>`;

let changed = 0;
for (const file of pages) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('archive-theme.css')) continue;
  const relativeDirectory = path.relative(path.dirname(file), archive).replaceAll(path.sep, '/');
  const archivePrefix = relativeDirectory ? `${relativeDirectory}/` : './';
  const rootPrefix = `${archivePrefix}../`;
  const fill = template => template.replaceAll('__ROOT__', rootPrefix).replaceAll('__ARCHIVE__', archivePrefix);

  // Repair a typo found in the original biography so the shell can be inserted.
  html = html.replace(/<<BODY/i, '<BODY');
  const headClose = /<\/head\s*>/i;
  if (headClose.test(html)) {
    html = html.replace(headClose, `<meta name="viewport" content="width=device-width, initial-scale=1">\n<link rel="stylesheet" href="${archivePrefix}archive-theme.css">\n</head>`);
  } else {
    html = html.replace(/<body/i, `<link rel="stylesheet" href="${archivePrefix}archive-theme.css">\n<body`);
  }

  const bodyOpen = /<body\b[^>]*>/i;
  if (bodyOpen.test(html)) html = html.replace(bodyOpen, match => `${match}\n${fill(header)}`);
  else continue;

  // Keep links to the original domain within this complete local archive.
  html = html.replace(/https?:\/\/(?:www\.)?shastasong\.com\//gi, archivePrefix);
  html = html.replace(/href=["']file:\/\/\/[^"']*\/web\//gi, `href="${archivePrefix}`);

  const bodyClose = /<\/body\s*>/i;
  if (bodyClose.test(html)) html = html.replace(bodyClose, `${fill(footer)}\n</body>`);
  else html += `\n${fill(footer)}`;

  fs.writeFileSync(file, html);
  changed++;
}
console.log(`Applied archive theme to ${changed} of ${pages.length} HTML pages.`);
