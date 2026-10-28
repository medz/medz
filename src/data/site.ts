export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const site = {
  name: 'Seven Du',
  email: 'hi@medz.dev',
  github: 'https://github.com/medz',
  url: 'https://medz.dev',
};

export const text = (locale: Locale, zh: string, en: string) => (locale === 'zh' ? zh : en);

export function localPath(path: string, locale: Locale) {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return `${locale === 'zh' ? '/zh' : ''}/${clean ? `${clean}/` : ''}`;
}

export function dateLabel(value: string) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(new Date(value))
    .replaceAll('-', '.');
}
