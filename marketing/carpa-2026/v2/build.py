"""Ronda 2 · propuestas planas de Tagadona Racing.
Genera presentacion.html (páginas A3 apaisadas) con las 12 propuestas dibujadas en mm reales.
Solo logo (calco provisional) y gráficos vectoriales. Sin fotos."""
import math, random, re
from pathlib import Path

HERE = Path(__file__).parent
LOGO_INNER = re.search(r"<svg[^>]*>(.*)</svg>", (HERE / "logo-calco.svg").read_text(), re.S).group(1)
LOGO_PATHS = re.findall(r"<path[^>]*/>", LOGO_INNER)  # 0 = silueta blanca de pegatina, 1 oliva, 2 naranja, 3 blanco

OL, OL2, OL3, OL4 = "#1f2315", "#283019", "#323b23", "#465032"
OR, CR, BK = "#D97A28", "#F2EADB", "#141110"
GERM, OSW = "'Germania One', Georgia, serif", "Oswald, 'Arial Narrow', sans-serif"


def T(x, y, s, txt, c=CR, f=OSW, w=500, a="middle", ls=0, safe=True):
    return (f'<text {"data-safe " if safe else ""}x="{x}" y="{y}" font-family="{f}" font-size="{s}" font-weight="{w}" '
            f'fill="{c}" text-anchor="{a}" letter-spacing="{ls}">{txt}</text>')


def logo(cx, cy, d):
    s = d / 527
    return f'<g data-safe transform="translate({cx - 324.5 * s:.2f} {cy - 324.5 * s:.2f}) scale({s:.5f})"><use href="#logo"/></g>'


MOTO_BOX = (165, 316, 305, 161)  # x, y, w, h en coordenadas del sello


def moto(x, y, w):
    s = w / MOTO_BOX[2]
    return f'<g data-safe transform="translate({x - MOTO_BOX[0] * s:.2f} {y - MOTO_BOX[1] * s:.2f}) scale({s:.5f})"><use href="#moto"/></g>'


def rings(cx, cy, r0, r1, step, color, sw):
    return "".join(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{color}" stroke-width="{sw}"/>'
                   for r in range(r0, r1, step))


def ridge(x0, x1, y, amp, bottom, seed, fill, n=9):
    rnd = random.Random(seed)
    pts = [(x0, y + amp * (rnd.random() - .3))]
    for i in range(1, n):
        x = x0 + (x1 - x0) * i / n + (rnd.random() - .5) * (x1 - x0) / n * .5
        pts.append((x, y - amp * ((rnd.random() * .9 + .1) if i % 2 else -rnd.random() * .35)))
    pts.append((x1, y + amp * (rnd.random() - .3)))
    p = " ".join(f"{a:.1f},{b:.1f}" for a, b in pts)
    return f'<polygon fill="{fill}" points="{p} {x1},{bottom} {x0},{bottom}"/>'


def topo(cx, cy, levels, r0, step, seed, stroke, sw, sx=1.0, sy=1.0):
    rnd = random.Random(seed)
    harm = [(k, rnd.random() * .16 / k, rnd.random() * 6.28) for k in (1, 2, 3, 5)]
    out = []
    for l in range(levels):
        R = r0 + l * step
        d = []
        for i in range(121):
            a = i / 120 * math.tau
            k = 1 + sum(amp * math.sin(h * a + ph + l * .07) for h, amp, ph in harm)
            d.append(f"{'L' if i else 'M'}{cx + math.cos(a) * R * k * sx:.1f} {cy + math.sin(a) * R * k * sy:.1f}")
        out.append(f'<path d="{"".join(d)}Z" fill="none" stroke="{stroke}" stroke-width="{sw}"/>')
    return "".join(out)


# ---------------------------------------------------------------- LONA 2000 × 1000 · margen 110
def lona1():
    return f"""<rect width="2000" height="1000" fill="{OL}"/>
{rings(1000, 1000, 620, 1500, 52, OL3, 5)}
<circle cx="1000" cy="1000" r="560" fill="{OR}"/>
{logo(1000, 470, 660)}
{T(390, 495, 60, 'COMPRAVENTA', ls=14)}
{T(1610, 495, 60, 'DE MOTOS', ls=14)}
<rect x="345" y="525" width="90" height="6" fill="{OR}"/><rect x="1565" y="525" width="90" height="6" fill="{OR}"/>"""


