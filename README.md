# Open Replicant website

A static site built with **Astro** and **Alpine.js islands**, deployed to **GitHub Pages**.

## Architecture

- `src/pages/*.astro` — pages (Astro partials), rendered to static HTML at build time
- `src/components/*.astro` — partials; components using Alpine directives are islands with `client:load`
- `src/layouts/BaseLayout.astro` — shared page shell
- `src/styles/global.css` — global styles
- `astro.config.mjs` — static output (`output: 'static'`)
- `.github/workflows/deploy.yml` — GitHub Actions → GitHub Pages

## Local development

```bash
npm install        # install deps (astro, alpinejs)
npm run dev        # start dev server on localhost:4321
npm run build      # build static output to dist/
npm run preview    # preview the production build locally
```

## Deploy

Push to `main`; the GitHub Actions workflow builds and deploys to GitHub Pages
automatically.

## Notes

- The navbar (`Navbar.astro`) and counter (`index.astro`) are Alpine islands
  (`client:load`) — they hydrate independently of the static page shell.
- If deploying to a project page subpath (e.g. `https://<user>.github.io/<repo>/`),
  set `site` in `astro.config.mjs` to that URL.
