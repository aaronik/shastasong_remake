const products = {
  'angels-3': ['When Angels Dream III', 'archive/When_Angels_Dream_3_page/Angels%203%20Opening%20clip.mp3'],
  'angels-1': ['When Angels Dream', 'archive/When_Angels_Dream_page/When%20Angels%20Dream.mp3'],
  'harmonica-sunset': ['Harmonica Sunset', 'archive/Harmonica_Sunset_page/Harmonica_Sunset_Starlight_short.mp3'],
  'pacific-rim': ['Pacific Rim', 'archive/Pacific_Rim_page/Harmonica_Sunset.mp3'],
  'thank-you': ['Thank You for Being in the World', 'archive/Downlaod_Antons_newest_music/Thank%20You%20for%20Being%20in%20the%20World%2012.29.23.mp3.zip']
};
const purchased = JSON.parse(sessionStorage.getItem('shastasong-purchase') || '[]').filter(id => products[id]);
const downloads = document.querySelector('#downloads');
downloads.innerHTML = purchased.length
  ? purchased.map(id => `<a class="download-link" href="${products[id][1]}" download>${products[id][0]} <span>Download ↓</span></a>`).join('')
  : '<p class="no-downloads">No purchases are recorded in this browser yet.</p>';
if (purchased.length) localStorage.removeItem('shastasong-cart');
