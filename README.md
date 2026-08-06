# Shastasong

A modern, responsive GitHub Pages site for [shastasong.com](https://shastasong.com), preserving the complete original site and media library.

## Structure

- `index.html` — modern landing page
- `assets/` — styles, scripts, and optimized imagery
- `archive/` — complete mirror of the original site, including all pages, audio, images, PDFs, bios, reviews, and galleries

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
