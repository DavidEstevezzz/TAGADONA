import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tagadonaracing.es',
  // Fuerza una única forma de URL (con barra final) en todo el sitio:
  // enlaces internos, sitemap y canonical apuntan a lo mismo que sirve el
  // hosting (blog/index.html => /blog/), evitando redirecciones y bucles.
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (page) => !page.includes('/admin') })],
  output: 'static'
});