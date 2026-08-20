# Shastasong

A modern, responsive GitHub Pages site for [shastasong.com](https://shastasong.com), preserving the complete original site and media library.

## Structure

- `index.html` — modern landing page and music shop
- `thank-you.html` — post-checkout browser download page
- `assets/` — styles, scripts, and optimized imagery
  - `assets/script.js` — navigation, animation, product catalog, cart, and PayPal form logic
  - `assets/thank-you.js` — renders the purchased download links
  - `assets/style.css` — site and cart styling
- `archive/` — complete mirror of the original site, including all pages, audio, images, PDFs, bios, reviews, and galleries
- `public/CNAME` — custom GitHub Pages domain

## Music shop administration

The shop is intentionally client-only so it works on GitHub Pages without a server. The cart is saved in the visitor's browser (`localStorage`), PayPal takes payment, and the download page is populated from browser session state.

### Change an album, price, or download

Edit the matching entry in the `products` object in **both** files:

- `assets/script.js` — product name, price, and download URL used by the cart.
- `assets/thank-you.js` — product name and download URL used after checkout.

Then update the matching product markup in `index.html`:

- The button needs the same `data-add-to-cart` ID.
- The visible product title and price should match the catalog.

Use URL-encoded paths for archive files with spaces (for example `My%20Song.mp3`). Put new music files in a predictable folder under `archive/` so the build publishes them automatically.

### Add an individual downloadable track

1. Add the MP3 to the repository, preferably in its album folder. For example:

   ```text
   archive/When_Angels_Dream_2_page/Bhairavi%20Duet.mp3
   ```

2. Add the same product ID to the `products` object in both catalog files. In `assets/script.js`, include the price and download URL:

   ```js
   'angels-2-bhairavi-duet': {
     name: 'When Angels Dream II — Bhairavi Duet',
     price: 1.29,
     download: 'archive/When_Angels_Dream_2_page/Bhairavi%20Duet.mp3'
   }
   ```

   In `assets/thank-you.js`, add the matching name and download URL:

   ```js
   'angels-2-bhairavi-duet': [
     'When Angels Dream II — Bhairavi Duet',
     'archive/When_Angels_Dream_2_page/Bhairavi%20Duet.mp3'
   ]
   ```

3. Put an add-to-cart button where listeners should find the track. The product ID must match exactly:

   ```html
   <button type="button" data-add-to-cart="angels-2-bhairavi-duet">
     Add to cart
   </button>
   ```

The archive header includes the shared Cart button on every archive page, but archive MP3 links do not automatically become products. Add a button such as the one above to an archive album page, or add the product to the homepage music section/a future digital-store page.

4. Test and publish:

   ```sh
   npm test
   npm run build
   npm run release
   ```

### PayPal settings

The cart posts to PayPal with the account currently set in `index.html`:

```html
<input type="hidden" name="business" value="shastasong@snowcrest.net">
```

Confirm that address is the PayPal account that should receive payments before publishing. The successful-payment return URL is also in that form and should remain the public site's `/thank-you.html` URL.

### Important limitation

There is no server-side payment verification or download protection. A visitor who knows a download URL, or manually visits `thank-you.html` after adding an item to their browser cart, can access the file. This matches the site's intentionally low-security / obscurity-based model. Use PayPal transaction records as the source of truth for sales.

## Development and deployment

Install the deployment dependency once:

```sh
npm install
```

Start the local site at <http://localhost:3000>:

```sh
npm start
```

Validate local links and required files:

```sh
npm test
```

Create the production `build/` directory:

```sh
npm run build
```

Build and publish `build/` to the repository's `gh-pages` branch:

```sh
npm run release
```

The `release` command removes the generated build after a successful deployment. In GitHub repository settings, configure Pages to serve from the `gh-pages` branch.
