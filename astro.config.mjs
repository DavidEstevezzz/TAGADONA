import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tagadonaracing.es',
  integrations: [sitemap()],
  output: 'static'
});