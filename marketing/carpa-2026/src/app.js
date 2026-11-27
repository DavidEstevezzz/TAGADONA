/* =============================================================
   MONTAJE DE LA PÁGINA
   ============================================================= */
const $ = (s, r = document) => r.querySelector(s);
const SIDES = ['F', 'R', 'B', 'L'];
const SIDE_NAME = { F: 'Frente (acceso)', R: 'Lateral derecho', B: 'Trasera (lona)', L: 'Lateral izquierdo' };

/* ---------- 1. Definiciones SVG compartidas ---------- */
(function buildDefs() {
  let g = '';
  ['A', 'B', 'C'].forEach(k => {
    g += `<g id="lona-${k}">${LONA[k]()}</g><g id="roll-${k}">${ROLL[k]()}</g><g id="mat-${k}">${MAT[k]()}</g>`;
    const t = TECHO[k];
    SIDES.forEach(s => { g += `<g id="t${k}_${s}">${t[s]()}</g><g id="t${k}_c${s}">${t.cen(s)}</g>`; });
  });
  g += `<g id="roll-Bo">${ROLL.B(C.olive)}</g>`;
  g += `<g id="moto">${MOTO}</g><g id="person">${PERSON}</g>`;
  g += `<g id="motoF"><rect x="340" y="820" width="120" height="330" rx="50" fill="#151413"/><path d="M220 360 Q400 300 580 360 L560 520 Q400 560 240 520Z" fill="#45413d"/><path d="M200 560 L600 560 L560 860 L240 860Z" fill="#4b4844"/><rect x="250" y="600" width="60" height="230" fill="#8e8b86"/><rect x="20" y="265" width="760" height="30" rx="14" fill="#1d1c1b"/><line x1="90" y1="280" x2="60" y2="150" stroke="#1d1c1b" stroke-width="12"/><line x1="710" y1="280" x2="740" y2="150" stroke="#1d1c1b" stroke-width="12"/><ellipse cx="60" cy="140" rx="48" ry="28" fill="#1d1c1b"/><ellipse cx="740" cy="140" rx="48" ry="28" fill="#1d1c1b"/></g>`;
  // Huella de la moto vista desde arriba, en coordenadas de alfombra
  g += `<g id="motoTop">
    <rect x="${W_F.x0}" y="435" width="${W_F.x1 - W_F.x0}" height="130" rx="60" fill="#151413"/>
    <rect x="${W_R.x0}" y="415" width="${W_R.x1 - W_R.x0}" height="170" rx="70" fill="#151413"/>
    <path d="M520 400 C700 330 1000 330 1100 360 L1560 400 C1700 410 1800 430 1850 470 L1850 530 C1800 570 1700 590 1560 600 L1100 640 C1000 670 700 670 520 600Z" fill="#3b3835"/>
    <path d="M1060 520 Q1300 560 1500 560 L1700 545" fill="none" stroke="#8e8b86" stroke-width="70" stroke-linecap="round"/>
    <rect x="565" y="120" width="34" height="760" rx="16" fill="#1d1c1b"/>
    <line x1="1060" y1="420" x2="1060" y2="215" stroke="#2a2826" stroke-width="22"/>
  </g>`;
  const defs = `<defs>
    <clipPath id="tri"><polygon points="1500,0 3000,1750 0,1750"/></clipPath>
    <clipPath id="matClip"><rect x="-5" y="-5" width="2160" height="1060"/></clipPath>
    <pattern id="grain" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="7" cy="9" r="2" fill="#fff" opacity=".05"/><circle cx="28" cy="31" r="1.6" fill="#fff" opacity=".04"/><circle cx="31" cy="12" r="1.3" fill="#000" opacity=".25"/><circle cx="16" cy="27" r="1.1" fill="#000" opacity=".2"/></pattern>
    <pattern id="hatch" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="9" height="26" fill="#E0457B" opacity=".55"/></pattern>
    <pattern id="hatchG" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="26" fill="#3ddc97" opacity=".45"/></pattern>
    ${g}</defs>`;
  const holder = document.createElement('div');
  holder.innerHTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${defs}</svg>`;
  document.body.prepend(holder);
})();

/* ---------- 2. Vistas planas con guías técnicas ---------- */
const TECH = { safe: '#2ec4b6', cut: '#4b8bff', bleed: '#ff4f8b', note: '#ffffff' };
function tlabel(x, y, s, txt, anchor = 'start', color = '#fff', bg = 'rgba(10,10,10,.78)') {
  const w = txt.length * s * .56 + s * .8;
  const x0 = anchor === 'end' ? x - w : anchor === 'middle' ? x - w / 2 : x;
  return `<g><rect x="${x0}" y="${y - s * 1.05}" width="${w}" height="${s * 1.45}" rx="${s * .25}" fill="${bg}"/><text x="${x0 + s * .4}" y="${y}" font-family="${F.osw}" font-size="${s}" fill="${color}" letter-spacing="1">${txt}</text></g>`;
}
function flatLona(k) {
  const oj = [];
  [25, 512.5, 1000, 1487.5, 1975].forEach(x => { oj.push([x, 25], [x, 975]); });
  oj.push([25, 500], [1975, 500]);
  const tech = `<g class="tech">
    <rect x="22" y="22" width="1956" height="956" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="4 10" opacity=".55"/>
    <rect x="110" y="110" width="1780" height="780" fill="none" stroke="${TECH.safe}" stroke-width="6" stroke-dasharray="26 14"/>
    <rect x="500" y="900" width="1000" height="100" fill="url(#hatch)"/>
    ${oj.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="17" fill="#d8d8d8" stroke="#555" stroke-width="5"/><circle cx="${x}" cy="${y}" r="8" fill="#333"/>`).join('')}
    ${tlabel(130, 160, 30, 'MARGEN DE TRABAJO 110 MM')}
    ${tlabel(1000, 885, 26, 'PUEDE TAPARLO UNA MOTO ALTA (RETROVISORES) VISTA DE CERCA', 'middle', '#fff')}
    ${tlabel(1870, 160, 30, '12 OJALES · CENTRO A 25 MM DEL BORDE', 'end')}
  </g>`;
  return `<svg viewBox="0 0 2000 1000" class="flat"><use href="#lona-${k}"/>${tech}</svg>`;
}
function flatRoll(id) {
  const h = (y) => (2100 - y) / 1000; // altura sobre el suelo (base ≈ 100 mm)
  const tick = (y, t) => `<line x1="790" y1="${y}" x2="855" y2="${y}" stroke="#fff" stroke-width="4"/>${tlabel(780, y + 10, 26, t, 'end')}`;
  const tech = `<g class="tech">
    <rect x="-5" y="-5" width="860" height="2110" fill="none" stroke="${TECH.bleed}" stroke-width="5"/>
    <rect x="0" y="0" width="850" height="2100" fill="none" stroke="${TECH.cut}" stroke-width="4"/>
    <rect x="5" y="5" width="840" height="1990" fill="none" stroke="${TECH.safe}" stroke-width="5" stroke-dasharray="22 12"/>
    <rect x="0" y="2000" width="850" height="100" fill="url(#hatch)"/>
    <line x1="0" y1="2000" x2="850" y2="2000" stroke="#000" stroke-width="5"/>
    ${tlabel(425, 2062, 28, 'ÁREA NO VISTA · 100 MM EN LA BASE', 'middle')}
    ${tick(500, 'OJOS ≈ 1,6 M')}${tick(1000, 'MANO / QR ≈ 1,1 M')}${tick(1500, '≈ 0,6 M · ZONA BAJA')}
    ${tlabel(20, 60, 24, 'SANGRADO · CORTE · SEGURIDAD (PLANTILLA IMPRIVIC)')}
  </g>`;
  return `<svg viewBox="-5 -5 860 2110" class="flat"><use href="#${id}"/>${tech}</svg>`;
}
function flatMat(k) {
  const tech = `<g class="tech">
    <rect x="0" y="640" width="2150" height="410" fill="url(#hatchG)"/>
    <use href="#motoTop" opacity=".72"/>
    <circle cx="1060" cy="210" r="110" fill="none" stroke="${TECH.bleed}" stroke-width="7" stroke-dasharray="18 10"/>
    <rect x="930" y="380" width="260" height="240" fill="none" stroke="#ffd166" stroke-width="6" stroke-dasharray="12 10"/>
    <rect x="-5" y="-5" width="2160" height="1060" fill="none" stroke="${TECH.bleed}" stroke-width="5"/>
    <rect x="0" y="0" width="2150" height="1050" fill="none" stroke="${TECH.cut}" stroke-width="4"/>
    ${tlabel(1180, 205, 28, 'PATA LATERAL (LADO IZQ. DE LA MOTO)')}
    ${tlabel(1205, 395, 24, 'CABALLETE CENTRAL (SCOOTER)', 'start', '#ffd166')}
    ${tlabel(380, 410, 26, 'RUEDA DELANTERA', 'middle')}${tlabel(1770, 400, 26, 'RUEDA TRASERA', 'middle')}
    ${tlabel(30, 680, 28, 'VISIBLE DESDE EL PASILLO / LA ENTRADA', 'start', '#3ddc97')}
    ${tlabel(2120, 1020, 26, '↓ PÚBLICO', 'end')}
  </g>`;
  return `<svg viewBox="-5 -5 2160 1060" class="flat"><use href="#mat-${k}"/>${tech}</svg>`;
}
function flatTecho(k) {
  let s = '';
  SIDES.forEach((sd, i) => {
    const x = i * 3150;
    s += `<g transform="translate(${x} 0)"><use href="#t${k}_${sd}"/><g transform="translate(0 1790)"><use href="#t${k}_c${sd}"/></g>
      <g class="tech"><polygon points="1500,0 3000,1750 0,1750" fill="none" stroke="${TECH.safe}" stroke-width="10" stroke-dasharray="40 20"/>
      <rect x="0" y="1790" width="3000" height="250" fill="none" stroke="${TECH.cut}" stroke-width="8"/></g>
      <text x="1500" y="2190" font-family="${F.osw}" font-size="110" fill="#d8cfc4" text-anchor="middle" letter-spacing="4">${SIDE_NAME[sd].toUpperCase()}</text></g>`;
  });
  return `<svg viewBox="0 0 12450 2230" class="flat">${s}<g class="tech">${tlabel(20, 120, 80, 'MAQUETA · CARA ≈ 3.000 × 1.750 · CENEFA 3.000 × 250 · AJUSTAR A PLANTILLA DEL FABRICANTE')}</g></svg>`;
}

/* ---------- 3. Escenas ---------- */
const scenes = []; // {sc, cam, group}
function mkScene(host, build, cam, group) {
  const sc = new Scene(host); build(sc); scenes.push({ sc, cam, group }); return sc;
}
function rerender(group, cam) {
  scenes.filter(s => !group || s.group === group).forEach(s => { if (cam) s.cam = cam; s.sc.render(s.cam); });
}
function plainMat(sc, x0, d0) { sc.solid([x0, 3, d0 + 1050], [2150, 0, 0], [0, 0, -1050], '#a9a39a'); }

function sceneLona(host, k) {
  mkScene(host, sc => {
    sc.ground(-3000, 6000, -4000, 6000, '#d7d2ca');
    addTent(sc, null);
    addLona(sc, `lona-${k}`);
    plainMat(sc, 425, 1450); addMoto(sc, 425, 1450);
    addPerson(sc, 3500, -500);
  }, camAround(14, 6200, 1650, [1500, 0, 1800], 1600), 'piece');
}
function sceneRoll(host, id) {
  mkScene(host, sc => {
    sc.ground(-2500, 4000, -2000, 4000, '#d7d2ca');
    addRoll(sc, id, 0, 400, 12);
    addPerson(sc, 1150, 300, 0);
    addMoto(sc, -300, 2200, { free: true, ghost: true });
  }, { eye: [1900, 1600, -3600], target: [600, 1150, 600], fov: 44 }, 'piece');
}
function sceneMat(host, k) {
  mkScene(host, sc => {
    sc.ground(-3000, 5000, -3000, 4000, '#d7d2ca');
    addMat(sc, `mat-${k}`, 0, 0); addMoto(sc, 0, 0);
  }, { eye: [1350, 1650, -2600], target: [1075, 350, 600], fov: 50 }, 'piece');
}
function sceneTecho(host, k, phi) {
  mkScene(host, sc => {
    sc.ground(-4000, 7000, -4000, 7000, '#d7d2ca');
    addTent(sc, TECHO[k]);
    plainMat(sc, 425, 1450); addMoto(sc, 425, 1450);
  }, camAround(phi, 8200, 1650, [1500, 0, 1500], 1900, 40), 'techo');
}

/* ---------- 4. Composiciones ---------- */
const COMPS = [
  { id: 'C1', name: 'Garaje de sierra', techo: 'A', lona: 'A', roll: 'roll-A', rollLabel: 'R-A', mat: 'A', rollPos: [150, 420, 22], rollWhere: 'Dentro, esquina delantera izquierda, girado 22° hacia el pasillo.', lonaX: 500,
    store: { roll: [900, 900, 28], rollWhere: 'Junto al portón, por dentro, mirando a quien entra.' },
    sum: 'El conjunto más fiel al sello: oliva, crema y naranja, con sierra y pinos. Es el más «de marca» y el que mejor se identifica con Cogollos de la Vega. El mensaje es institucional: compraventa, taller, garantía.',
    tienda: 'La lona va en la pared del fondo, detrás de la moto destacada, con el borde inferior a 1,3 m para que la moto no la tape. El roll-up se pone junto al portón como bienvenida y la alfombra marca el sitio de la moto del momento.' },
  { id: 'C2', name: 'Box de carreras', techo: 'B', lona: 'B', roll: 'roll-B', rollLabel: 'R-B', mat: 'B', rollPos: [-1150, -250, 18], rollWhere: 'Fuera, en la esquina delantera izquierda, como reclamo en el pasillo.', lonaX: 500,
    store: { roll: [2100, -900, 0], rollWhere: 'Fuera del portón los días de cita, como reclamo desde el camino (recogerlo al cerrar).' },
    sum: 'Negro y naranja con franjas de decoración de carreras. Es el más llamativo y el que mejor explota el «Racing» del nombre. Todo el conjunto empuja a vender la moto: «¿Vendes tu moto?», los pasos de tasación y el QR a WhatsApp.',
    tienda: 'La lona de captación queda en la pared que se ve al entrar. El roll-up sale a la puerta los días de cita y la alfombra de «box» marca la moto recién entrada.' },
  { id: 'C3', name: 'Ficha de taller', techo: 'C', lona: 'C', roll: 'roll-C', rollLabel: 'R-C', mat: 'C', rollPos: [2130, 2840, -10], rollWhere: 'Dentro, al fondo a la derecha, junto a la lona, formando un fondo continuo.', lonaX: 120,
    store: { roll: [1250, 3900, 0], rollWhere: 'Al lado de la moto destacada, como su ficha de revisión.' },
    sum: 'Fondos claros, tipografía negra y punta naranja en el techo. Es el más fresco bajo el sol y el que más explica: qué revisamos, qué incluye la garantía y dónde ver el stock.',
    tienda: 'La lona y el roll-up se juntan junto a la moto destacada y funcionan como su ficha técnica. La alfombra gris, con los ejes marcados, ayuda a dejar siempre la moto en el mismo sitio.' },
  { id: 'C4', name: 'Mixta (recomendada)', techo: 'C', lona: 'A', roll: 'roll-Bo', rollLabel: 'R-B en oliva', mat: 'A', rollPos: [-1150, -250, 18], rollWhere: 'Fuera, en la esquina delantera izquierda; dentro queda todo el ancho libre para la moto y la gente.', lonaX: 500,
    store: { roll: [900, 900, 28], rollWhere: 'Junto al portón, por dentro. Los días de cita puede salir a la puerta.' },
    sum: 'Techo claro con pico naranja (T-C), lona de sello (L-A), roll-up de tasación con QR recoloreado en oliva (R-B) y alfombra de curvas de nivel (M-A). De lejos se ve un pico naranja; de cerca, la marca, y a la altura de la mano, la llamada a vender.',
    tienda: 'La lona de sello pasa a ser el cartel fijo de la exposición. El roll-up de tasación queda junto al portón y la alfombra oliva va bajo la moto destacada.' },
];
function addComposition(sc, c) {
  sc.ground(-4500, 7500, -4500, 7000, '#d7d2ca');
  addTent(sc, TECHO[c.techo]);
  addLona(sc, `lona-${c.lona}`, c.lonaX);
  addMat(sc, `mat-${c.mat}`, 425, 1450); addMoto(sc, 425, 1450);
  addRoll(sc, c.roll, ...c.rollPos);
  addPerson(sc, 4300, 300);
}
function sceneStore(host, c) {
  mkScene(host, sc => {
    sc.ground(0, 7000, 0, 6000, '#a29d95', false);
    sc.solid([0, 3200, 6000], [7000, 0, 0], [0, -3200, 0], '#dcd7cf');
    sc.solid([0, 3200, 0], [0, 0, 6000], [0, -3200, 0], '#cfc9c0');
    sc.solid([7000, 3200, 6000], [0, 0, -6000], [0, -3200, 0], '#c8c2b9');
    sc.box(5300, 0, 5150, 1600, 900, 700, '#6f6a63', '#5f5a54'); // banco de taller
    [1700, 2500, 3300].forEach(d => addMoto(sc, 5900, d, { free: true, ghost: true }));
    addLona(sc, `lona-${c.lona}`, 2500, 1300, 5985, { cords: false });
    addMat(sc, `mat-${c.mat}`, 2425, 3500); addMoto(sc, 2425, 3500);
    addRoll(sc, c.roll, ...c.store.roll);
  }, { eye: [3500, 1650, -2600], target: [3500, 1350, 3800], fov: 58 }, 'store');
}

/* ---------- 5. Planos 2D ---------- */
function planText(x, y, t, s = 110, c = '#ece4d8', a = 'middle') { return `<text x="${x}" y="${y}" font-family="${F.osw}" font-size="${s}" fill="${c}" text-anchor="${a}" letter-spacing="2">${t}</text>`; }
function rollPlan(id, x, d, a, Y) {
  const r = a * Math.PI / 180, x2 = x + 850 * Math.cos(r), d2 = d + 850 * Math.sin(r);
  return `<line x1="${x}" y1="${Y(d)}" x2="${x2}" y2="${Y(d2)}" stroke="${C.orange}" stroke-width="90" stroke-linecap="butt"/><line x1="${x}" y1="${Y(d) + 70}" x2="${x2}" y2="${Y(d2) + 70}" stroke="#8d8a85" stroke-width="60"/>`;
}
function tentPlan(c) {
  const Y = (d) => 3000 - d;
  const lx = c.lonaX, [rx, rd, ra] = c.rollPos;
  return `<svg viewBox="-1700 -500 6400 5300" class="plan">
    <rect x="-1700" y="-500" width="6400" height="5300" fill="#1c1917"/>
    <rect x="0" y="0" width="3000" height="3000" fill="#2a2522" stroke="#8d8a85" stroke-width="18"/>
    <path d="M0 0 L3000 3000 M3000 0 L0 3000" stroke="#4a433e" stroke-width="10" stroke-dasharray="40 30"/>
    ${[[0, 0], [2960, 0], [0, 2960], [2960, 2960]].map(([x, y]) => `<rect x="${x}" y="${y}" width="40" height="40" fill="#cfcac3"/>`).join('')}
    <line x1="${lx}" y1="${Y(2960)}" x2="${lx + 2000}" y2="${Y(2960)}" stroke="${C.orange}" stroke-width="45"/>
    ${planText(lx + 1000, -110, 'LONA 2.000 · BORDE INFERIOR A 1,05 M', 100)}
    <svg x="425" y="${Y(1450 + 1050)}" width="2150" height="1050" viewBox="0 0 2150 1050" overflow="hidden"><use href="#mat-${c.mat}"/><use href="#motoTop" opacity=".85"/></svg>
    ${rollPlan(c.roll, rx, rd, ra, Y)}
    ${planText(rx + 425, Y(rd) + (rd < 0 ? 300 : -160), `ROLL-UP ${c.rollLabel}`, 100, C.orange)}
    <path d="M300 3420 L2700 3420" stroke="#3ddc97" stroke-width="22" marker-end="url(#arrG)" marker-start="url(#arrG)"/>
    ${planText(1500, 3640, rd < 0 || rd > 2000 ? 'ACCESO LIBRE · 3 M' : 'ACCESO LIBRE · ≈ 2,1 M', 120, '#3ddc97')}
    <path d="M1500 4400 L300 3150 M1500 4400 L2700 3150" stroke="#3ddc97" stroke-width="10" stroke-dasharray="30 30" opacity=".6"/>
    ${planText(1500, 4600, 'PASILLO / PÚBLICO', 110, '#bdb3a7')}
    <defs><marker id="arrG" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="#3ddc97"/></marker></defs>
  </svg>`;
}
function storePlan(c) {
  const Y = (d) => 6000 - d;
  const [rx, rd, ra] = c.store.roll;
  return `<svg viewBox="-400 -500 7800 8200" class="plan">
    <rect x="-400" y="-500" width="7800" height="8200" fill="#1c1917"/>
    <rect x="0" y="0" width="7000" height="6000" fill="#2a2522" stroke="#cfcac3" stroke-width="60"/>
    <rect x="2000" y="5970" width="3000" height="60" fill="#1c1917"/>
    ${planText(3500, 6330, 'PORTÓN DE ENTRADA', 130, '#bdb3a7')}
    <line x1="2500" y1="${Y(5985)}" x2="4500" y2="${Y(5985)}" stroke="${C.orange}" stroke-width="70"/>
    ${planText(3500, 250, 'LONA EN PARED · BORDE INF. A 1,3 M', 120)}
    <svg x="2425" y="${Y(3500 + 1050)}" width="2150" height="1050" viewBox="0 0 2150 1050"><use href="#mat-${c.mat}"/><use href="#motoTop" opacity=".85"/></svg>
    ${planText(3500, Y(3500) + 200, 'MOTO DESTACADA', 110)}
    ${[1700, 2500, 3300].map(d => `<rect x="4850" y="${Y(d) - 80}" width="2100" height="160" rx="60" fill="#4a4540"/>`).join('')}
    ${planText(5900, Y(3300) - 260, 'STOCK', 110, '#8d8780')}
    <rect x="5300" y="${Y(5150 + 700)}" width="1600" height="700" fill="#4a4540"/>${planText(6100, Y(5150 + 350) + 40, 'TALLER', 110, '#a39b95')}
    ${rollPlan(c.roll, rx, rd, ra, Y)}
    ${planText(rx + 425, Y(rd) + 280, 'ROLL-UP', 110, C.orange)}
    <path d="M3500 6000 L3500 4700" stroke="#3ddc97" stroke-width="18" stroke-dasharray="50 40"/>
    <path d="M3500 7300 L2300 5000 M3500 7300 L4700 5000" stroke="#3ddc97" stroke-width="10" stroke-dasharray="30 30" opacity=".6"/>
    ${planText(3500, 7550, 'VISTA DESDE LA ENTRADA', 110, '#3ddc97')}
  </svg>`;
}

/* ---------- 6. Matriz de combinaciones ---------- */
const TYPES = [['lona', 'Lona'], ['roll', 'Roll-up'], ['mat', 'Alfombra'], ['techo', 'Techo']];
function compat(ta, la, tb, lb) {
  if (la === lb) return ['ok', '✓', 'Misma línea'];
  const big = (t) => t === 'lona' || t === 'roll';
  if (la !== 'C' && lb !== 'C') {
    if (big(ta) && big(tb)) return ['adj', '≈', 'Igualar el fondo: B en oliva o A en negro'];
    return ['ok', '✓', 'Fondos oscuros y el mismo naranja'];
  }
  const cT = la === 'C' ? ta : tb;
  if (cT === 'techo' || cT === 'mat') return ['ok', '✓', 'La pieza clara hace de acento'];
  if (big(ta) && big(tb)) return ['adj', '≈', 'Solo si el roll-up va fuera de la carpa'];
  return ['ok', '✓', 'Cambia de fondo, pero se mantiene la marca'];
}
function matrixHTML() {
  let h = '';
  for (let i = 0; i < TYPES.length; i++) for (let j = i + 1; j < TYPES.length; j++) {
    const [ta, na] = TYPES[i], [tb, nb] = TYPES[j];
    const pa = PROPS[ta], pb = PROPS[tb];
    h += `<div class="mx"><table><caption>${na} × ${nb}</caption><thead><tr><th></th>${pb.map(p => `<th scope="col">${p.id}</th>`).join('')}</tr></thead><tbody>` +
      pa.map(a => `<tr><th scope="row">${a.id}</th>${pb.map(b => { const [cls, sym, why] = compat(ta, a.line, tb, b.line); return `<td class="${cls}" title="${why}">${sym}</td>`; }).join('')}</tr>`).join('') +
      `</tbody></table></div>`;
  }
  return h;
}

/* ---------- 7. Pintado de la página ---------- */
const LINE_NAME = { A: 'Línea A · Sierra', B: 'Línea B · Pit Lane', C: 'Línea C · Ficha de taller' };
function propCard(p, flat, mountId, mountCap) {
  return `<article class="prop" id="${p.id}">
    <header><span class="pid">${p.id}</span><h4>${p.title}</h4><span class="chip line-${p.line}">${LINE_NAME[p.line]}</span></header>
    <div class="prop-views">
      <figure class="v-flat">${flat}<figcaption>Vista plana a escala</figcaption></figure>
      <figure class="v-mount"><div class="stage-host" id="${mountId}"></div><figcaption>${mountCap}</figcaption></figure>
    </div>
    <dl class="facts"><div><dt>Mensaje</dt><dd>${p.msg}</dd></div><div><dt>Composición</dt><dd>${p.comp}</dd></div><div><dt>Por qué</dt><dd>${p.why}</dd></div></dl>
  </article>`;
}
function paint() {
  $('#lonas').innerHTML = PROPS.lona.map(p => propCard(p, flatLona(p.line), `m-${p.id}`, 'Montaje: 5 bridas al travesaño trasero y pulpos de los ojales laterales a los postes. Vista a unos 6 m.')).join('');
  $('#rolls').innerHTML = PROPS.roll.map(p => propCard(p, flatRoll(`roll-${p.line}`), `m-${p.id}`, 'Montaje junto a una persona de 1,75 m. Los 100 mm inferiores quedan dentro de la base.')).join('');
  $('#mats').innerHTML = PROPS.mat.map(p => propCard(p, flatMat(p.line), `m-${p.id}`, 'Lo que ve alguien de pie a 2,5 m, desde el pasillo o la entrada.')).join('');
  $('#techos').innerHTML = PROPS.techo.map(p => `<article class="prop prop-wide" id="${p.id}">
      <header><span class="pid">${p.id}</span><h4>${p.title}</h4><span class="chip line-${p.line}">${LINE_NAME[p.line]}</span></header>
      <figure class="v-flat">${flatTecho(p.line)}<figcaption>Desarrollo de maqueta: 4 caras y 4 cenefas. No es el troquel del fabricante.</figcaption></figure>
      <div class="approach">${[0, 90, 180, 270].map((phi, i) => `<figure><div class="stage-host sm" id="t-${p.id}-${i}"></div><figcaption>${['Llegando por el frente', 'Llegando por la derecha', 'Llegando por detrás', 'Llegando por la izquierda'][i]}</figcaption></figure>`).join('')}</div>
      <dl class="facts"><div><dt>Reparto</dt><dd>${p.msg}</dd></div><div><dt>Composición</dt><dd>${p.comp}</dd></div><div><dt>Por qué</dt><dd>${p.why}</dd></div></dl>
    </article>`).join('');
  $('#comps').innerHTML = COMPS.map(c => `<article class="comp${c.id === 'C4' ? ' rec' : ''}" id="${c.id}">
      <header><span class="pid">${c.id}</span><h3>${c.name}</h3>
      <ul class="pieces"><li>Techo <b>T-${c.techo}</b></li><li>Lona <b>L-${c.lona}</b></li><li>Roll-up <b>${c.rollLabel}</b></li><li>Alfombra <b>M-${c.mat}</b></li></ul></header>
      <p class="sum">${c.sum}</p>
      <div class="comp-main"><figure><div class="stage-host lg" id="c-${c.id}"></div><figcaption>Carpa 3 × 3 m con moto y persona a escala. Roll-up: ${c.rollWhere.toLowerCase()}</figcaption></figure>
      <figure>${tentPlan(c)}<figcaption>Planta de la carpa: posiciones, huella de la moto y acceso.</figcaption></figure></div>
      <h5>En la tienda</h5><p class="sum">${c.tienda} Roll-up: ${c.store.rollWhere.toLowerCase()}</p>
      <div class="comp-main"><figure><div class="stage-host lg" id="s-${c.id}"></div><figcaption>Nave vista desde el portón (supuesto de 7 × 6 m; ajustar al local real).</figcaption></figure>
      <figure>${storePlan(c)}<figcaption>Planta de la tienda.</figcaption></figure></div>
    </article>`).join('');
  $('#matrix').innerHTML = matrixHTML();

  PROPS.lona.forEach(p => sceneLona($(`#m-${p.id}`), p.line));
  PROPS.roll.forEach(p => sceneRoll($(`#m-${p.id}`), `roll-${p.line}`));
  PROPS.mat.forEach(p => sceneMat($(`#m-${p.id}`), p.line));
  PROPS.techo.forEach(p => [0, 90, 180, 270].forEach((phi, i) => sceneTecho($(`#t-${p.id}-${i}`), p.line, phi)));
  COMPS.forEach(c => mkScene($(`#c-${c.id}`), sc => addComposition(sc, c), CAMS['3/4'], 'comp'));
  COMPS.forEach(c => sceneStore($(`#s-${c.id}`), c));
  rerender();
}

/* ---------- 8. Controles ---------- */
function controls() {
  const bar = $('#camBar');
  bar.innerHTML = Object.keys(CAMS).map((k, i) => `<button type="button" id="cam-${i}" data-cam="${k}" aria-pressed="${i === 0}">${k}</button>`).join('');
  bar.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    bar.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    rerender('comp', CAMS[b.dataset.cam]);
  });
  const tg = $('#techToggle');
  const apply = () => document.body.classList.toggle('show-tech', tg.checked);
  tg.addEventListener('change', apply); apply();
  let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => rerender(), 200); });
}

function start() { $("#heroLogo").src = LOGO; paint(); controls(); }
if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
