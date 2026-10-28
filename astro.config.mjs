import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://medz.dev',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
