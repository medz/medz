import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { gzipSync } from 'node:zlib';
import { runInNewContext } from 'node:vm';

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

const redirects = new Map([...pages].filter(([path]) => path.startsWith('/en/')));
const contentPages = new Map([...pages].filter(([path]) => !redirects.has(path)));

for (const [path, html] of pages) {
  const english = !path.startsWith('/zh/');
  assert(html.includes(`<html lang="${english ? 'en' : 'zh-CN'}"`), `Wrong language: ${path}`);
  if (redirects.has(path)) {
    const target = path.slice(3);
    assert(contentPages.has(target), `Missing redirect target: ${path}`);
    assert(html.includes(`rel="canonical" href="${origin}${target}"`));
    assert(html.includes('name="robots" content="noindex"'));
    assert(
      html.includes(`http-equiv="refresh" content="0;url=${target}"`),
      `Missing no-JavaScript redirect: ${path}`,
    );
    const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
      .map((match) => match[1])
      .join('\n');
    for (const [search, hash] of [['', ''], ['?ref=docs&name=a%26b', '#main']]) {
      let destination;
      runInNewContext(scripts, {
        window: {
          location: {
            search,
            hash,
            replace(value) { destination = value; },
          },
        },
      });
      assert.equal(destination, `${target}${search}${hash}`, `Wrong redirect: ${path}`);
    }
  } else {
    assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, `${path} needs one main heading`);
  }
  if (!redirects.has(path) && path !== '/404.html') {
    assert(
      html.includes(`rel="canonical" href="${origin}${path}"`),
      `Wrong canonical URL: ${path}`,
    );
    const counterpart = english ? `/zh${path}` : path.slice(3);
    const englishPath = english ? path : counterpart;
    const chinesePath = english ? counterpart : path;
    assert(contentPages.has(counterpart), `Missing translation: ${path}`);
    assert(html.includes(`href="${counterpart}"`), `Missing language switch: ${path}`);
    for (const [language, target] of [
      ['en', englishPath],
      ['zh-CN', chinesePath],
      ['x-default', englishPath],
    ]) {
      assert(
        html.includes(`hreflang="${language}" href="${origin}${target}"`),
        `Wrong language alternative on ${path}: ${language}`,
      );
    }
    assert(redirects.has(`/en${englishPath}`), `Missing English alias: ${englishPath}`);
    assert(!html.includes('href="/en/'), `Page links to an English alias: ${path}`);
  }
  for (const [, value] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) await checkLink(value, path);
}

const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(
  new Set(locations).size,
  contentPages.size - 1,
  'Sitemap must contain every public page once',
);
for (const location of locations) {
  assert(!location.endsWith('/404.html'));
  assert(!redirects.has(new URL(location).pathname), 'Sitemap must not contain redirects');
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
  `Verified ${contentPages.size} content pages, ${redirects.size} redirects, ${locations.length} sitemap URLs, and all local links/assets.`,
);
console.log(
  `Client JavaScript: ${scriptBytes + gzipSync(inlineScripts).length} bytes gzipped (including inline home-page scripts).`,
);
