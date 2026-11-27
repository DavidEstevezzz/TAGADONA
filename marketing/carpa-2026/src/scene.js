/* =============================================================
   MAQUETAS 3D EN CSS
   Mundo en mm: X a la derecha, Y hacia arriba, D hacia el fondo
   (D = 0 es el frente/acceso de la carpa). Cada plano es un div
   con matrix3d, así que la perspectiva es real y la gráfica que
   se ve es la misma <g> de la vista plana.
   ============================================================= */
const PX = 0.25; // px por mm dentro del mundo (solo afecta a la nitidez)
const toC = (p) => [p[0] * PX, -p[1] * PX, -p[2] * PX];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const addv = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

function svgUse(id, vb, extra = '') {
  return `<svg viewBox="${vb}" preserveAspectRatio="none" width="100%" height="100%" style="display:block">${extra}<use href="#${id}"/></svg>`;
}

class Scene {
  constructor(host, opts = {}) {
    this.host = host; this.parts = []; this.opts = opts;
  }
  // P0: esquina sup-izq del contenido (mundo); U: vector a lo ancho; V: vector a lo alto
  plane(P0, U, V, html, o = {}) {
    const p = toC(P0), u = toC(U), v = toC(V);
    const ew = Math.max(len(u), 1), eh = Math.max(len(v), 1);
    let n = cross(u, v); n = mul(n, 1 / (len(n) || 1));
    const m = [u[0] / ew, u[1] / ew, u[2] / ew, 0, v[0] / eh, v[1] / eh, v[2] / eh, 0, n[0], n[1], n[2], 0, p[0], p[1], p[2], 1];
    const st = `width:${ew.toFixed(2)}px;height:${eh.toFixed(2)}px;transform:matrix3d(${m.map(x => +x.toFixed(5)).join(',')});${o.clip ? `clip-path:${o.clip};` : ''}${o.back ? 'backface-visibility:hidden;' : ''}${o.style || ''}`;
    this.parts.push(`<div class="pl ${o.cls || ''}" style="${st}">${html}</div>`);
    if (o.back) { // cara posterior (tela sin imprimir)
      const P1 = addv(P0, U);
      const clip2 = o.clip ? o.clip.replace(/polygon\((.*)\)/, (m0, a) => 'polygon(' + a.split(',').map(pt => { const [x, y] = pt.trim().split(/\s+/); return `${100 - parseFloat(x)}% ${y}`; }).join(',') + ')') : '';
      this.plane(P1, mul(U, -1), V, `<div style="width:100%;height:100%;background:${o.back}"></div>`, { clip: clip2, style: 'backface-visibility:hidden;' });
    }
  }
  solid(P0, U, V, color, o = {}) { this.plane(P0, U, V, `<div style="width:100%;height:100%;background:${color}"></div>`, o); }
  box(x, y, d, w, h, dp, color, side) { // caja: x,y,d = esquina inferior-izquierda-delantera
    const c2 = side || color;
    this.solid([x, y + h, d], [w, 0, 0], [0, -h, 0], color);                // frente
    this.solid([x + w, y + h, d + dp], [-w, 0, 0], [0, -h, 0], color);      // detrás
    this.solid([x, y + h, d + dp], [0, 0, -dp], [0, -h, 0], c2);            // izquierda
    this.solid([x + w, y + h, d], [0, 0, dp], [0, -h, 0], c2);              // derecha
    this.solid([x, y + h, d + dp], [w, 0, 0], [0, 0, -dp], color);          // arriba
  }
  ground(x0, x1, d0, d1, color, grid = true) {
    const g = grid ? `background-image:linear-gradient(rgba(0,0,0,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.09) 1px,transparent 1px);background-size:${1000 * PX}px ${1000 * PX}px;` : '';
    this.plane([x0, 0, d1], [x1 - x0, 0, 0], [0, 0, -(d1 - d0)], `<div style="width:100%;height:100%;background-color:${color};${g}"></div>`);
  }
  render(cam) {
    const H = this.host.clientHeight || 400, W = this.host.clientWidth || 640;
    const P = H / 2 / Math.tan((cam.fov || 46) / 2 * Math.PI / 180);
    const E = toC(cam.eye), Tg = toC(cam.target), d = sub(Tg, E);
    const b = Math.atan2(d[0], -d[2]);
    const r = Math.hypot(d[0], d[2]);
    const a = Math.atan2(-d[1], r);
    const tf = `translateZ(${P.toFixed(1)}px) rotateX(${a}rad) rotateY(${b}rad) translate3d(${(-E[0]).toFixed(1)}px,${(-E[1]).toFixed(1)}px,${(-E[2]).toFixed(1)}px)`;
    this.host.innerHTML = `<div class="stage" style="perspective:${P.toFixed(1)}px"><div class="world" style="transform:${tf}">${this.parts.join('')}</div></div>`;
    this.cam = cam;
  }
}

