import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = resolve('dist');
const files = await readdir(root, { recursive: true });
const pages = new Map();
const origin = 'https://medz.dev';

for (const file of files.filter((file) => file.endsWith('.html'))) {
  const path = `/${file.replace(/index\.html$/, '')}`;
  pages.set(path, await readFile(resolve(root, file), 'utf8'));
}

async function checkLink(value, from) {
  const url = new URL(value.replaceAll('&amp;', '&'), `${origin}${from}`);
  if (url.origin !== origin) return;
  const path = decodeURIComponent(url.pathname);
  const target = resolve(root, `.${path}`, path.endsWith('/') ? 'index.html' : '');
  assert(!relative(root, target).startsWith('..'), `Path escapes dist: ${value}`);
  assert((await stat(target).catch(() => null))?.isFile(), `Broken link on ${from}: ${value}`);
  if (url.hash && pages.has(path)) {
    const id = decodeURIComponent(url.hash.slice(1));
    assert(
      [...pages.get(path).matchAll(/\bid="([^"]+)"/g)].some((match) => match[1] === id),
      `Missing anchor on ${from}: ${value}`,
    );
  }
}

for (const [path, html] of pages) {
  assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, `${path} needs one main heading`);
  const english = path.startsWith('/en/');
  assert(html.includes(`lang="${english ? 'en' : 'zh-CN'}"`), `Wrong language: ${path}`);
  if (path !== '/404.html') {
    assert(
      html.includes(`rel="canonical" href="${origin}${path}"`),
      `Wrong canonical URL: ${path}`,
    );
    const counterpart = english ? path.slice(3) : `/en${path}`;
    assert(pages.has(counterpart), `Missing translation: ${path}`);
    assert(html.includes(`href="${counterpart}"`), `Missing language switch: ${path}`);
  }
  for (const [, value] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) await checkLink(value, path);
}

const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(
  new Set(locations).size,
  pages.size - 1,
  'Sitemap must contain every public page once',
);
for (const location of locations) {
  assert(!location.endsWith('/404.html'));
  await checkLink(location, '/sitemap.xml');
}
for (const file of files.filter((file) => file.endsWith('.css'))) {
  const css = await readFile(resolve(root, file), 'utf8');
  for (const [, value] of css.matchAll(/url\(["']?([^"')]+)["']?\)/g))
    await checkLink(value, `/${file}`);
}

const scripts = files.filter((file) => file.endsWith('.js'));
const scriptBytes = (
  await Promise.all(
    scripts.map(async (file) => gzipSync(await readFile(resolve(root, file))).length),
  )
).reduce((a, b) => a + b, 0);
const inlineScripts = [...pages.get('/').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1])
  .join('\n');
console.log(
  `Verified ${pages.size} HTML pages, ${locations.length} sitemap URLs, and all local links/assets.`,
);
console.log(
  `Client JavaScript: ${scriptBytes + gzipSync(inlineScripts).length} bytes gzipped (including inline home-page scripts).`,
);
