// ============================================================
//  optimize-images.mjs — Optimización de imágenes (una sola vez)
// ------------------------------------------------------------
//  Reduce el peso de las fotos sin cambiar su aspecto real:
//    · Fotos de motos: se reescriben con un nombre limpio y en
//      minúsculas ({slug}-{n}.jpg), redimensionadas a un máximo
//      razonable y recomprimidas. Como las fotos solo se
//      referencian desde src/data/motos.js, después hay que
//      actualizar allí los nombres (este script imprime el mapa).
//    · Imágenes sueltas (hero, logo, servicios, blog, marcas):
//      se optimizan EN EL MISMO archivo, conservando nombre y
//      formato, para no romper ninguna referencia ni el OG/schema.
//
//  Uso:  node scripts/optimize-images.mjs
//  Requiere sharp (ya viene con Astro).
// ============================================================
import sharp from 'sharp';
import { readFileSync, writeFileSync, statSync, existsSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { motos } from '../src/data/motos.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const img = join(root, 'public', 'img');
const kb = (n) => Math.round(n / 1024) + ' KB';

let before = 0, after = 0;

// --- 1) Fotos de motos -> {slug}-{n}.jpg (máx 1600px, calidad 82) ---
const mapa = {}; // slug -> [nuevosNombres]
const aBorrar = new Set();

for (const m of motos) {
  const nuevos = [];
  for (let i = 0; i < m.fotos.length; i++) {
    const orig = m.fotos[i];
    const src = join(img, orig);
    if (!existsSync(src)) { console.warn(`  (aviso) no existe ${orig}, se omite`); nuevos.push(orig); continue; }
    const nuevo = `${m.slug}-${i + 1}.jpg`;
    const dst = join(img, nuevo);
    before += statSync(src).size;
    const buf = await sharp(src)
      .rotate() // respeta la orientación EXIF
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    writeFileSync(dst, buf);
    after += buf.length;
    nuevos.push(nuevo);
    if (orig !== nuevo) aBorrar.add(orig);
  }
  mapa[m.slug] = nuevos;
}

// Borra los ficheros originales que han quedado sustituidos (evita huérfanos).
for (const f of aBorrar) {
  const p = join(img, f);
  // Nunca borres algo que siga siendo un nombre nuevo válido.
  const siguenUsados = new Set(Object.values(mapa).flat());
  if (existsSync(p) && !siguenUsados.has(f)) unlinkSync(p);
}

// --- 2) Imágenes sueltas: optimizar en el sitio (mismo nombre y formato) ---
const sueltas = [
  { file: 'hero-taller.jpg', max: 1920, q: 80 },
  { file: 'logo.png', max: 640 },              // PNG con transparencia
  { file: 'quienes-somos.jpg', max: 1400, q: 80 },
  { file: 'cta-telefono.jpg', max: 1920, q: 80 },
  { file: 'servicio-llaves.jpg', max: 1200, q: 80 },
  { file: 'servicio-taller.jpg', max: 1200, q: 80 },
  { file: 'servicio-transferencia.png', max: 1200 },
  { file: 'favicon.png', max: 512 },
  { file: 'favicon-180.png', max: 180 },
];
for (const b of ['a2-honda-cb500', 'a2-kawasaki-z500', 'a2-voge-900-dsx', 'a2-yamaha-mt07', 'blog-revision-completa', 'blog-top-a2-2026', 'revision-chasis', 'revision-papeles']) {
  sueltas.push({ file: `blog/${b}.png`, max: 1400 });
}
for (const marca of ['aprilia', 'bmw', 'ducati', 'honda', 'husqvarna', 'kawasaki', 'ktm', 'suzuki', 'triumph', 'yamaha']) {
  sueltas.push({ file: `marcas/${marca}.png`, max: 240 });
}

for (const { file, max, q } of sueltas) {
  const p = join(img, file);
  if (!existsSync(p)) { console.warn(`  (aviso) no existe ${file}, se omite`); continue; }
  const sizeBefore = statSync(p).size;
  const ext = extname(file).toLowerCase();
  let pipe = sharp(p).rotate().resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true });
  if (ext === '.jpg' || ext === '.jpeg') pipe = pipe.jpeg({ quality: q ?? 80, mozjpeg: true });
  else if (ext === '.png') pipe = pipe.png({ compressionLevel: 9, palette: true });
  const buf = await pipe.toBuffer();
  // Solo sobrescribe si de verdad reducimos peso.
  if (buf.length < sizeBefore) {
    writeFileSync(p, buf);
    before += sizeBefore; after += buf.length;
  } else {
    before += sizeBefore; after += sizeBefore;
  }
}

console.log('\nNuevos nombres de fotos (pega en src/data/motos.js):');
for (const [slug, fotos] of Object.entries(mapa)) {
  console.log(`  ${slug}:`);
  console.log('    ' + JSON.stringify(fotos));
}
console.log(`\nPeso total  antes: ${kb(before)}  ->  después: ${kb(after)}  (${Math.round((1 - after / before) * 100)}% menos)`);