def lona2():
    return f"""<rect width="2000" height="1000" fill="{OL}"/>
<circle cx="1760" cy="230" r="150" fill="{OR}"/>
{T(110, 310, 210, 'Tagadona', f=GERM, a='start')}
{T(110, 505, 210, 'Racing', f=GERM, a='start', c=OR)}
{T(116, 590, 40, 'COMPRAVENTA DE MOTOS', a='start', ls=10)}
{moto(860, 337, 1030)}
<rect x="110" y="881" width="1780" height="6" fill="{CR}"/>"""


def lona3():
    st = "".join(f'<polygon points="{x},1000 {x + 120},1000 {x + 520},0 {x + 400},0" fill="{c}"/>'
                 for x, c in ((1480, OR), (1630, CR), (1700, OR)))
    return f"""<rect width="2000" height="1000" fill="{BK}"/>
{st}
<circle cx="420" cy="500" r="330" fill="{OL}"/>
{logo(420, 500, 560)}
{T(800, 455, 135, 'COMPRAVENTA', w=700, a='start')}
{T(800, 605, 135, 'DE MOTOS', w=700, a='start', c=OR)}
{T(806, 695, 36, 'TAGADONARACING.ES', a='start', ls=12, w=400)}"""


# ---------------------------------------------------------------- ROLL-UP · corte 850 × 2100 (visible 0–2000)
def roll1():
    return f"""<rect x="-5" y="-5" width="860" height="2110" fill="{OL}"/>
{rings(425, 900, 380, 900, 40, OL3, 4)}
<circle cx="425" cy="900" r="340" fill="{OR}"/>
{logo(425, 900, 600)}
{T(425, 300, 92, 'COMPRAVENTA', ls=12)}
{T(425, 410, 92, 'DE MOTOS', ls=12)}
<rect x="380" y="455" width="90" height="6" fill="{OR}"/>
{ridge(-5, 855, 1560, 90, 2105, 3, OL2, 6)}
{ridge(-5, 855, 1680, 70, 2105, 11, OL3, 7)}
{ridge(-5, 855, 1800, 50, 2105, 19, OL, 8)}
{T(425, 1900, 40, 'TAGADONARACING.ES', ls=10, w=400)}"""


def roll2():
    return f"""<rect x="-5" y="-5" width="860" height="2110" fill="{OL}"/>
{T(425, 330, 175, 'Tagadona', f=GERM)}
{T(425, 500, 175, 'Racing', f=GERM, c=OR)}
{moto(60, 720, 730)}
<rect x="60" y="1135" width="730" height="6" fill="{CR}"/>
<clipPath id="r2c"><rect x="-5" y="-5" width="860" height="2110"/></clipPath>
<g clip-path="url(#r2c)">{rings(425, 2000, 470, 900, 40, OL3, 4)}<circle cx="425" cy="2000" r="430" fill="{OR}"/></g>
{T(425, 1780, 48, 'COMPRAVENTA DE MOTOS', c=BK, w=600, ls=6)}
{T(425, 1850, 34, 'GRANADA', c=BK, w=500, ls=12)}"""


def roll3():
    st = "".join(f'<polygon points="-5,{y} 855,{y - 520} 855,{y - 520 + h} -5,{y + h}" fill="{c}"/>'
                 for y, h, c in ((1700, 150, OR), (1880, 40, CR), (1950, 90, OR)))
    return f"""<rect x="-5" y="-5" width="860" height="2110" fill="{BK}"/>
{st}
<circle cx="425" cy="440" r="330" fill="{OL}"/>
{logo(425, 440, 560)}
{T(425, 1000, 128, 'COMPRAMOS', w=700)}
{T(425, 1140, 128, 'TU MOTO', w=700, c=OR)}
{T(425, 1290, 78, '644 904 418', w=600)}"""


# ---------------------------------------------------------------- ALFOMBRA vertical · corte 1050 × 2150 (+5) · entrada abajo
def mat1():
    return f"""<rect x="-5" y="-5" width="1060" height="2160" fill="{OL}"/>
<rect x="70" y="70" width="910" height="2010" fill="none" stroke="{CR}" stroke-width="8"/>
<rect x="96" y="96" width="858" height="1958" fill="none" stroke="{OR}" stroke-width="4"/>
{logo(525, 880, 660)}
{T(525, 1420, 112, 'Tagadona Racing', f=GERM)}
<rect x="465" y="1478" width="120" height="6" fill="{OR}"/>
{T(525, 1560, 40, 'GARAGE · GRANADA', ls=14, w=400)}"""


