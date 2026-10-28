#!/usr/bin/env node
// Build script: assembles pages from layouts + partials, copies static assets to dist/.
// Usage: node src/scripts/build.js [--watch]

import { readFile, writeFile, mkdir, readdir, copyFile } from 'node:fs/promises';
import { watch } from 'node:fs';
import { resolve, dirname, join, basename, extname } from 'node:path';

const ROOT = resolve(process.cwd());
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const LAYOUTS = join(SRC, 'layouts');
const COMPONENTS = join(SRC, 'components');
const PAGES = join(SRC, 'pages');
const ASSETS = join(SRC, 'assets');
const DIST_ASSETS = join(DIST, 'assets');

const LAYOUT = 'base.html';

function frontmatterAndBody(raw) {
  const fmRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const m = raw.match(fmRegex);
  if (!m) return { title: basename(process.argv[1]), body: raw };
  const fm = Object.fromEntries(
    m[1].split('\n').map(l => l.split(': ')).filter(p => p.length === 2)
  );
  return { title: fm.title, body: m[2] };
}

async function read(name) {
  return (await readFile(name, 'utf8')).toString();
}

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function collectComponents() {
  const comps = {};
  const files = await readdir(COMPONENTS);
  for (const f of files) {
    if (extname(f) !== '.html') continue;
    const key = basename(f, '.html');
    comps[key] = await read(join(COMPONENTS, f));
  }
  return comps;
}

function injectComponents(body, comps) {
  return body.replace(/\{\{\s*component\s+"([^"]+)"\s*\}\}/g, (_, key) => {
    return comps[key] || `<!-- component ${key} not found -->`;
  });
}

async function buildPage(pagePath, layout, comps) {
  const raw = await read(pagePath);
  const { title, body } = frontmatterAndBody(raw);
  const injected = injectComponents(body, comps);
  let html = layout
    .replace(/\{\{\s*title\s*\}\}/g, title)
    .replace(/\{\{\s*body\s*\}\}/g, injected);

  const rel = pagePath.replace(PAGES, '').replace(/\.html$/, '');
  const outRel = rel === '/index' ? '/' : rel + '/';
  const outDir = outRel === '/' ? DIST : join(DIST, outRel.slice(0, -1));
  const outFile = join(outDir, 'index.html');
  await ensureDir(outDir);
  await writeFile(outFile, html);
  console.log(`built ${outRel}index.html`);
}

async function copyAssets() {
  await ensureDir(DIST_ASSETS);
  const files = await readdir(ASSETS);
  for (const f of files) {
    await copyFile(join(ASSETS, f), join(DIST_ASSETS, f));
  }
  console.log('copied assets');
}

async function build() {
  const layout = await read(join(LAYOUTS, LAYOUT));
  const comps = await collectComponents();
  const pages = (await readdir(PAGES)).filter(f => extname(f) === '.html');
  await Promise.all(pages.map(p => buildPage(join(PAGES, p), layout, comps)));
  await copyAssets();
  console.log('build complete');
}

const watchFlag = process.argv.includes('--watch');
if (watchFlag) {
  build().then(() => {
    const targets = [LAYOUTS, COMPONENTS, PAGES, ASSETS];
    for (const t of targets) {
      watch(t, { recursive: true }, () => {
        build().catch(console.error);
      });
    }
    console.log('watching for changes…');
  });
} else {
  build().catch(err => { console.error(err); process.exit(1); });
}