/* ---------- piezas en 3D ---------- */
const TENT = { W: 3000, EAVE: 2400, CEN: 250, RISE: 901 };

function addTent(sc, techo, o = {}) {
  const { W, EAVE, CEN, RISE } = TENT;
  const leg = 40, legc = '#b9b6b1', legs = '#9f9c97';
  [[0, 0], [W - leg, 0], [0, W - leg], [W - leg, W - leg]].forEach(([x, d]) => sc.box(x, 0, d, leg, EAVE, leg, legc, legs));
  [[0, 0], [W - 160, 0], [0, W - 160], [W - 160, W - 160]].forEach(([x, d]) => sc.solid([x, 4, d + 160], [160, 0, 0], [0, 0, -160], '#8d8a85')); // pies
  const A = [W / 2, EAVE + RISE, W / 2];
  const corners = { FL: [0, EAVE, 0], FR: [W, EAVE, 0], BR: [W, EAVE, W], BL: [0, EAVE, W] };
  const sides = { F: ['FL', 'FR'], R: ['FR', 'BR'], B: ['BR', 'BL'], L: ['BL', 'FL'] };
  const inner = o.inner || '#e9e5de';
  Object.entries(sides).forEach(([k, [l, rr]]) => {
    const Lp = corners[l], Rp = corners[rr];
    const U = sub(Rp, Lp), P0 = sub(A, mul(U, .5)), V = sub(Lp, P0);
    const id = techo ? `t${techo.name}_${k}` : null;
    const html = id ? svgUse(id, '0 0 3000 1750') : `<div style="width:100%;height:100%;background:#f1eee8"></div>`;
    sc.plane(P0, U, V, html, { clip: 'polygon(50% 0%, 100% 100%, 0% 100%)', back: inner });
    const cid = techo ? `t${techo.name}_c${k}` : null;
    const chtml = cid ? svgUse(cid, '0 0 3000 250') : `<div style="width:100%;height:100%;background:#f1eee8"></div>`;
    sc.plane(Lp, U, [0, -CEN, 0], chtml, { back: inner });
  });
}

// Lona colgada en la trasera: borde inferior a 1.050 mm del suelo
function addLona(sc, id, x0 = 500, y0 = 1050, d = 2960, opts = {}) {
  sc.plane([x0, y0 + 1000, d], [2000, 0, 0], [0, -1000, 0], svgUse(id, '0 0 2000 1000'), { back: '#f4f4f2' });
  if (opts.cords !== false) {
    const c = '#2a2725';
    // pulpos laterales hacia los postes traseros y bridas al travesaño
    [y0 + 975, y0 + 500, y0 + 25].forEach(y => {
      sc.solid([0, y + 5, d + 5], [x0 + 25, 0, 0], [0, -10, 0], c);
      sc.solid([x0 + 1975, y + 5, d + 5], [3000 - x0 - 1975, 0, 0], [0, -10, 0], c);
    });
    [25, 512, 1000, 1488, 1975].forEach(x => sc.solid([x0 + x - 5, TENT.EAVE, d + 5], [10, 0, 0], [0, -(TENT.EAVE - y0 - 975), 0], c));
  }
}