def mat2():
    stripes = (f'<rect x="150" y="-5" width="90" height="2160" fill="{OR}"/><rect x="810" y="-5" width="90" height="2160" fill="{OR}"/>'
               f'<rect x="268" y="-5" width="14" height="2160" fill="{CR}"/><rect x="768" y="-5" width="14" height="2160" fill="{CR}"/>')
    return f"""<rect x="-5" y="-5" width="1060" height="2160" fill="{BK}"/>
{stripes}
<circle cx="525" cy="760" r="235" fill="{OL}"/>
{logo(525, 760, 440)}
{T(525, 1250, 62, 'TAGADONA', w=600, ls=16)}
{T(525, 1330, 62, 'RACING', w=600, ls=16)}
{T(525, 1410, 30, 'GARAGE · GRANADA', w=400, ls=12, c=OR)}"""


def mat3():
    return f"""<rect x="-5" y="-5" width="1060" height="2160" fill="{OL}"/>
<clipPath id="m3c"><rect x="-5" y="-5" width="1060" height="2160"/></clipPath>
<g clip-path="url(#m3c)">{topo(525, 1075, 26, 330, 44, 5, OL4, 5, sx=.95, sy=1.6)}</g>
<circle cx="525" cy="1075" r="345" fill="{OL}"/>
<circle cx="525" cy="1075" r="345" fill="none" stroke="{OR}" stroke-width="5"/>
{logo(525, 1075, 560)}"""


# ---------------------------------------------------------------- TECHO · cara 3000 × 1750 + cenefa 3000 × 250
TRI = "1500,0 3000,1750 0,1750"


def face(inner, bg=OL):
    return f'<g clip-path="url(#tri)"><polygon points="{TRI}" fill="{bg}"/>{inner}</g>'


def cen_name(txt="Tagadona Racing", f=GERM, s=160, w=400, ls=0):
    dia = lambda x: f'<rect x="{x - 22}" y="103" width="44" height="44" fill="{OR}" transform="rotate(45 {x} 125)"/>'
    return (f'<rect width="3000" height="250" fill="{CR}"/><rect width="3000" height="16" fill="{OR}"/>'
            f'{T(1500, 180, s, txt, c=OL, f=f, w=w, ls=ls)}{dia(560)}{dia(2440)}')


def techo1():
    f = face(f'{logo(1500, 1100, 1000)}<rect x="0" y="1715" width="3000" height="35" fill="{OR}"/>')
    return {s: (f, cen_name()) for s in "FRBL"}


def techo2():
    fl = face(f'{logo(1500, 1100, 1000)}<rect x="0" y="1715" width="3000" height="35" fill="{OR}"/>')
    side = face(f'{ridge(0, 3000, 1580, 90, 1750, 12, OL2, 10)}{T(1500, 1150, 330, "Tagadona", f=GERM)}'
                f'{T(1500, 1470, 330, "Racing", f=GERM, c=OR)}<rect x="0" y="1715" width="3000" height="35" fill="{OR}"/>')
    c2 = cen_name("COMPRAVENTA DE MOTOS", f=OSW, s=130, w=600, ls=12)
    return {"F": (fl, cen_name()), "B": (fl, cen_name()), "R": (side, c2), "L": (side, c2)}


def techo3():
    f = face(f'<polygon points="1500,0 2100,700 900,700" fill="{OR}"/><rect x="0" y="700" width="3000" height="40" fill="{CR}"/>'
             f'{logo(1500, 1220, 860)}')
    return {s: (f, cen_name()) for s in "FRBL"}


