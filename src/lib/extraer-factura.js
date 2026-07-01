// Extracción asistida de datos de facturas de gasto (PDF o imagen).
// - PDF con texto: se lee directamente con pdf.js.
// - PDF escaneado o imagen: OCR con Tesseract.js (idioma español).
// Las librerías se cargan desde CDN bajo demanda (solo al subir un archivo).
//
// Todo es "mejor esfuerzo": prerrellena el formulario para que la persona
// revise y confirme. Nunca sustituye la validación humana.

const PDFJS_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const TESSERACT_SRC = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';

// NIF del emisor (nuestro): se descarta si aparece en la factura de gasto,
// porque lo que interesa es el NIF/CIF del proveedor.
const NIF_PROPIO = '76667180S';

function cargarScript(src) {
  return new Promise((res, rej) => {
    if ([...document.scripts].some((s) => s.src === src)) return res();
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => res();
    s.onerror = () => rej(new Error('No se pudo cargar ' + src));
    document.head.appendChild(s);
  });
}

// Carga pdf.js y Tesseract.js una sola vez.
export async function cargarLibsOCR() {
  if (!window.pdfjsLib) {
    await cargarScript(PDFJS_SRC);
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
    }
  }
  if (!window.Tesseract) {
    await cargarScript(TESSERACT_SRC);
  }
}

function esPDF(file) {
  return file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
}

// Devuelve el texto de un archivo (PDF o imagen). onProgress recibe {pct,msg}.
export async function extraerTextoFactura(file, onProgress = () => {}) {
  await cargarLibsOCR();
  if (esPDF(file)) return await textoDePDF(file, onProgress);
  onProgress({ pct: 0, msg: 'Reconociendo texto de la imagen…' });
  return await ocrImagen(file, onProgress);
}

async function textoDePDF(file, onProgress) {
  onProgress({ pct: 5, msg: 'Leyendo PDF…' });
  const buf = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;

  let texto = '';
  const paginas = Math.min(pdf.numPages, 5);
  for (let i = 1; i <= paginas; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    texto += content.items.map((it) => it.str).join(' ') + '\n';
  }

  // Si el PDF trae texto real, lo usamos tal cual.
  if (texto.replace(/\s/g, '').length >= 40) {
    onProgress({ pct: 100, msg: 'Texto extraído del PDF.' });
    return texto;
  }

  // PDF escaneado (sin capa de texto): renderizamos y aplicamos OCR.
  onProgress({ pct: 0, msg: 'PDF escaneado: aplicando OCR…' });
  let ocr = '';
  const paginasOcr = Math.min(pdf.numPages, 3);
  for (let i = 1; i <= paginasOcr; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    ocr += (await recognize(canvas, (p) =>
      onProgress({ pct: p, msg: `OCR página ${i}/${paginasOcr}…` })
    )) + '\n';
  }
  return ocr;
}

async function ocrImagen(file, onProgress) {
  const url = URL.createObjectURL(file);
  try {
    return await recognize(url, (p) =>
      onProgress({ pct: p, msg: 'Reconociendo texto…' })
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function recognize(imagen, onPct) {
  const { data } = await window.Tesseract.recognize(imagen, 'spa', {
    logger: (m) => {
      if (m.status === 'recognizing text') onPct(Math.round(m.progress * 100));
    },
  });
  return data.text || '';
}

// ===== Heurísticas de parseo =====

const RE_MONEY = /\d{1,3}(?:[.\s]\d{3})*(?:,\d{2})|\d+[.,]\d{2}/g;

function aNumero(str) {
  if (str == null) return null;
  let s = String(str).replace(/[^\d.,]/g, '');
  if (!s) return null;
  const hasComa = s.includes(',');
  const hasPunto = s.includes('.');
  if (hasComa && hasPunto) s = s.replace(/\./g, '').replace(',', '.'); // 1.234,56
  else if (hasComa) s = s.replace(',', '.'); // 1234,56
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function buscarFecha(texto) {
  let m = texto.match(/\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})\b/);
  if (m) {
    let [, d, mo, y] = m;
    if (y.length === 2) y = '20' + y;
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  m = texto.match(/\b(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})\b/);
  if (m) {
    const [, y, mo, d] = m;
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  const meses = {
    enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6, julio: 7,
    agosto: 8, septiembre: 9, setiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
  };
  m = texto.match(/\b(\d{1,2})\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})\b/i);
  if (m) {
    const mo = meses[m[2].toLowerCase()];
    if (mo) return `${m[3]}-${String(mo).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  }
  return '';
}

function buscarNIF(texto) {
  const t = texto.toUpperCase();
  const matches =
    t.match(/\b([A-Z]\d{7}[0-9A-Z]|\d{8}[A-Z]|[XYZ]\d{7}[A-Z])\b/g) || [];
  const filtrados = matches.filter((x) => x !== NIF_PROPIO);
  return (filtrados[0] || matches[0] || '').replace(/\s+/g, '');
}

function buscarTotal(texto) {
  const lineas = texto.split(/\n/);
  const candidatos = [];
  lineas.forEach((l) => {
    if (/total/i.test(l) && !/subtotal|base|imponible/i.test(l)) {
      const m = l.match(RE_MONEY);
      if (m) {
        const n = aNumero(m[m.length - 1]);
        if (n != null) candidatos.push(n);
      }
    }
  });
  if (candidatos.length) return Math.max(...candidatos);
  // Sin etiqueta "total": tomamos el mayor importe con 2 decimales del documento.
  const todos = (texto.match(RE_MONEY) || []).map(aNumero).filter((x) => x != null);
  return todos.length ? Math.max(...todos) : null;
}

function buscarBaseEIva(texto) {
  const lineas = texto.split(/\n/);
  let base = null;
  let ivaPct = null;
  lineas.forEach((l) => {
    if (/base\s*imponible/i.test(l)) {
      const m = l.match(RE_MONEY);
      if (m) base = aNumero(m[m.length - 1]);
    }
    const pm = l.match(/i\.?v\.?a\.?\D{0,6}(\d{1,2})\s*%/i);
    if (pm) ivaPct = parseInt(pm[1], 10);
  });
  return { base, ivaPct };
}

function buscarProveedor(texto) {
  const lineas = texto
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  for (const l of lineas) {
    if (/factura|invoice|presupuesto|ticket|n[ºo]\.?\s*factura|fecha/i.test(l)) continue;
    if (l.replace(/[^a-záéíóúñ]/gi, '').length >= 4) return l.slice(0, 80);
  }
  return '';
}

// Analiza el texto y devuelve los campos detectados (los no hallados van vacíos).
export function parsearCamposFactura(texto) {
  const t = texto || '';
  const total = buscarTotal(t);
  const { base, ivaPct } = buscarBaseEIva(t);
  return {
    fecha: buscarFecha(t),
    proveedor_nombre: buscarProveedor(t),
    proveedor_nif: buscarNIF(t),
    base,
    iva_pct: ivaPct,
    total,
  };
}
