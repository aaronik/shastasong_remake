'use strict';

window.addEventListener('DOMContentLoaded', () => {
  const products = {
    'angels-3': { name: 'When Angels Dream III', price: 10 },
    'angels-1': { name: 'When Angels Dream', price: 10 },
    'harmonica-sunset': { name: 'Harmonica Sunset', price: 10 },
    'pacific-rim': { name: 'Pacific Rim', price: 10 },
    'thank-you': { name: 'Thank You for Being in the World', price: 1 }
  };
  const cartKey = 'shastasong-cart';
  const getCart = () => JSON.parse(localStorage.getItem(cartKey) || '[]').filter(id => products[id]);
  const money = value => `$${value.toFixed(2)}`;
  const nav = document.querySelector('.archive-nav');

  if (nav) {
    const cartButton = document.createElement('button');
    cartButton.className = 'archive-cart-button';
    cartButton.type = 'button';
    cartButton.setAttribute('aria-label', 'Open music cart');
    cartButton.innerHTML = 'Cart <span hidden>0</span>';
    nav.querySelector('a[href^="mailto:"]')?.before(cartButton) || nav.append(cartButton);

    const dialog = document.createElement('dialog');
    dialog.className = 'archive-cart-dialog';
    dialog.setAttribute('aria-labelledby', 'archive-cart-title');
    dialog.innerHTML = `<div class="archive-cart-head"><div><p>Your selections</p><h2 id="archive-cart-title">Music cart</h2></div><button type="button" aria-label="Close cart">×</button></div><ul class="archive-cart-items"></ul><div class="archive-cart-total"><span>Total</span><strong>$0.00</strong></div><form action="https://www.paypal.com/cgi-bin/webscr" method="post"><input type="hidden" name="cmd" value="_cart"><input type="hidden" name="upload" value="1"><input type="hidden" name="business" value="shastasong@snowcrest.net"><input type="hidden" name="currency_code" value="USD"><input type="hidden" name="return" value="${window.location.origin}/thank-you.html"><button type="submit">Continue to PayPal <span>→</span></button></form><p class="archive-cart-note">Secure payment is completed on PayPal. Your download page opens when payment is complete.</p>`;
    document.body.append(dialog);

    const count = cartButton.querySelector('span');
    const items = dialog.querySelector('.archive-cart-items');
    const total = dialog.querySelector('.archive-cart-total strong');
    const checkout = dialog.querySelector('form');
    const renderCart = () => {
      const cart = getCart();
      count.textContent = cart.length;
      count.hidden = !cart.length;
      items.innerHTML = cart.length ? cart.map((id, index) => `<li><span>${products[id].name}<small>Digital download · ${money(products[id].price)}</small></span><button type="button" data-remove="${index}" aria-label="Remove ${products[id].name}">×</button></li>`).join('') : '<li class="archive-empty-cart">Your cart is waiting for music.</li>';
      total.textContent = money(cart.reduce((sum, id) => sum + products[id].price, 0));
      checkout.querySelectorAll('[data-paypal-item]').forEach(field => field.remove());
      cart.forEach((id, index) => [['item_name', products[id].name], ['amount', products[id].price.toFixed(2)], ['quantity', '1']].forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden'; input.name = `${name}_${index + 1}`; input.value = value; input.dataset.paypalItem = '';
        checkout.append(input);
      }));
      checkout.querySelector('button').disabled = !cart.length;
    };
    cartButton.addEventListener('click', () => { renderCart(); dialog.showModal(); });
    dialog.querySelector('.archive-cart-head button').addEventListener('click', () => dialog.close());
    items.addEventListener('click', event => {
      if (event.target.dataset.remove === undefined) return;
      const cart = getCart(); cart.splice(Number(event.target.dataset.remove), 1);
      localStorage.setItem(cartKey, JSON.stringify(cart)); renderCart();
    });
    checkout.addEventListener('submit', () => sessionStorage.setItem('shastasong-purchase', localStorage.getItem(cartKey) || '[]'));
    renderCart();
  }

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

  content.querySelectorAll('img[width="1"], img[height="1"]').forEach(image => image.remove());
  content.querySelectorAll('td, th').forEach(cell => {
    if (!cell.textContent.trim() && !cell.querySelector('img, form, iframe, audio, video')) cell.classList.add('archive-empty-cell');
  });
  content.querySelectorAll('tr').forEach(row => {
    if ([...row.cells].length && [...row.cells].every(cell => cell.classList.contains('archive-empty-cell'))) row.classList.add('archive-empty-row');
  });
});