# ---------------------------------------------------------------- catálogo
P = {
    "lona": [("L1", "Sello al amanecer", lona1, "Sol naranja que sale por abajo y sello en el centro. Dos palabras a cada lado. Simétrica y se reconoce desde lejos."),
             ("L2", "La moto del sello", lona2, "La moto del sello en grande, como ilustración, con el nombre en Germania. Pura imagen de marca."),
             ("L3", "Decoración de carreras", lona3, "Fondo negro con franjas de carreras, sello y una sola frase grande. La más comercial y directa.")],
    "roll": [("R1", "Sol y sierra", roll1, "Sello sobre el sol a la altura de los ojos y crestas de sierra abajo. Solo dos palabras y la web."),
             ("R2", "Nombre y moto", roll2, "Nombre arriba, la moto del sello en el centro y medio sol abajo con «Compraventa de motos»."),
             ("R3", "Compramos tu moto", roll3, "Sello, una frase y el teléfono. Es el único que pide una acción, con franjas de carreras.")],
    "mat": [("M1", "Recepción", mat1, "Doble filete crema y naranja, sello y nombre. Clásica, como la alfombra de un hotel con garaje."),
            ("M2", "Pasillo de boxes", mat2, "Negro con franjas naranja a lo largo, como una pista que te mete en la tienda. El sello te espera al fondo."),
            ("M3", "Curvas de nivel", mat3, "Curvas de nivel oliva sobre oliva y el sello en el centro con filete naranja. Sin texto. La más elegante y la que mejor disimula el polvo.")],
    "techo": [("T1", "Sello en las cuatro caras", techo1, "Tu favorita afinada: sello más grande y centrado en las cuatro caras, filo naranja y cenefa crema solo con el nombre. Se lee igual desde cualquier lado."),
              ("T2", "Sello y nombre", techo2, "Sello delante y detrás. Laterales con «Tagadona Racing» enorme sobre la sierra. Cenefas con el nombre y «Compraventa de motos»."),
              ("T3", "Sello bajo el pico", techo3, "Punta naranja y línea crema en cada cara, con el sello debajo. Las cuatro puntas forman un pico naranja que se ve de lejos.")],
}
SPEC = {
    "lona": dict(vb="0 0 2000 1000", w=2000, h=1000, safe=(110, 110, 1890, 890), name="Lona trasera · 2.000 × 1.000 mm · sin sangrado · margen 110 mm"),
    "roll": dict(vb="-5 -5 860 2110", w=860, h=2110, safe=(50, 50, 800, 1950), name="Roll-up · gráfica 850 × 2.100 (visible 2.000) · fondo a sangrado de 5 mm"),
    "mat": dict(vb="-5 -5 1060 2160", w=1060, h=2160, safe=(110, 110, 940, 2040), name="Alfombra de entrada · 1.050 × 2.150 mm · sangrado 5 mm · se entra por abajo"),
}
DEFS = (f'<defs><g id="logo">{LOGO_INNER}</g>'
        f'<clipPath id="mc"><polygon points="165,477 165,392 240,378 300,362 348,342 350,316 386,316 394,352 400,396 470,400 470,477 368,477 368,470 268,470 268,477"/></clipPath>'
        f'<g id="moto"><g clip-path="url(#mc)"><rect x="150" y="300" width="340" height="190" fill="{OL}"/>{"".join(LOGO_PATHS[1:])}</g></g>'
        f'<clipPath id="tri"><polygon points="{TRI}"/></clipPath></defs>')


def art(kind, fn, cls=""):
    s = SPEC[kind]
    return f'<svg class="art {cls}" data-safe-rect="{",".join(map(str, s["safe"]))}" viewBox="{s["vb"]}">{fn()}</svg>'


