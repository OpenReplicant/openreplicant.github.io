# Open Replicant website

A small site built with **Alpine.js islands** and **HTML partials**, deployed to **GitHub Pages**.

## Architecture

- `src/layouts/base.html` — page shell (`{{ title }}`, `{{ body }}` placeholders)
- `src/components/*.html` — partials inlined at build time (navbar, footer, …). Components using `x-data` are Alpine islands that hydrate independently.
- `src/pages/*.html` — pages with YAML frontmatter (`title`) + body
- `src/scripts/build.js` — assembles pages + copies assets to `dist/`
- `.github/workflows/deploy.yml` — GitHub Actions → GitHub Pages

## Local development

```bash
npm install        # install deps (alpinejs, chokidar)
npm run build      # build to dist/
npm run dev        # rebuild on file changes
npx serve dist     # preview locally
```

## Deploy

Push to `main`; the GitHub Actions workflow builds and deploys to GitHub Pages automatically.
