// Generador de PDF de facturas para Tagadona Racing
// Usa jsPDF, cargado desde CDN en admin.astro

const COL = {
  dark: [26, 21, 13],
  dark2: [20, 17, 14],
  orange: [217, 122, 40],
  orange2: [238, 138, 44],
  text: [40, 34, 30],
  gris: [115, 106, 98],
  grisClaro: [248, 246, 244],
  linea: [222, 216, 210],
  white: [255, 255, 255],
};

let logoData = null;

async function getLogo() {
  if (logoData) return logoData;

  try {
    const resp = await fetch('/img/logo.png');
    const blob = await resp.blob();

    logoData = await new Promise((res) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(blob);
    });

    return logoData;
  } catch (e) {
    return null;
  }
}

const eur = (n) =>
  Number(n || 0).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' €';

const fechaEs = (f) => (f ? f.split('-').reverse().join('/') : '');

const safe = (v) => String(v ?? '').trim();

const EMISOR = {
  nombre: 'MARIO LÓPEZ JIMÉNEZ',
  dir: 'C/ Pago Cerro de la Cruz, 112',
  loc: 'Cogollos de la Vega – Granada',
  nif: '76667180S',
};

const CONTACTO = {
  marca: 'Tagadona Racing',
  ciudad: 'Granada',
  telefono: '+34 644 904 418',
  email: 'info@tagadonaracing.com',
};

function drawLines(doc, lines, x, y, lineH = 5) {
  lines.forEach((line) => {
    doc.text(line, x, y);
    y += lineH;
  });
  return y;
}

function splitRows(doc, rows, maxWidth) {
  const out = [];

  rows.filter(Boolean).forEach((row) => {
    const parts = doc.splitTextToSize(row, maxWidth);
    out.push(...parts);
  });

  return out;
}

function drawInfoCard(doc, { x, y, w, h, title, lines }) {
  doc.setFillColor(...COL.grisClaro);
  doc.roundedRect(x, y, w, h, 2.5, 2.5, 'F');

  doc.setDrawColor(235, 230, 224);
  doc.roundedRect(x, y, w, h, 2.5, 2.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COL.orange);
  doc.text(title, x + 5, y + 7);

  if (!lines.length) return;

  doc.setFontSize(9);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COL.text);
  doc.text(lines[0], x + 5, y + 14, { maxWidth: w - 10 });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COL.gris);

  let ly = y + 20;
  lines.slice(1).forEach((line) => {
    doc.text(line, x + 5, ly, { maxWidth: w - 10 });
    ly += 5;
  });
}

