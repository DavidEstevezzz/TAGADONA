/* =============================================================
   TAGADONA RACING · PIEZAS DE CARPA — GRÁFICAS EN MILÍMETROS
   Cada gráfica es un <g> en coordenadas reales (1 unidad = 1 mm).
   La misma gráfica se usa en la vista plana, en las maquetas 3D
   y en la tienda, así que lo que se ve es siempre la misma pieza.
   ============================================================= */

const C = {
  olive: '#1f2315', olive2: '#2a3020', olive3: '#373f29', olive4: '#4a5335',
  orange: '#D97A28', orangeD: '#B8621A', cream: '#F2EADB',
  black: '#141110', ink: '#1d1917', asphalt: '#1b1918',
  paper: '#E6E2DA', paper2: '#D6D0C6', concrete: '#8C877F', concreteD: '#77726b',
};
const F = {
  germ: "'Germania One', Georgia, serif",
  osw: "Oswald, 'Arial Narrow', sans-serif",
  pop: "Poppins, Arial, sans-serif",
};

/* ---------- utilidades ---------- */
function T(x, y, s, txt, o = {}) {
  return `<text x="${x}" y="${y}" font-family="${o.f || F.osw}" font-size="${s}" font-weight="${o.w || 400}" fill="${o.c || C.cream}" text-anchor="${o.a || 'start'}" letter-spacing="${o.ls || 0}"${o.op ? ` opacity="${o.op}"` : ''}${o.tl ? ` textLength="${o.tl}" lengthAdjust="spacingAndGlyphs"` : ''}>${txt}</text>`;
}
// Logo: el PNG mide 640 px y el sello ocupa 61–588 px. d = diámetro visible del sello.
function LOGOG(cx, cy, d) {
  const s = d * 640 / 527;
  return `<image href="${LOGO}" x="${cx - s / 2}" y="${cy - s / 2}" width="${s}" height="${s}"/>`;
}
function QRG(key, x, y, size, fg = '#141110', bg = '#ffffff', pad = 0.08) {
  const q = QR[key];
  const p = size * pad;
  return `<rect x="${x - p}" y="${y - p}" width="${size + 2 * p}" height="${size + 2 * p}" fill="${bg}" rx="${p * 0.4}"/>` +
    `<g transform="translate(${x} ${y}) scale(${size / q.n})"><path d="${q.d}" fill="${fg}" shape-rendering="crispEdges"/></g>`;
}
function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// Perfil de sierra: polígono desde x0 a x1, base inferior "bottom", cresta alrededor de "y" con amplitud "amp".
function ridge(x0, x1, y, amp, bottom, seed, fill, n = 9) {
  const r = rng(seed); const pts = [[x0, y + amp * (r() - .3)]];
  for (let i = 1; i < n; i++) {
    const x = x0 + (x1 - x0) * i / n + (r() - .5) * (x1 - x0) / n * .5;
    pts.push([x, y - amp * (i % 2 ? r() * .9 + .1 : -r() * .35)]);
  }
  pts.push([x1, y + amp * (r() - .3)]);
  return `<polygon fill="${fill}" points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')} ${x1},${bottom} ${x0},${bottom}"/>`;
}
function pine(x, y, h, fill) { // x,y = base del tronco
  const w = h * .42;
  return `<g fill="${fill}"><rect x="${x - h * .03}" y="${y - h * .12}" width="${h * .06}" height="${h * .12}"/>` +
    `<polygon points="${x},${y - h} ${x + w * .55},${y - h * .55} ${x - w * .55},${y - h * .55}"/>` +
    `<polygon points="${x},${y - h * .78} ${x + w * .8},${y - h * .3} ${x - w * .8},${y - h * .3}"/>` +
    `<polygon points="${x},${y - h * .55} ${x + w},${y - h * .1} ${x - w},${y - h * .1}"/></g>`;
}
// Curvas de nivel (topográficas) para la alfombra A
function topo(cx, cy, levels, r0, step, seed, stroke, sw) {
  const r = rng(seed); const harm = [1, 2, 3, 5].map(k => [k, r() * .16 / k, r() * 6.28]);
  let out = '';
  for (let l = 0; l < levels; l++) {
    const R = r0 + l * step; let d = '';
    for (let i = 0; i <= 96; i++) {
      const a = i / 96 * Math.PI * 2;
      let k = 1; harm.forEach(([h, amp, ph]) => k += amp * Math.sin(h * a + ph + l * .07));
      const x = cx + Math.cos(a) * R * k * 1.55, y = cy + Math.sin(a) * R * k * .85;
      d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    }
    out += `<path d="${d}Z" fill="none" stroke="${stroke}" stroke-width="${sw}"/>`;
  }
  return out;
}
// Iconos de trazo (caja de 24)
const ICO = {
  check: 'M4 12.5l5 5L20 6.5',
  wrench: 'M14.5 5.5a4 4 0 0 0 5 5l-9 9a2.5 2.5 0 0 1-3.5-3.5l9-9z',
  shield: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z M8.5 12l2.5 2.5L16 9.5',
  doc: 'M7 3h7l4 4v14H7z M14 3v4h4 M9.5 12h6 M9.5 15.5h6',
  hand: 'M3 13l4-3h5l2 2h-4 M10 12h5l5-3 1 2-6 5H8l-5 1',
  chat: 'M4 5h16v11H9l-5 4z',
  pin: 'M12 21s-6-6.2-6-11a6 6 0 0 1 12 0c0 4.8-6 11-6 11z M12 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z',
};
function ICON(k, x, y, size, color, sw = 2) {
  return `<g transform="translate(${x} ${y}) scale(${size / 24})"><path d="${ICO[k]}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
}

/* =============================================================
   1 · LONA 2000 × 1000 (sin sangrado; margen de trabajo 110)
   ============================================================= */
const LONA = {};
LONA.A = (bg = C.olive) => `
<rect x="0" y="0" width="2000" height="1000" fill="${bg}"/>
<circle cx="560" cy="1010" r="520" fill="${C.olive2}"/>
${ridge(-10, 2010, 830, 90, 1000, 7, C.olive2, 11)}
${ridge(-10, 2010, 900, 70, 1000, 21, C.olive3, 14)}
${pine(1560, 930, 150, C.olive4)}${pine(1640, 945, 110, C.olive4)}${pine(1720, 925, 170, C.olive4)}${pine(330, 940, 120, C.olive4)}
<rect x="0" y="955" width="2000" height="45" fill="${C.orange}"/>
${LOGOG(420, 480, 560)}
${T(800, 200, 36, 'GARAGE · COGOLLOS DE LA VEGA · GRANADA', { c: C.orange, w: 500, ls: 9 })}
${T(792, 390, 200, 'Compraventa', { f: F.germ, c: C.cream })}
${T(792, 565, 200, 'de motos', { f: F.germ, c: C.cream })}
<rect x="800" y="610" width="140" height="8" fill="${C.orange}"/>
${T(800, 682, 42, 'Revisadas en nuestro taller · Garantía · Transferencia', { f: F.pop, c: C.cream, op: .92 })}
${ICON('chat', 800, 728, 64, C.orange, 2.4)}
${T(885, 785, 76, 'WhatsApp 644 904 418', { c: C.orange, w: 600 })}
${T(802, 862, 44, 'tagadonaracing.es  ·  @tagadonaracing', { c: C.cream, w: 500 })}`;

LONA.B = (bg = C.black) => `
<rect x="0" y="0" width="2000" height="1000" fill="${bg}"/>
<polygon points="1290,0 1500,0 1300,1000 1090,1000" fill="${C.orange}"/>
<polygon points="1540,0 1580,0 1380,1000 1340,1000" fill="${C.cream}"/>
<polygon points="1615,0 1640,0 1440,1000 1415,1000" fill="${C.orange}"/>
${T(118, 190, 38, 'TAGADONA RACING · COMPRAVENTA DE MOTOS', { c: C.orange, w: 500, ls: 8 })}
${T(110, 410, 215, '¿VENDES', { w: 700, c: C.cream })}
${T(110, 630, 215, 'TU MOTO?', { w: 700, c: C.cream })}
${T(118, 760, 56, 'Te la tasamos sin compromiso', { f: F.pop, w: 500, c: C.cream })}
${ICON('chat', 118, 790, 70, C.orange, 2.4)}
${T(205, 855, 92, '644 904 418', { w: 700, c: C.orange })}
<g>
<rect x="1520" y="0" width="480" height="1000" fill="${bg}"/>
${LOGOG(1710, 290, 300)}
${[['1', 'Nos cuentas tu moto', 'por WhatsApp, con fotos'], ['2', 'Te damos una tasación', 'orientativa, sin compromiso'], ['3', 'La vemos con cita', 'en Cogollos de la Vega'], ['4', 'Cerramos y pagamos', 'y hacemos la transferencia']].map((s, i) => {
  const y = 530 + i * 95;
  return `<rect x="1545" y="${y - 50}" width="58" height="58" fill="${C.orange}"/>${T(1574, y - 4, 42, s[0], { w: 700, c: C.black, a: 'middle' })}${T(1620, y - 18, 31, s[1], { w: 600, c: C.cream })}${T(1620, y + 14, 23, s[2], { f: F.pop, c: C.cream, op: .7 })}`;
}).join('')}
</g>`;

LONA.C = () => `
<rect x="0" y="0" width="2000" height="1000" fill="${C.paper}"/>
<rect x="0" y="0" width="2000" height="40" fill="${C.orange}"/>
${LOGOG(255, 285, 290)}
${T(450, 225, 34, 'TAGADONA RACING · COMPRAVENTA DE MOTOS EN GRANADA', { w: 500, c: C.black, ls: 7 })}
${T(445, 365, 104, 'Motos revisadas, una a una.', { f: F.pop, w: 700, c: C.black, ls: -3 })}
<line x1="110" y1="465" x2="1890" y2="465" stroke="${C.black}" stroke-width="3"/>
${[['wrench', 'Taller propio', 'Cada moto pasa por', 'nuestro taller antes', 'de venderse.'],
   ['shield', 'Garantía', 'Incluida en todas', 'las motos revisadas.', ''],
   ['doc', 'Transferencia', 'Nos ocupamos del', 'papeleo del cambio', 'de nombre.'],
   ['hand', 'Trato directo', 'Sin intermediarios', 'y sin letra pequeña.', '']].map((c, i) => {
  const x = 110 + i * 445;
  return `${i ? `<line x1="${x - 25}" y1="500" x2="${x - 25}" y2="745" stroke="${C.black}" stroke-width="2" opacity=".35"/>` : ''}${ICON(c[0], x, 505, 66, C.orange, 2.2)}${T(x + 84, 555, 50, c[1], { w: 600, c: C.black })}${T(x, 630, 30, c[2], { f: F.pop, c: C.black, op: .8 })}${T(x, 668, 30, c[3], { f: F.pop, c: C.black, op: .8 })}${T(x, 706, 30, c[4], { f: F.pop, c: C.black, op: .8 })}`;
}).join('')}
<rect x="0" y="770" width="2000" height="230" fill="${C.black}"/>
${T(110, 860, 72, 'WhatsApp 644 904 418', { w: 700, c: C.orange })}
${T(900, 832, 44, 'tagadonaracing.es', { w: 500, c: C.cream })}
${T(900, 872, 22, 'COGOLLOS DE LA VEGA · CON CITA PREVIA', { f: F.pop, c: C.cream, op: .7 })}
${T(1665, 836, 26, 'Ver motos', { f: F.pop, c: C.cream, a: 'end', op: .85 })}
${T(1665, 870, 26, 'disponibles →', { f: F.pop, c: C.cream, a: 'end', op: .85 })}
${QRG('lona', 1712, 728, 150)}`;

/* =============================================================
   2 · ROLL-UP 850 × 2100 (corte). Fondo hasta sangrado: -5…855 × -5…2105
   Visible 0–2000. Oculto 2000–2100.
   ============================================================= */
const ROLL = {};
ROLL.A = (bg = C.olive) => `
<rect x="-5" y="-5" width="860" height="2110" fill="${bg}"/>
<circle cx="425" cy="430" r="380" fill="${C.olive2}"/>
${LOGOG(425, 430, 640)}
${T(425, 940, 128, 'Compraventa', { f: F.germ, a: 'middle' })}
${T(425, 1070, 128, 'de motos', { f: F.germ, a: 'middle' })}
${T(425, 1150, 40, 'GRANADA · COGOLLOS DE LA VEGA', { c: C.orange, w: 500, ls: 6, a: 'middle' })}
${[['wrench', 'Revisadas en taller propio'], ['shield', 'Garantía incluida'], ['doc', 'Transferencia gestionada']].map((s, i) =>
  `${ICON(s[0], 120, 1222 + i * 92, 58, C.orange, 2.2)}${T(205, 1266 + i * 92, 42, s[1], { f: F.pop, c: C.cream, w: 500 })}`).join('')}
${ridge(-5, 855, 1660, 80, 2105, 3, C.olive2, 6)}
${ridge(-5, 855, 1760, 60, 2105, 11, C.olive3, 7)}
${pine(110, 1830, 150, C.olive4)}${pine(745, 1840, 120, C.olive4)}
${T(425, 1720, 88, '644 904 418', { w: 700, c: C.orange, a: 'middle' })}
${T(425, 1795, 46, 'tagadonaracing.es', { w: 500, a: 'middle' })}
${T(425, 1858, 28, 'Atendemos con cita previa', { f: F.pop, a: 'middle', op: .8 })}
<rect x="-5" y="1930" width="860" height="175" fill="${C.orange}"/>`;

ROLL.B = (bg = C.black) => `
<rect x="-5" y="-5" width="860" height="2110" fill="${bg}"/>
${LOGOG(425, 215, 300)}
${T(425, 445, 32, 'TAGADONA RACING', { c: C.orange, w: 500, ls: 10, a: 'middle' })}
${T(425, 620, 176, '¿VENDES', { w: 700, a: 'middle' })}
${T(425, 800, 176, 'TU MOTO?', { w: 700, a: 'middle' })}
<polygon points="-5,860 855,820 855,935 -5,975" fill="${C.orange}"/>
${T(425, 918, 46, 'TASACIÓN SIN COMPROMISO', { w: 700, c: C.black, a: 'middle' })}
${QRG('wa', 300, 1015, 250)}
${T(425, 1335, 30, 'Escanea y mándanos fotos por WhatsApp', { f: F.pop, a: 'middle', op: .85 })}
${T(425, 1410, 78, '644 904 418', { w: 700, c: C.orange, a: 'middle' })}
${[['1', 'Nos cuentas tu moto'], ['2', 'Te damos una tasación'], ['3', 'La vemos con cita'], ['4', 'Cerramos, pagamos y transferimos']].map((s, i) => {
  const y = 1500 + i * 78;
  return `<rect x="110" y="${y}" width="56" height="56" fill="${C.orange}"/>${T(138, y + 44, 40, s[0], { w: 700, c: C.black, a: 'middle' })}${T(190, y + 42, 36, s[1], { w: 500 })}`;
}).join('')}
${T(425, 1880, 40, 'tagadonaracing.es', { w: 500, a: 'middle', op: .9 })}
<polygon points="-5,1925 855,1890 855,1940 -5,1975" fill="${C.cream}"/>
<polygon points="-5,1975 855,1940 855,2105 -5,2105" fill="${C.orange}"/>`;

ROLL.C = () => `
<rect x="-5" y="-5" width="860" height="2110" fill="${C.paper}"/>
<rect x="-5" y="-5" width="860" height="45" fill="${C.orange}"/>
${LOGOG(205, 215, 230)}
${T(350, 190, 34, 'TAGADONA', { w: 700, c: C.black, ls: 4 })}
${T(350, 235, 34, 'RACING', { w: 700, c: C.black, ls: 4 })}
${T(350, 275, 22, 'COMPRAVENTA DE MOTOS', { f: F.pop, c: C.black, op: .7, ls: 2 })}
<line x1="60" y1="380" x2="790" y2="380" stroke="${C.black}" stroke-width="3"/>
${T(60, 470, 72, 'Lo que revisamos', { f: F.pop, w: 700, c: C.black, ls: -2 })}
${T(60, 555, 72, 'antes de venderla', { f: F.pop, w: 700, c: C.black, ls: -2 })}
${['Papeles y n.º de bastidor', 'Chasis y señales de caída', 'Alineación de ruedas', 'Motor y arranque en frío', 'Cadena y piñones', 'Neumáticos: dibujo y fecha', 'Frenos: discos y pastillas', 'Prueba en marcha'].map((s, i) => {
  const y = 630 + i * 92;
  return `<rect x="60" y="${y}" width="58" height="58" fill="none" stroke="${C.black}" stroke-width="4"/>${ICON('check', 62, y + 2, 54, C.orange, 3.4)}${T(150, y + 44, 40, s, { f: F.pop, w: 500, c: C.black })}<line x1="150" y1="${y + 74}" x2="790" y2="${y + 74}" stroke="${C.black}" stroke-width="1.5" opacity=".25"/>`;
}).join('')}
${QRG('cat', 520, 1400, 230)}
${T(60, 1460, 46, 'Ver motos', { w: 600, c: C.black })}
${T(60, 1515, 46, 'disponibles', { w: 600, c: C.black })}
${T(60, 1570, 28, 'con su ficha y precio', { f: F.pop, c: C.black, op: .75 })}
<rect x="-5" y="1700" width="860" height="405" fill="${C.black}"/>
${T(60, 1790, 70, '644 904 418', { w: 700, c: C.orange })}
${T(60, 1850, 40, 'tagadonaracing.es', { w: 500 })}
${T(60, 1900, 24, 'COGOLLOS DE LA VEGA · CON CITA PREVIA', { f: F.pop, op: .7 })}`;

/* =============================================================
   3 · ALFOMBRA 2150 × 1050 (fondo hasta 2160 × 1060: -5…2155)
   Público en el borde inferior (y = 1050). Moto con la rueda
   delantera a la izquierda; eje de la moto en y = 500.
   ============================================================= */
const MAT = {};
const W_F = { x0: 60, x1: 700, cx: 380 }, W_R = { x0: 1450, x1: 2090, cx: 1770 };
function alignMarks(color, sw) { // marcas de colocación en los bordes, a la altura de los ejes
  return [W_F.cx, W_R.cx].map(x => `<line x1="${x}" y1="35" x2="${x}" y2="120" stroke="${color}" stroke-width="${sw}"/><line x1="${x}" y1="1015" x2="${x}" y2="930" stroke="${color}" stroke-width="${sw}"/>`).join('');
}
MAT.A = (bg = C.olive) => `
<rect x="-5" y="-5" width="2160" height="1060" fill="${bg}"/>
<g clip-path="url(#matClip)">
${topo(1075, 480, 15, 40, 46, 5, C.olive3, 7)}
${topo(150, 980, 7, 40, 60, 9, C.olive3, 7)}
${topo(2050, 60, 6, 40, 60, 13, C.olive3, 7)}
</g>
<rect x="90" y="300" width="1970" height="400" fill="none" stroke="${C.cream}" stroke-width="6" stroke-dasharray="30 26" opacity=".35"/>
${alignMarks(C.orange, 10)}
${T(1075, 905, 190, 'Tagadona Racing', { f: F.germ, a: 'middle', c: C.cream })}
${T(1075, 985, 40, 'GARAGE · COMPRAVENTA DE MOTOS · GRANADA', { c: C.orange, w: 500, ls: 10, a: 'middle' })}`;

MAT.B = (bg = C.asphalt) => `
<rect x="-5" y="-5" width="2160" height="1060" fill="${bg}"/>
<rect x="-5" y="-5" width="2160" height="1060" fill="url(#grain)"/>
${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<polygon points="2075,${-5 + i * 106} 2155,${-5 + i * 106} 2155,${101 + i * 106} 2075,${101 + i * 106}" fill="${i % 2 ? C.orange : C.cream}"/>`).join('')}
<path d="M135 230 H45 V770 H135" fill="none" stroke="${C.cream}" stroke-width="18"/>
${[W_F.cx, W_R.cx].map(x => `<line x1="${x}" y1="35" x2="${x}" y2="120" stroke="${C.cream}" stroke-width="8"/>`).join('')}
${T(1075, 770, 46, 'COMPRAVENTA DE MOTOS · GRANADA', { w: 500, c: C.orange, ls: 12, a: 'middle' })}
${T(1075, 950, 178, 'TAGADONA RACING', { w: 700, c: C.cream, a: 'middle', ls: 6 })}`;

MAT.C = (bg = C.concrete) => `
<rect x="-5" y="-5" width="2160" height="1060" fill="${bg}"/>
<rect x="45" y="45" width="2060" height="960" fill="none" stroke="${C.cream}" stroke-width="5"/>
${[W_F, W_R].map((w, i) => `<line x1="${w.cx}" y1="45" x2="${w.cx}" y2="1005" stroke="${C.cream}" stroke-width="3" stroke-dasharray="14 14" opacity=".7"/>${T(w.cx, 1040 - 75, 26, i ? 'EJE TRASERO' : 'EJE DELANTERO', { c: C.cream, a: 'middle', ls: 4, w: 500 })}`).join('')}
<line x1="45" y1="500" x2="2105" y2="500" stroke="${C.cream}" stroke-width="3" stroke-dasharray="40 14 6 14" opacity=".55"/>
${T(1075, 770, 120, 'REVISADA EN NUESTRO TALLER', { w: 700, c: C.cream, a: 'middle' })}
${['Garantía', 'Transferencia', 'Trato directo'].map((s, i) => `${ICON('check', 600 + i * 330, 812, 46, C.black, 3)}${T(656 + i * 330, 850, 38, s, { f: F.pop, w: 600, c: C.black })}`).join('')}
<rect x="760" y="908" width="80" height="10" fill="${C.orange}"/>
${T(1075, 925, 32, 'TAGADONA RACING · GRANADA', { w: 600, c: C.cream, a: 'middle', ls: 7 })}
<rect x="1310" y="908" width="80" height="10" fill="${C.orange}"/>`;

/* =============================================================
   4 · TECHO — cara triangular 3000 × 1750 (verdadera magnitud
   aproximada, maqueta) + cenefa 3000 × 250. Caras: F (frente),
   R (derecha), B (detrás), L (izquierda).
   ============================================================= */
const TECHO = {};
const TRI = '1500,0 3000,1750 0,1750';
function face(bg, inner) { return `<g clip-path="url(#tri)"><polygon points="${TRI}" fill="${bg}"/>${inner}</g>`; }

TECHO.A = {
  name: 'A',
  F: () => face(C.olive, `${ridge(0, 3000, 1560, 90, 1750, 4, C.olive2, 10)}${LOGOG(1500, 1030, 820)}<rect x="0" y="1705" width="3000" height="45" fill="${C.orange}"/>`),
  B: () => face(C.olive, `${ridge(0, 3000, 1560, 90, 1750, 8, C.olive2, 10)}${LOGOG(1500, 1030, 820)}<rect x="0" y="1705" width="3000" height="45" fill="${C.orange}"/>`),
  R: () => face(C.olive, `${ridge(0, 3000, 1600, 80, 1750, 12, C.olive2, 10)}${pine(700, 1680, 160, C.olive3)}${pine(2300, 1690, 190, C.olive3)}${T(1500, 1200, 290, 'Compraventa', { f: F.germ, a: 'middle' })}${T(1500, 1480, 290, 'de motos', { f: F.germ, a: 'middle' })}<rect x="0" y="1705" width="3000" height="45" fill="${C.orange}"/>`),
  L: () => face(C.olive, `${ridge(0, 3000, 1600, 80, 1750, 16, C.olive2, 10)}${pine(800, 1680, 180, C.olive3)}${pine(2250, 1690, 150, C.olive3)}${T(1500, 1200, 290, 'Compraventa', { f: F.germ, a: 'middle' })}${T(1500, 1480, 290, 'de motos', { f: F.germ, a: 'middle' })}<rect x="0" y="1705" width="3000" height="45" fill="${C.orange}"/>`),
  cen: (side) => `<rect x="0" y="0" width="3000" height="250" fill="${C.cream}"/>${T(1500, 172, 150, 'Tagadona Racing', { f: F.germ, c: C.olive, a: 'middle' })}<circle cx="890" cy="125" r="16" fill="${C.orange}"/><circle cx="2110" cy="125" r="16" fill="${C.orange}"/>${T(140, 158, 84, side === 'B' ? 'tagadonaracing.es' : '644 904 418', { w: 600, c: C.olive })}${T(2860, 158, 84, side === 'B' ? '@tagadonaracing' : 'GRANADA', { w: 600, c: C.olive, a: 'end' })}`,
};

TECHO.B = {
  name: 'B',
  F: () => face(C.black, `<polygon points="1500,0 1820,1750 1180,1750" fill="${C.orange}"/><polygon points="1500,0 1900,1750 1855,1750" fill="${C.cream}"/><polygon points="1500,0 1145,1750 1100,1750" fill="${C.cream}"/><rect x="380" y="1310" width="2240" height="290" fill="${C.black}"/>${T(1500, 1545, 230, 'TAGADONA RACING', { w: 700, a: 'middle', ls: 4 })}`),
  B: () => face(C.black, `<polygon points="1500,0 1820,1750 1180,1750" fill="${C.orange}"/><polygon points="1500,0 1900,1750 1855,1750" fill="${C.cream}"/><polygon points="1500,0 1145,1750 1100,1750" fill="${C.cream}"/><rect x="380" y="1310" width="2240" height="290" fill="${C.black}"/>${T(1500, 1545, 230, 'TAGADONA RACING', { w: 700, a: 'middle', ls: 4 })}`),
  R: () => face(C.orange, `${T(1500, 1250, 250, 'MOTOS CON', { w: 700, c: C.black, a: 'middle' })}${T(1500, 1540, 250, 'GARANTÍA', { w: 700, c: C.black, a: 'middle' })}`),
  L: () => face(C.orange, `${T(1500, 1250, 250, 'COMPRAMOS', { w: 700, c: C.black, a: 'middle' })}${T(1500, 1540, 250, 'TU MOTO', { w: 700, c: C.black, a: 'middle' })}`),
  cen: (side) => {
    const txt = { F: 'TAGADONA RACING · COMPRAVENTA DE MOTOS', B: 'TAGADONA RACING · tagadonaracing.es', R: 'WHATSAPP 644 904 418', L: 'WHATSAPP 644 904 418' }[side];
    return `<rect x="0" y="0" width="3000" height="250" fill="${C.black}"/>${[0, 1, 2, 3].map(i => `<rect x="${i % 2 ? 0 : 60}" y="${i * 62.5}" width="60" height="62.5" fill="${C.orange}"/><rect x="${i % 2 ? 2940 : 2880}" y="${i * 62.5}" width="60" height="62.5" fill="${C.orange}"/>`).join('')}${T(1500, 175, 140, txt, { w: 600, a: 'middle', c: side === 'R' || side === 'L' ? C.orange : C.cream, ls: 3 })}`;
  },
};

TECHO.C = {
  name: 'C',
  F: () => face(C.paper, `<polygon points="1500,0 1860,420 1140,420" fill="${C.orange}"/>${T(1500, 1240, 280, 'COMPRAVENTA', { w: 700, c: C.black, a: 'middle' })}${T(1500, 1550, 280, 'DE MOTOS', { w: 700, c: C.black, a: 'middle' })}`),
  B: () => face(C.paper, `<polygon points="1500,0 1860,420 1140,420" fill="${C.orange}"/>${T(1500, 1240, 280, 'COMPRAVENTA', { w: 700, c: C.black, a: 'middle' })}${T(1500, 1550, 280, 'DE MOTOS', { w: 700, c: C.black, a: 'middle' })}`),
  R: () => face(C.paper, `<polygon points="1500,0 1860,420 1140,420" fill="${C.orange}"/>${T(1500, 1240, 280, 'MOTOS', { w: 700, c: C.black, a: 'middle' })}${T(1500, 1550, 280, 'REVISADAS', { w: 700, c: C.black, a: 'middle' })}`),
  L: () => face(C.paper, `<polygon points="1500,0 1860,420 1140,420" fill="${C.orange}"/>${T(1500, 1240, 280, 'TASAMOS', { w: 700, c: C.black, a: 'middle' })}${T(1500, 1550, 280, 'TU MOTO', { w: 700, c: C.black, a: 'middle' })}`),
  cen: (side) => `<rect x="0" y="0" width="3000" height="250" fill="${C.orange}"/>${T(1500, 172, 140, 'TAGADONA RACING', { w: 700, c: C.black, a: 'middle', ls: 6 })}${T(150, 160, 70, side === 'B' ? '@tagadonaracing' : '644 904 418', { w: 600, c: C.black })}${T(2850, 160, 70, side === 'B' ? 'tagadonaracing.es' : 'GRANADA', { w: 600, c: C.black, a: 'end' })}`,
};

/* =============================================================
   Elementos de maqueta: moto a escala y persona de referencia
   Moto: caja 2100 × 1150 mm, suelo en y = 1150, frente a la izquierda.
   ============================================================= */
const MOTO = `
<g>
<path d="M150 600 Q330 470 520 600 L500 625 Q330 515 170 628Z" fill="#2c2b2a"/>
<polygon points="296,830 352,830 528,345 474,330" fill="#9d9a96"/>
<circle cx="330" cy="830" r="315" fill="#151413"/><circle cx="330" cy="830" r="228" fill="none" stroke="#6c6965" stroke-width="22"/><circle cx="330" cy="830" r="150" fill="none" stroke="#8f8b86" stroke-width="10"/><circle cx="330" cy="830" r="48" fill="#8f8b86"/>
<circle cx="1720" cy="830" r="315" fill="#151413"/><circle cx="1720" cy="830" r="228" fill="none" stroke="#6c6965" stroke-width="22"/><circle cx="1720" cy="830" r="48" fill="#8f8b86"/>
<polygon points="1050,735 1720,805 1720,855 1040,800" fill="#34322f"/>
<line x1="1350" y1="520" x2="1440" y2="790" stroke="${C.orange}" stroke-width="30"/>
<polygon points="600,470 1060,470 1130,700 900,790" fill="#2a2826"/>
<path d="M650 560 L1000 540 L1070 760 L980 880 L720 880 L640 760Z" fill="#4b4844"/>
<g stroke="#2e2c29" stroke-width="10">${[0, 1, 2, 3, 4].map(i => `<line x1="${690 + i * 10}" y1="${600 + i * 55}" x2="${960 + i * 12}" y2="${585 + i * 55}"/>`).join('')}</g>
<path d="M900 860 C1000 930 1200 900 1400 860 L1660 790 L1705 835 L1420 925 C1200 965 980 985 880 905Z" fill="#8e8b86"/>
<path d="M600 360 C700 300 900 300 1010 360 L1015 470 C880 500 700 500 610 470Z" fill="#45413d"/>
<path d="M990 380 C1150 370 1400 380 1560 420 L1560 462 C1400 452 1150 457 1000 472Z" fill="#1c1b1a"/>
<path d="M1540 410 L1840 395 L1770 470 L1550 482Z" fill="#3a3734"/>
<rect x="1835" y="400" width="30" height="30" fill="#a33"/>
<circle cx="470" cy="425" r="78" fill="#2c2b2a"/><circle cx="462" cy="425" r="56" fill="#d9d4c8"/>
<line x1="520" y1="300" x2="650" y2="268" stroke="#1d1c1b" stroke-width="28" stroke-linecap="round"/>
<line x1="600" y1="280" x2="560" y2="160" stroke="#1d1c1b" stroke-width="12"/><ellipse cx="552" cy="148" rx="48" ry="28" fill="#1d1c1b"/>
<rect x="1080" y="800" width="90" height="20" fill="#777"/>
</g>`;
const PERSON = `<g fill="#7b756e"><circle cx="250" cy="115" r="100"/><path d="M120 250 Q250 215 380 250 L430 820 L380 830 L360 520 L350 1000 L330 1750 L270 1750 L255 1060 L245 1060 L230 1750 L170 1750 L150 1000 L140 520 L120 830 L70 820Z"/></g>`;

/* ---------- catálogo de propuestas ---------- */
const PROPS = {
  lona: [
    { id: 'L-A', line: 'A', make: () => LONA.A(), title: 'Sello y oficio', msg: 'Marca + actividad + contacto', comp: 'Sello grande a la izquierda y titular a la derecha, sobre una sierra en capas.', why: 'Es la pieza que más se parece al logo y a la web. En tienda funciona como cartel de fondo de la exposición.' },
    { id: 'L-B', line: 'B', make: () => LONA.B(), title: 'Compramos tu moto', msg: 'Captación: «¿Vendes tu moto?» + 4 pasos reales', comp: 'Titular gigante a la izquierda, franja de carreras en diagonal y columna de pasos a la derecha.', why: 'Habla al que viene a vender, que es quien alimenta el stock. Los cuatro pasos son los de la web de tasación.' },
    { id: 'L-C', line: 'C', make: () => LONA.C(), title: 'Una a una', msg: 'Confianza: taller, garantía, transferencia y trato directo', comp: 'Ficha en cuatro columnas sobre fondo claro con pie negro de contacto y QR.', why: 'Es la que más explica. Funciona a 2–4 m, delante de una moto, cuando alguien ya se ha parado.' },
  ],
  roll: [
    { id: 'R-A', line: 'A', make: () => ROLL.A(), title: 'Tótem de marca', msg: 'Marca + qué hacemos + contacto', comp: 'Sello a la altura de los ojos, titular y tres servicios; sierra y contacto abajo.', why: 'Se reconoce a distancia por el sello. Es el roll-up más neutro y el que mejor envejece.' },
    { id: 'R-B', line: 'B', make: () => ROLL.B(), title: 'Tasación con QR', msg: 'Captación con QR a WhatsApp con el mensaje ya escrito', comp: 'Pregunta grande a la altura de los ojos, QR a la altura de la mano y pasos debajo.', why: 'Convierte el paso por la carpa en una conversación de WhatsApp medible. Es la llamada a la acción que le falta al resto del conjunto.' },
    { id: 'R-C', line: 'C', make: () => ROLL.C(), title: 'Lista de revisión', msg: 'Lo que revisamos antes de vender + QR al catálogo', comp: 'Lista de 8 comprobaciones con casillas, QR al catálogo y pie de contacto.', why: 'Convierte «moto revisada» en algo concreto. La lista sale del artículo del blog y hay que confirmarla con el taller.' },
  ],
  mat: [
    { id: 'M-A', line: 'A', make: () => MAT.A(), title: 'Curvas de nivel', msg: 'Nombre + «Garage · Granada»', comp: 'Trama topográfica en todo el fondo, plaza de aparcamiento discontinua y nombre en la franja del pasillo.', why: 'La trama disimula polvo y marcas de rueda. Es la alfombra que mejor aguanta el uso diario en tienda.' },
    { id: 'M-B', line: 'B', make: () => MAT.B(), title: 'Casilla de salida', msg: 'Nombre + actividad, en clave de box de carreras', comp: 'Asfalto, pianos naranja y crema en los extremos, marca de parrilla junto a la rueda delantera y nombre grande delante.', why: 'Es la más llamativa en fotos y redes. El fondo oscuro deja ver más el polvo claro.' },
    { id: 'M-C', line: 'C', make: () => MAT.C(), title: 'Plano de taller', msg: '«Revisada en nuestro taller» + 3 garantías', comp: 'Fondo gris hormigón con ejes de rueda marcados, línea de eje y mensaje en la franja delantera.', why: 'Sirve para colocar siempre la moto igual gracias a los ejes marcados. El gris medio es el que menos suciedad enseña.' },
  ],
  techo: [
    { id: 'T-A', line: 'A', set: TECHO.A, title: 'Sello en cuatro vientos', msg: 'Delante y detrás: sello. Laterales: «Compraventa de motos». Cenefas: nombre y teléfono.', comp: 'Caras oliva con sierra en la base y filo naranja. Cenefas crema.', why: 'El sello se reconoce desde lejos por la forma aunque no se lea. Las cenefas crema se leen bien a la sombra.' },
    { id: 'T-B', line: 'B', set: TECHO.B, title: 'Decoración de carreras', msg: 'Delante y detrás: nombre. Laterales naranja: «Compramos tu moto» y «Motos con garantía». Cenefas: nombre, web y WhatsApp.', comp: 'Caras alternas negro y naranja con franjas que suben al vértice.', why: 'Es la más visible en una feria con muchas carpas blancas. Por debajo es la más oscura y la más calurosa en verano.' },
    { id: 'T-C', line: 'C', set: TECHO.C, title: 'Pico naranja', msg: 'Cada cara dice una cosa: compraventa, tasamos tu moto, motos revisadas. Cenefas naranja con el nombre.', comp: 'Caras claras con la punta naranja; las cuatro puntas forman un pico, como el del sello.', why: 'Es más fresca bajo el sol y da luz más limpia a la moto expuesta. El pico naranja se ve de lejos.' },
  ],
};
