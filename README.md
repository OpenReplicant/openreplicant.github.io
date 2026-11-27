Testing...

openreplicant.com: the Astro site (`src/`, `npm run build` into `dist/`) and the research site under `/research`
(`research/`: `npm run build:research` checks out Morphogen at `research/morphogen.ref` and builds its research
site from `research/site.toml` into `dist/research/`). `.github/workflows/deploy.yml` builds both and deploys them
on push to `main`.
