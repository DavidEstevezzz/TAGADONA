// ============================================================
//  validate-links.mjs — Enlaces internos rotos y avisos de SEO
// ------------------------------------------------------------
//  Se ejecuta DESPUÉS del build, sobre la carpeta dist/.
//  Comprueba que cada enlace interno (href que empieza por "/")
//  apunta a una página o recurso que existe en dist/, y avisa
//  de algunas cosas útiles:
//    · páginas sin <title> o sin <h1> / con más de un <h1>
//    · páginas con noindex (informativo)
//    · presencia de sitemap-index.xml y robots.txt
//
//  Uso:  npm run validate:links   (requiere haber hecho build)
// ============================================================
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

if (!existsSync(dist)) {
  console.error('✗ No existe dist/. Ejecuta primero "npm run build".');
  process.exit(1);
}

const errors = [];
const warnings = [];

// Recorre dist/ y junta todos los .html.
const htmlFiles = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (entry.endsWith('.html')) htmlFiles.push(p);
  }
};
walk(dist);

// ¿Existe la ruta interna dentro de dist/?
const resolveInternal = (href) => {
  let path = href.split('#')[0].split('?')[0];
  if (path === '') return true; // solo ancla o query
  if (!path.startsWith('/')) return true; // relativo: no lo comprobamos aquí
  const target = join(dist, path);
  if (extname(path)) return existsSync(target); // recurso con extensión (.jpg, .xml…)
  // Ruta de página: /algo/  ->  dist/algo/index.html
  return existsSync(join(target, 'index.html')) || existsSync(target + '.html') || existsSync(join(target, 'index.html'));
};

for (const file of htmlFiles) {
  const rel = file.replace(dist, '').replace(/\\/g, '/');
  const html = readFileSync(file, 'utf8');

  // --- Enlaces internos ---
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (/^(https?:|mailto:|tel:|data:|javascript:|#|\/\/)/i.test(href)) continue;
    if (!href.startsWith('/')) continue; // relativos u otros
    if (!resolveInternal(href)) errors.push(`✗ [${rel}] enlace interno roto → ${href}`);
  }

  // --- Un único H1 ---
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s === 0) warnings.push(`⚠ [${rel}] sin <h1>`);
  else if (h1s > 1) warnings.push(`⚠ [${rel}] ${h1s} elementos <h1> (debería haber uno)`);

  // --- Title ---
  if (!/<title>[^<]+<\/title>/.test(html)) warnings.push(`⚠ [${rel}] sin <title> o vacío`);

  // --- noindex (informativo) ---
  if (/name="robots"[^>]*content="[^"]*noindex/i.test(html)) warnings.push(`ℹ [${rel}] noindex`);
}

// --- Artefactos de SEO ---
if (!existsSync(join(dist, 'sitemap-index.xml'))) errors.push('✗ falta dist/sitemap-index.xml');
if (!existsSync(join(dist, 'robots.txt'))) errors.push('✗ falta dist/robots.txt');
if (!existsSync(join(dist, '404.html'))) warnings.push('⚠ no hay página 404 personalizada (dist/404.html)');

// --- Resultado ---
if (warnings.length) {
  console.log('\nAvisos:');
  warnings.forEach((w) => console.log('  ' + w));
}
if (errors.length) {
  console.log('\nErrores:');
  errors.forEach((e) => console.log('  ' + e));
  console.error(`\n✗ validate:links — ${errors.length} error(es) en ${htmlFiles.length} página(s).`);
  process.exit(1);
}
console.log(`\n✓ validate:links — ${htmlFiles.length} página(s) revisadas, sin enlaces internos rotos.`);
