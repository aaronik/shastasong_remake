const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');

menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu?.setAttribute('aria-expanded', 'false');
}));

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

/* Client-only music shop. Change prices/download URLs here as releases are added. */
const products = {
  'angels-3': { name: 'When Angels Dream III', price: 10, download: 'archive/When_Angels_Dream_3_page/Angels%203%20Opening%20clip.mp3' },
  'angels-1': { name: 'When Angels Dream', price: 10, download: 'archive/When_Angels_Dream_page/When%20Angels%20Dream.mp3' },
  'harmonica-sunset': { name: 'Harmonica Sunset', price: 10, download: 'archive/Harmonica_Sunset_page/Harmonica_Sunset_Starlight_short.mp3' },
  'pacific-rim': { name: 'Pacific Rim', price: 10, download: 'archive/Pacific_Rim_page/Harmonica_Sunset.mp3' },
  'thank-you': { name: 'Thank You for Being in the World', price: 1, download: 'archive/Downlaod_Antons_newest_music/Thank%20You%20for%20Being%20in%20the%20World%2012.29.23.mp3.zip' }
};
const cartKey = 'shastasong-cart';
const getCart = () => JSON.parse(localStorage.getItem(cartKey) || '[]').filter(id => products[id]);
const saveCart = cart => localStorage.setItem(cartKey, JSON.stringify(cart));
const money = value => `$${value.toFixed(2)}`;
const cartCount = document.querySelector('[data-cart-count]');
const cartDialog = document.querySelector('#cart-dialog');
const cartItems = document.querySelector('#cart-items');
const cartTotal = document.querySelector('#cart-total');
const checkoutForm = document.querySelector('#paypal-checkout');

function renderCart() {
  const cart = getCart();
  document.querySelectorAll('[data-add-to-cart]').forEach(button => {
    const added = cart.includes(button.dataset.addToCart);
    button.classList.toggle('is-added', added);
    button.textContent = added ? 'Added to cart ✓' : 'Add to cart';
    button.setAttribute('aria-pressed', String(added));
  });
  if (cartCount) {
    cartCount.textContent = cart.length;
    cartCount.hidden = !cart.length;
  }
  if (!cartItems || !cartTotal) return;
  cartItems.innerHTML = cart.length ? cart.map((id, index) => `
    <li><span>${products[id].name}<small>Digital download · ${money(products[id].price)}</small></span>
    <button type="button" data-remove="${index}" aria-label="Remove ${products[id].name}">×</button></li>`).join('') :
    '<li class="empty-cart">Your cart is waiting for music.</li>';
  const total = cart.reduce((sum, id) => sum + products[id].price, 0);
  cartTotal.textContent = money(total);
  if (checkoutForm) {
    checkoutForm.querySelectorAll('[data-paypal-item]').forEach(field => field.remove());
    cart.forEach((id, index) => {
      const item = products[id];
      [['item_name', item.name], ['amount', item.price.toFixed(2)], ['quantity', '1']].forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden'; input.name = `${name}_${index + 1}`; input.value = value; input.dataset.paypalItem = '';
        checkoutForm.append(input);
      });
    });
    checkoutForm.querySelector('button').disabled = !cart.length;
  }
}

function openCart() { cartDialog?.showModal(); renderCart(); }
document.querySelectorAll('[data-add-to-cart]').forEach(button => button.addEventListener('click', () => {
  const id = button.dataset.addToCart;
  if (!products[id]) return;
  const cart = getCart();
  if (!cart.includes(id)) saveCart([...cart, id]);
  renderCart();
}));
document.querySelectorAll('[data-open-cart]').forEach(button => button.addEventListener('click', openCart));
document.querySelector('[data-close-cart]')?.addEventListener('click', () => cartDialog?.close());
cartItems?.addEventListener('click', event => {
  const index = event.target.dataset.remove;
  if (index === undefined) return;
  const cart = getCart(); cart.splice(Number(index), 1); saveCart(cart); renderCart();
});
checkoutForm?.addEventListener('submit', () => sessionStorage.setItem('shastasong-purchase', localStorage.getItem(cartKey) || '[]'));
renderCart();