function cleanFileName(value) {
  return safe(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

export async function construirFacturaPDF(f) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');

  const W = 210;
  const H = 297;
  const margin = 16;
  const contentW = W - margin * 2;

  const base = Number(f.importe || 0);
  const ivaImporte = f.tipo === 'IVA' ? +(base * 0.21).toFixed(2) : 0;
  const total = Number(f.total ?? base + ivaImporte);

  const logo = await getLogo();

  // ===== CABECERA =====
  const headerH = 46;

  doc.setFillColor(...COL.dark);
  doc.rect(0, 0, W, headerH, 'F');

  doc.setFillColor(...COL.orange);
  doc.rect(0, headerH, W, 1.4, 'F');

  if (logo) {
    try {
      doc.addImage(logo, 'PNG', margin, 8, 30, 30);
    } catch (e) {}
  }

  doc.setTextColor(...COL.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('FACTURA', W - margin, 19, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...COL.orange2);
  doc.text(safe(f.numero), W - margin, 28, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(220, 215, 210);
  doc.text('Fecha: ' + fechaEs(f.fecha), W - margin, 36, { align: 'right' });

  // ===== DATOS SUPERIORES =====
  const cardY = 58;
  const gap = 10;
  const cardW = (contentW - gap) / 2;
  const cardTextW = cardW - 10;

  const emisorLines = splitRows(
    doc,
    [
      EMISOR.nombre,
      EMISOR.dir,
      EMISOR.loc,
      'N.I.F: ' + EMISOR.nif,
    ],
    cardTextW
  );

  const clienteLines = splitRows(
    doc,
    [
      safe(f.cliente_nombre) || '—',
      f.cliente_nif ? 'NIF/NIE: ' + safe(f.cliente_nif) : '',
      f.cliente_direccion ? safe(f.cliente_direccion) : '',
    ],
    cardTextW
  );

  const cardH = Math.max(
    38,
    17 + Math.max(emisorLines.length, clienteLines.length) * 5
  );

  drawInfoCard(doc, {
    x: margin,
    y: cardY,
    w: cardW,
    h: cardH,
    title: 'DATOS DEL VENDEDOR',
    lines: emisorLines,
  });

  drawInfoCard(doc, {
    x: margin + cardW + gap,
    y: cardY,
    w: cardW,
    h: cardH,
    title: 'DATOS DEL CLIENTE',
    lines: clienteLines,
  });

  // ===== TABLA CONCEPTO =====
  let y = cardY + cardH + 14;

  doc.setFillColor(...COL.dark);
  doc.roundedRect(margin, y, contentW, 10, 1.2, 1.2, 'F');

  doc.setTextColor(...COL.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('CONCEPTO', margin + 5, y + 6.5);
  doc.text('IMPORTE', W - margin - 5, y + 6.5, { align: 'right' });

  y += 10;

  const detailRows = [];
  if (f.moto_marca) detailRows.push('Marca: ' + safe(f.moto_marca));
  if (f.moto_modelo) detailRows.push('Modelo: ' + safe(f.moto_modelo));
  if (f.moto_matricula) detailRows.push('Matrícula: ' + safe(f.moto_matricula));
  if (f.moto_bastidor) detailRows.push('Bastidor: ' + safe(f.moto_bastidor));
  if (f.cambio_nombre) detailRows.push('Cambio de nombre: ' + safe(f.cambio_nombre));

  const detailLines = splitRows(doc, detailRows, 112);
  const bodyH = Math.max(42, 17 + detailLines.length * 5);

  doc.setFillColor(252, 250, 248);
  doc.roundedRect(margin, y, contentW, bodyH, 1.5, 1.5, 'F');

  doc.setDrawColor(...COL.linea);
  doc.roundedRect(margin, y, contentW, bodyH, 1.5, 1.5, 'S');

  doc.setTextColor(...COL.text);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Venta de vehículo usado', margin + 5, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COL.gris);
  drawLines(doc, detailLines, margin + 5, y + 15, 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COL.text);
  doc.text(eur(base), W - margin - 5, y + 9, { align: 'right' });

  y += bodyH + 10;

  // ===== TOTALES =====
  const totalsW = 82;
  const totalsX = W - margin - totalsW;
  const valueX = W - margin - 5;
  const labelX = totalsX + 6;

  if (f.tipo === 'IVA') {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...COL.gris);

    doc.text('Base imponible', labelX, y);
    doc.text(eur(base), valueX, y, { align: 'right' });

    doc.text('IVA (21%)', labelX, y + 6);
    doc.text(eur(ivaImporte), valueX, y + 6, { align: 'right' });

    y += 13;
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...COL.gris);

    const rebuInfo = 'IVA incluido en el precio según Régimen Especial de Bienes Usados.';
    const rebuLines = doc.splitTextToSize(rebuInfo, totalsW);
    doc.text(rebuLines, totalsX, y);
    y += rebuLines.length * 4.5 + 4;
  }

  doc.setFillColor(...COL.orange);
  doc.roundedRect(totalsX, y - 5, totalsW, 14, 2, 2, 'F');

  doc.setTextColor(...COL.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.text('TOTAL', labelX, y + 3.5);
  doc.text(eur(total), valueX, y + 3.5, { align: 'right' });

  y += 25;

  // ===== CONDICIONES Y NOTA LEGAL =====
  doc.setDrawColor(...COL.linea);
  doc.line(margin, y, W - margin, y);

  y += 8;

  const condiciones = [];

  if (f.tipo === 'REBU') {
    condiciones.push(
      'Operación acogida al Régimen Especial de Bienes Usados. IVA incluido en el precio, no desglosable en factura.'
    );
  }

  if (f.garantia) {
    condiciones.push('Garantía: ' + safe(f.garantia));
  }

  if (f.forma_pago) {
    condiciones.push('Forma de pago: ' + safe(f.forma_pago));
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COL.gris);

  condiciones.forEach((txt, index) => {
    const lines = doc.splitTextToSize(txt, contentW);
    if (index === 0 && f.tipo === 'REBU') {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COL.text);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COL.gris);
    }

    doc.text(lines, margin, y);
    y += lines.length * 5 + 1;
  });

  // ===== PIE FIJO =====
  doc.setDrawColor(235, 230, 224);
  doc.line(margin, H - 19, W - margin, H - 19);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(170, 164, 158);

  doc.text(
    `${CONTACTO.marca} · ${EMISOR.nombre} · N.I.F ${EMISOR.nif}`,
    W / 2,
    H - 13,
    { align: 'center' }
  );

  doc.text(
    `${CONTACTO.ciudad} · ${CONTACTO.email} · ${CONTACTO.telefono}`,
    W / 2,
    H - 8,
    { align: 'center' }
  );

  return doc;
}

function lineasGastoPDF(g) {
  const raw = Array.isArray(g?.lineas) ? g.lineas : [];
  const lineas = raw.map((l) => ({
    concepto: safe(l?.concepto),
    base: Number(l?.base ?? l?.importe ?? 0) || 0,
  })).filter((l) => l.concepto || l.base);

  if (lineas.length) return lineas;
  return [{
    concepto: safe(g?.concepto) || 'Gasto',
    base: Number(g?.base || 0) || 0,
  }];
}

export async function construirGastoPDF(g) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');

  const W = 210;
  const H = 297;
  const margin = 16;
  const contentW = W - margin * 2;
  const logo = await getLogo();
  const ref = safe(g.id).slice(0, 8).toUpperCase();

  const base = Number(g.base || 0);
  const ivaPct = Number(g.iva_pct || 0);
  const ivaImporte = Number(g.iva_importe ?? +(base * ivaPct / 100).toFixed(2));
  const total = Number(g.total ?? base + ivaImporte);
  const lineas = lineasGastoPDF(g);

  const headerH = 46;
  doc.setFillColor(...COL.dark);
  doc.rect(0, 0, W, headerH, 'F');
  doc.setFillColor(...COL.orange);
  doc.rect(0, headerH, W, 1.4, 'F');

  if (logo) {
    try {
      doc.addImage(logo, 'PNG', margin, 8, 30, 30);
    } catch (e) {}
  }

  doc.setTextColor(...COL.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(21);
  doc.text('FACTURA DE GASTO', W - margin, 19, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...COL.orange2);
  doc.text(ref ? 'Ref. ' + ref : 'Gasto', W - margin, 28, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(220, 215, 210);
  doc.text('Fecha: ' + fechaEs(g.fecha), W - margin, 36, { align: 'right' });

  const cardY = 58;
  const gap = 10;
  const cardW = (contentW - gap) / 2;
  const cardTextW = cardW - 10;

  const proveedorLines = splitRows(
    doc,
    [
      safe(g.proveedor_nombre) || '—',
      g.proveedor_nif ? 'NIF/CIF: ' + safe(g.proveedor_nif) : '',
    ],
    cardTextW
  );

  const receptorLines = splitRows(
    doc,
    [
      CONTACTO.marca,
      EMISOR.nombre,
      EMISOR.dir,
      EMISOR.loc,
      'N.I.F: ' + EMISOR.nif,
    ],
    cardTextW
  );

  const cardH = Math.max(
    40,
    17 + Math.max(proveedorLines.length, receptorLines.length) * 5
  );

  drawInfoCard(doc, {
    x: margin,
    y: cardY,
    w: cardW,
    h: cardH,
    title: 'DATOS DEL PROVEEDOR',
    lines: proveedorLines,
  });

  drawInfoCard(doc, {
    x: margin + cardW + gap,
    y: cardY,
    w: cardW,
    h: cardH,
    title: 'DATOS DEL RECEPTOR',
    lines: receptorLines,
  });

  let y = cardY + cardH + 14;

  doc.setFillColor(...COL.dark);
  doc.roundedRect(margin, y, contentW, 10, 1.2, 1.2, 'F');
  doc.setTextColor(...COL.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('CONCEPTO', margin + 5, y + 6.5);
  doc.text('BASE', W - margin - 5, y + 6.5, { align: 'right' });
  y += 10;

  lineas.forEach((linea, index) => {
    const concepto = safe(linea.concepto) || `Línea ${index + 1}`;
    const lines = doc.splitTextToSize(concepto, 122);
    const rowH = Math.max(12, 7 + lines.length * 4.5);

    if (y + rowH > H - 55) {
      doc.addPage();
      y = margin;
    }

    doc.setFillColor(index % 2 ? 255 : 252, index % 2 ? 255 : 250, index % 2 ? 255 : 248);
    doc.roundedRect(margin, y, contentW, rowH, 1.2, 1.2, 'F');
    doc.setDrawColor(...COL.linea);
    doc.roundedRect(margin, y, contentW, rowH, 1.2, 1.2, 'S');

    doc.setTextColor(...COL.text);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text(lines, margin + 5, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.text(eur(linea.base), W - margin - 5, y + 7, { align: 'right' });
    y += rowH + 2;
  });

  y += 8;
  if (y > H - 80) {
    doc.addPage();
    y = margin;
  }
  const totalsW = 82;
  const totalsX = W - margin - totalsW;
  const valueX = W - margin - 5;
  const labelX = totalsX + 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...COL.gris);
  doc.text('Base imponible', labelX, y);
  doc.text(eur(base), valueX, y, { align: 'right' });
  doc.text(`IVA (${ivaPct}%)`, labelX, y + 6);
  doc.text(eur(ivaImporte), valueX, y + 6, { align: 'right' });
  y += 13;

  doc.setFillColor(...COL.orange);
  doc.roundedRect(totalsX, y - 5, totalsW, 14, 2, 2, 'F');
  doc.setTextColor(...COL.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.text('TOTAL', labelX, y + 3.5);
  doc.text(eur(total), valueX, y + 3.5, { align: 'right' });
  y += 24;

  const notas = [];
  if (g.categoria) notas.push('Categoría: ' + safe(g.categoria));
  if (g.forma_pago) notas.push('Forma de pago: ' + safe(g.forma_pago));
  if (g.archivo_nombre) notas.push('Adjunto original: ' + safe(g.archivo_nombre));
  if (g.notas) notas.push('Notas: ' + safe(g.notas));

  if (notas.length) {
    doc.setDrawColor(...COL.linea);
    doc.line(margin, y, W - margin, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...COL.gris);
    notas.forEach((txt) => {
      const lines = doc.splitTextToSize(txt, contentW);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 1;
    });
  }

  doc.setDrawColor(235, 230, 224);
  doc.line(margin, H - 19, W - margin, H - 19);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(170, 164, 158);
  doc.text(
    `${CONTACTO.marca} · ${EMISOR.nombre} · N.I.F ${EMISOR.nif}`,
    W / 2,
    H - 13,
    { align: 'center' }
  );
  doc.text(
    `${CONTACTO.ciudad} · ${CONTACTO.email} · ${CONTACTO.telefono}`,
    W / 2,
    H - 8,
    { align: 'center' }
  );

  return doc;
}

export async function descargarPDF(f) {
  const doc = await construirFacturaPDF(f);
  const cliente = cleanFileName(f.cliente_nombre || 'factura');
  doc.save(`${safe(f.numero)}_${cliente}.pdf`);
}

export async function descargarGastoPDF(g) {
  const doc = await construirGastoPDF(g);
  const fecha = safe(g.fecha) || new Date().toISOString().slice(0, 10);
  const proveedor = cleanFileName(g.proveedor_nombre || 'proveedor');
  doc.save(`gasto_${fecha}_${proveedor}.pdf`);
}

export async function verPDF(f) {
  const doc = await construirFacturaPDF(f);
  window.open(doc.output('bloburl'), '_blank');
}

export async function pdfBlob(f) {
  const doc = await construirFacturaPDF(f);
  return doc.output('blob');
}
