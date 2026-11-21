import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { motos } from './src/data/motos.js';
import { business } from './src/config/business.js';

const imagenesPorPagina = new Map(
  motos.map(moto => [`/motos/${moto.slug}/`, moto.fotos.map(foto => `/img/${foto}`)])
);
imagenesPorPagina.set('/', [business.imagenSocial]);

export default defineConfig({
  site: business.dominio,
  // Fuerza una única forma de URL (con barra final) en todo el sitio:
  // enlaces internos, sitemap y canonical apuntan a lo mismo que sirve el
  // hosting (blog/index.html => /blog/), evitando redirecciones y bucles.
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({
    filter: page => !page.includes('/admin'),
    serialize(item) {
      const imagenes = imagenesPorPagina.get(new URL(item.url).pathname);
      if (!imagenes) return item;
      return { ...item, img: imagenes.map(ruta => new URL(ruta, item.url).href) };
    },
  })],
  output: 'static'
});