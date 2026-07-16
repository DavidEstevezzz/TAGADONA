// ============================================================
//  validate-data.mjs — Comprobaciones de datos antes de publicar
// ------------------------------------------------------------
//  Detecta errores típicos al añadir una moto o un artículo:
//  slugs duplicados, estados mal escritos, precios no numéricos,
//  fotografías que no existen, motos sin foto, descripciones
//  vacías, imágenes de blog inexistentes…
//
//  Uso:  npm run validate:data     (o  node scripts/validate-data.mjs)
//  Sale con código 1 si hay errores, para poder encadenarlo en CI.
// ============================================================
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { motos } from '../src/data/motos.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = join(root, 'public', 'img');
const blogImgDir = join(root, 'public', 'img', 'blog');
const blogDir = join(root, 'src', 'content', 'blog');

const errors = [];
const warnings = [];
const err = (ctx, msg) => errors.push(`✗ [${ctx}] ${msg}`);
const warn = (ctx, msg) => warnings.push(`⚠ [${ctx}] ${msg}`);

// ---------- Motos ----------
const ESTADOS = ['Disponible', 'Reservada', 'Vendida'];
const currentYear = new Date().getFullYear();
const slugs = new Set();

motos.forEach((m, i) => {
  const ctx = `moto ${m.slug || '#' + i}`;

  // Slug: presente, único, en minúsculas y sin caracteres raros.
  if (!m.slug) {
    err(ctx, 'sin slug');
  } else {
    if (m.slug !== m.slug.toLowerCase()) err(ctx, `el slug debe ir en minúsculas: "${m.slug}"`);
    if (!/^[a-z0-9-]+$/.test(m.slug)) err(ctx, `slug con caracteres no válidos (solo a-z, 0-9 y guiones): "${m.slug}"`);
    if (slugs.has(m.slug)) err(ctx, `slug duplicado: "${m.slug}"`);
    slugs.add(m.slug);
  }

  // Campos de texto obligatorios.
  for (const f of ['marca', 'modelo', 'categoria', 'carnet', 'cilindrada', 'potencia', 'combustible']) {
    if (!m[f] || String(m[f]).trim() === '') err(ctx, `falta el campo "${f}"`);
  }

  // Estado válido.
  if (!ESTADOS.includes(m.estado)) err(ctx, `estado inválido: "${m.estado}" (válidos: ${ESTADOS.join(', ')})`);

  // Numéricos con rango razonable.
  if (typeof m.precio !== 'number' || !(m.precio > 0)) err(ctx, `precio no numérico o <= 0: ${JSON.stringify(m.precio)}`);
  if (typeof m.anio !== 'number' || m.anio < 1980 || m.anio > currentYear + 1) err(ctx, `año fuera de rango (1980-${currentYear + 1}): ${JSON.stringify(m.anio)}`);
  if (typeof m.km !== 'number' || m.km < 0) err(ctx, `kilómetros no numéricos o negativos: ${JSON.stringify(m.km)}`);

  // Descripción no vacía.
  const desc = Array.isArray(m.descripcion) ? m.descripcion.join('').trim() : String(m.descripcion || '').trim();
  if (!desc) err(ctx, 'descripción vacía');

  // Fotografías: al menos una, y que todas existan en public/img/.
  if (!Array.isArray(m.fotos) || m.fotos.length === 0) {
    err(ctx, 'sin fotografías (se necesita al menos una)');
  } else {
    m.fotos.forEach((f) => {
      if (!existsSync(join(imgDir, f))) err(ctx, `foto inexistente: public/img/${f}`);
    });
  }

  // Campos opcionales estructurados: se validan solo si están presentes.
  if (m.garantiaMeses != null && (typeof m.garantiaMeses !== 'number' || m.garantiaMeses < 0)) err(ctx, 'garantiaMeses debe ser un número >= 0');
  if (m.orden != null && typeof m.orden !== 'number') err(ctx, 'orden debe ser numérico');
  for (const campoFecha of ['fechaPublicacion', 'fechaActualizacion', 'fechaVenta']) {
    if (m[campoFecha] != null && Number.isNaN(Date.parse(m[campoFecha]))) err(ctx, `${campoFecha} no es una fecha válida (usa AAAA-MM-DD): ${JSON.stringify(m[campoFecha])}`);
  }
  // Una moto marcada como vendida sin fecha de venta no es un error, pero avisamos.
  if (m.estado === 'Vendida' && m.fechaVenta == null) warn(ctx, 'vendida sin "fechaVenta" (opcional, útil para el histórico)');
});

// ---------- Fotos huérfanas (aviso, no error) ----------
const usadas = new Set(motos.flatMap((m) => (Array.isArray(m.fotos) ? m.fotos : [])));
try {
  for (const f of readdirSync(imgDir)) {
    if (/\.(png|jpe?g|webp|avif)$/i.test(f) && !usadas.has(f)) {
      // Solo avisamos de fotos con pinta de ser de una moto (evita logos, hero, servicios…).
      if (/^\d|-\d|\d-/.test(f) || /(medley|honda|yamaha|tmax|tricity|nk|cb500|xsr|sh)/i.test(f)) {
        warn('img', `posible foto de moto sin usar: public/img/${f}`);
      }
    }
  }
} catch { /* carpeta img siempre existe */ }

// ---------- Blog ----------
const parseFrontmatter = (raw) => {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
  }
  return data;
};

try {
  for (const file of readdirSync(blogDir).filter((f) => f.endsWith('.md'))) {
    const ctx = `blog ${file}`;
    const fm = parseFrontmatter(readFileSync(join(blogDir, file), 'utf8'));
    if (!fm) { err(ctx, 'sin frontmatter válido'); continue; }
    for (const f of ['titulo', 'fecha', 'imagen', 'resumen']) {
      if (!fm[f]) err(ctx, `falta el campo "${f}" en el frontmatter`);
    }
    if (fm.imagen && !existsSync(join(blogImgDir, fm.imagen))) err(ctx, `imagen inexistente: public/img/blog/${fm.imagen}`);
    if (fm.fecha && Number.isNaN(Date.parse(fm.fecha))) err(ctx, `fecha no válida: ${fm.fecha}`);
    if (fm.actualizado && Number.isNaN(Date.parse(fm.actualizado))) err(ctx, `"actualizado" no es una fecha válida: ${fm.actualizado}`);
  }
} catch { /* carpeta de blog opcional */ }

// ---------- Resultado ----------
if (warnings.length) {
  console.log('\nAvisos:');
  warnings.forEach((w) => console.log('  ' + w));
}
if (errors.length) {
  console.log('\nErrores:');
  errors.forEach((e) => console.log('  ' + e));
  console.error(`\n✗ validate:data — ${errors.length} error(es), ${warnings.length} aviso(s).`);
  process.exit(1);
}
console.log(`\n✓ validate:data — ${motos.length} moto(s) correctas, ${warnings.length} aviso(s).`);
