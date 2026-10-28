import type { APIRoute } from 'astro';
import { projects } from '../data/projects';
import { locales, localPath, site } from '../data/site';

export const GET: APIRoute = () => {
  const paths = ['', 'projects', 'resume', ...projects.map((project) => project.slug)];
  const entries = paths
    .flatMap((path) =>
      locales.map((locale) => {
        const alternatives = locales
          .map(
            (lang) =>
              `<xhtml:link rel="alternate" hreflang="${lang === 'zh' ? 'zh-CN' : 'en'}" href="${site.url}${localPath(path, lang)}"/>`,
          )
          .join('');
        return `<url><loc>${site.url}${localPath(path, locale)}</loc>${alternatives}</url>`;
      }),
    )
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