// Roll-up: x,d = extremo izquierdo de la base; a = giro en grados (positivo = mira hacia la derecha)
function addRoll(sc, id, x, d, a = 0) {
  const r = a * Math.PI / 180, u = [Math.cos(r), 0, Math.sin(r)], n = [-Math.sin(r), 0, Math.cos(r)];
  const P = (s, y, t = 0) => [x + u[0] * s + n[0] * -t, y, d + u[2] * s + n[2] * -t];
  // base (cajón) 870 × 90 × 230 aprox.
  const bw = 870, bh = 90, bd = 230;
  const o = P(-10, 0, 115), U = mul(u, bw), N = mul(n, -bd);
  const top = addv(o, [0, bh, 0]);
  sc.plane(addv(top, [0, 0, 0]), U, [0, -bh, 0], '<div style="width:100%;height:100%;background:#a9a7a3"></div>');
  sc.plane(addv(top, N), U, mul(N, -1), '<div style="width:100%;height:100%;background:#c9c7c3"></div>');
  sc.plane(P(0, 2000 + bh), mul(u, 850), [0, -2000, 0], svgUse(id, '0 0 850 2000'), { back: '#d8d6d2' });
  sc.solid(P(420, 2000 + bh, -40), mul(u, 14), [0, -2000, 0], '#7d7a76'); // mástil trasero
}

function addMat(sc, id, x0, d0) {
  sc.plane([x0, 4, d0 + 1050], [2150, 0, 0], [0, 0, -1050], svgUse(id, '0 0 2150 1050'));
}

// Moto sobre la alfombra (x0,d0 = esquina de la alfombra) o libre con giro
function addMoto(sc, x0, d0, o = {}) {
  const yaw = (o.yaw || 0) * Math.PI / 180, u = [Math.cos(yaw), 0, Math.sin(yaw)], nrm = [-Math.sin(yaw), 0, Math.cos(yaw)];
  // origen = punto de la alfombra (380, 500) bajo la rueda delantera
  const cx = o.free ? x0 : x0 + 380, cd = o.free ? d0 : d0 + 550;
  const base = (off) => [cx - u[0] * 330 + nrm[0] * off, 1150, cd - u[2] * 330 + nrm[2] * off];
  const style = o.ghost ? 'opacity:.55;filter:grayscale(1) brightness(1.3);' : '';
  [-75, 0, 75].forEach(off => sc.plane(base(off), mul(u, 2100), [0, -1150, 0], svgUse('moto', '0 0 2100 1150'), { style }));
  // silueta frontal (perpendicular) para que la moto tenga cuerpo vista de frente o de lado
  const fc = [cx - u[0] * 330 + u[0] * 1000, cd - u[2] * 330 + u[2] * 1000];
  sc.plane([fc[0] - nrm[0] * 400, 1150, fc[1] - nrm[2] * 400], mul(nrm, 800), [0, -1150, 0], svgUse('motoF', '0 0 800 1150'), { style });
  const hx = cx - u[0] * 330 + u[0] * 585, hd = cd - u[2] * 330 + u[2] * 585;
  sc.solid([hx - nrm[0] * 380, 880, hd - nrm[2] * 380], mul(nrm, 760), [0, -28, 0], '#1d1c1b', { style });
}
function addPerson(sc, x, d, yaw = 0) {
  const r = yaw * Math.PI / 180;
  sc.plane([x, 1750, d], [500 * Math.cos(r), 0, 500 * Math.sin(r)], [0, -1750, 0], svgUse('person', '0 0 500 1750'));
}

/* ---------- cámaras ---------- */
function camAround(phiDeg, dist = 8200, eyeY = 1650, center = [1500, 0, 1500], tY = 1650, fov = 46) {
  const p = phiDeg * Math.PI / 180;
  return { eye: [center[0] + dist * Math.sin(p), eyeY, center[2] - dist * Math.cos(p)], target: [center[0], tY, center[2]], fov };
}
const CAMS = {
  '3/4': camAround(32, 7000, 1650, [1300, 0, 1500], 1750),
  'Frente': camAround(0, 7000, 1650, [1300, 0, 1500], 1750),
  'Lateral dcha.': camAround(90, 7000, 1650, [1300, 0, 1500], 1750),
  'Desde atrás': camAround(180, 7000, 1650, [1300, 0, 1500], 1750),
  'Lateral izda.': camAround(-90, 7000, 1650, [1300, 0, 1500], 1750),
};
