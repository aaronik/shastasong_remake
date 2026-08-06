'use strict';

window.addEventListener('DOMContentLoaded', () => {
  const banner = document.querySelector('.archive-banner');
  const footer = document.querySelector('.archive-footer');
  if (!banner || !footer || document.querySelector('.archive-main')) return;

  const rawTitle = document.title
    .replace(/_page|\.page|shastasong events page/gi, '')
    .replaceAll('_', ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const titleCandidate = [...document.querySelectorAll('font[size="+5"],font[size="+4"],font[size="+3"],h1,h2')]
    .find(element => element.textContent.trim().length > 2 && element.textContent.trim().length < 85);
  const title = titleCandidate?.textContent.trim() || rawTitle || 'Shastasong Archive';
  const originalTitleBlock = titleCandidate?.closest('p, div');
  if (originalTitleBlock && !originalTitleBlock.closest('.archive-header,.archive-footer')) {
    originalTitleBlock.classList.add('archive-original-title');
  }

  const main = document.createElement('main');
  main.className = 'archive-main';
  main.innerHTML = `<section class="archive-page-hero"><p>Music from Mount Shasta</p><h1></h1><span>Original stories, recordings and resources from Shastasong</span></section><article class="archive-content"></article>`;
  main.querySelector('h1').textContent = title;
  const content = main.querySelector('.archive-content');

  let node = banner.nextSibling;
  while (node && node !== footer) {
    const next = node.nextSibling;
    content.appendChild(node);
    node = next;
  }
  banner.after(main);

  content.querySelectorAll('a[href]').forEach(link => {
    const href = (link.getAttribute('href') || '').trim();
    if (href !== link.getAttribute('href')) link.setAttribute('href', href);
    if (/\.mp3(?:$|\?)/i.test(href)) link.classList.add('archive-audio-link');
    if (!link.textContent.trim() && !link.querySelector('img')) link.remove();
  });

  // Remove empty legacy layout cells/rows and invisible spacer images.
  content.querySelectorAll('img[width="1"], img[height="1"]').forEach(image => image.remove());
  content.querySelectorAll('td, th').forEach(cell => {
    if (!cell.textContent.trim() && !cell.querySelector('img, form, iframe, audio, video')) cell.classList.add('archive-empty-cell');
  });
  content.querySelectorAll('tr').forEach(row => {
    if ([...row.cells].length && [...row.cells].every(cell => cell.classList.contains('archive-empty-cell'))) row.classList.add('archive-empty-row');
  });
});