def techo_net(fn):
    sides = fn()
    cols = []
    for i, k in enumerate("FRBL"):
        fce, cen = sides[k]
        x, y = (i % 2) * 3300, (i // 2) * 2450
        lab = {"F": "FRENTE", "R": "LATERAL DCHO.", "B": "TRASERA", "L": "LATERAL IZDO."}[k]
        cols.append(f'<g transform="translate({x} {y})">{fce}<g transform="translate(0 1800)">{cen}</g>'
                    f'<text x="1500" y="2230" font-family="{OSW}" font-size="110" fill="#8a8178" text-anchor="middle" letter-spacing="10">{lab}</text></g>')
    return f'<svg class="art" viewBox="0 0 6300 4700">{"".join(cols)}</svg>'


def page(body, title, note="", pid=""):
    return (f'<section class="pg"><header><span class="id">{pid}</span><h2>{title}</h2></header>'
            f'<div class="stage">{body}</div><footer>{note}</footer></section>')


pages = []
pages.append("""<section class="pg cover"><div class="cv">
<p class="eb">TAGADONA RACING · PIEZAS DE CARPA Y TIENDA · RONDA 2</p>
<h1>Propuestas planas</h1>
<p class="lead">Tres propuestas por pieza. Solo el sello y gráficos vectoriales: poco texto y mucha imagen. Elige una de cada (o mezcla) y después la afino a arte final y la monto en 3D.</p>
<ul><li>Lona trasera · L1 L2 L3</li><li>Roll-up · R1 R2 R3</li><li>Alfombra de entrada (vertical) · M1 M2 M3</li><li>Techo de carpa · T1 T2 T3 (a partir del que te gustó)</li></ul>
<p class="small">El sello es un calco vectorial PROVISIONAL del PNG de la web: para el arte final necesito el original. Colores en pantalla en RGB; arte final en CMYK Coated FOGRA39.</p>
</div></section>""")
for kind, label in (("lona", "Lona"), ("roll", "Roll-up"), ("mat", "Alfombra")):
    cmp_ = "".join(f'<figure>{art(kind, fn)}<figcaption><b>{pid}</b> {t}</figcaption></figure>' for pid, t, fn, _ in P[kind])
    pages.append(page(f'<div class="cmp {kind}">{cmp_}</div>', f"{label} · comparativa", SPEC[kind]["name"], label.upper()))
    for pid, t, fn, why in P[kind]:
        pages.append(page(f'<div class="one {kind}">{art(kind, fn)}</div>', t, f'{why} <span class="spec">{SPEC[kind]["name"]}</span>', pid))
for pid, t, fn, why in P["techo"]:
    pages.append(page(f'<div class="one techo">{techo_net(fn)}</div>', t,
                      f'{why} <span class="spec">Maqueta a escala: caras de ~3.000 × 1.750 mm y cenefas de 3.000 × 250 mm. El troquel real sale de la plantilla del fabricante.</span>', pid))

CSS = """
@page { size: 420mm 297mm; margin: 0 }
*{box-sizing:border-box} html,body{margin:0;background:#0f0d0c}
body{font-family:Poppins,Arial,sans-serif;color:#efe7dc}
.pg{width:420mm;height:297mm;padding:14mm 16mm 12mm;display:flex;flex-direction:column;gap:6mm;page-break-after:always;break-after:page;overflow:hidden;background:#0f0d0c}
.pg header{display:flex;align-items:baseline;gap:5mm}
.pg h2{font-family:Oswald,sans-serif;font-weight:500;font-size:9mm;margin:0;letter-spacing:.04em;text-transform:uppercase}
.id{font-family:Oswald,sans-serif;font-size:6mm;background:#D97A28;color:#141110;padding:1mm 3mm;font-weight:600}
.stage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}
.pg footer{font-size:3.6mm;color:#bfb5a9;max-width:300mm;line-height:1.45}
.spec{display:block;color:#8a8178;font-size:3mm;margin-top:1.5mm;letter-spacing:.02em}
svg.art{display:block;max-width:100%;max-height:100%;box-shadow:0 1.5mm 6mm rgba(0,0,0,.55)}
.one{width:100%;height:100%;display:flex;align-items:center;justify-content:center}
.one.lona svg{width:100%;height:auto}
.one.roll svg,.one.mat svg{height:100%;width:auto}
.one.techo svg{height:100%;width:auto;box-shadow:none}
.cmp{display:flex;gap:8mm;width:100%;height:100%;align-items:center;justify-content:center}
.cmp.lona{display:grid;grid-template-columns:1fr 1fr;gap:6mm 8mm;align-content:center;justify-items:center}
.cmp.lona svg{width:180mm;height:auto}
.cmp figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:2.5mm;height:100%;justify-content:center}
.cmp.lona figure{height:auto}
.cmp.lona figure:last-child{grid-column:1 / -1}
.cmp.roll svg,.cmp.mat svg{height:205mm;width:auto}
figcaption{font-size:4mm;color:#d7cdc1}
figcaption b{font-family:Oswald,sans-serif;color:#D97A28;margin-right:1.5mm}
.cover{justify-content:center}
.cv{max-width:270mm}
.eb{font-family:Oswald,sans-serif;letter-spacing:.3em;color:#D97A28;font-size:4.2mm}
h1{font-family:'Germania One',Georgia,serif;font-weight:400;font-size:30mm;margin:2mm 0 6mm;color:#F2EADB;line-height:.95}
.lead{font-size:6mm;line-height:1.45;margin:0 0 6mm}
.cv ul{font-family:Oswald,sans-serif;font-size:6mm;letter-spacing:.05em;padding-left:6mm;margin:0 0 8mm;line-height:1.6}
.small{font-size:3.6mm;color:#a39b91;max-width:230mm}
"""
html = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Tagadona Racing · Propuestas planas · Ronda 2</title>
<link href="https://fonts.googleapis.com/css2?family=Germania+One&family=Oswald:wght@400;500;600;700&family=Poppins:wght@400;500&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body><svg width="0" height="0" style="position:absolute">{DEFS}</svg>{''.join(pages)}</body></html>"""
(HERE / "presentacion.html").write_text(html)
print("presentacion.html", len(html) // 1024, "KB,", len(pages), "páginas")
