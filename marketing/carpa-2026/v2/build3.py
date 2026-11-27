"""Ronda 3 · roll-ups inspirados en Pinterest + una variante nueva de lona, alfombra y techo.
Reutiliza las utilidades de build.py. Genera presentacion3.html (A3 apaisado)."""
import base64, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
import build as B
from build import T, logo, moto, ridge, rings, face, cen_name, OL, OL2, OL3, OL4, OR, CR, BK, GERM, OSW

HERE = Path(__file__).parent
ASPH = "#1a1917"


def vtext(cx, cy, s, txt, c, w=700, ls=0, f=OSW):
    """Texto vertical que se lee de abajo arriba, centrado en (cx, cy); la base queda en x = cx."""
    return (f'<text x="{cx}" y="{cy}" transform="rotate(-90 {cx} {cy})" font-family="{f}" font-size="{s}" '
            f'font-weight="{w}" fill="{c}" text-anchor="middle" letter-spacing="{ls}">{txt}</text>')


def road(cx, y_h, y_b, half_b, edge, dash_c, n=9, k=.55, asphalt=ASPH):
    """Carretera en perspectiva: horizonte en y_h, base en y_b con semiancho half_b."""
    out = [f'<polygon points="{cx - 6},{y_h} {cx + 6},{y_h} {cx + half_b},{y_b} {cx - half_b},{y_b}" fill="{asphalt}"/>']
    for sgn in (-1, 1):
        x_in = cx + sgn * half_b * .9
        out.append(f'<polygon points="{cx + sgn * 4},{y_h} {cx + sgn * 6},{y_h} {cx + sgn * half_b * .93},{y_b} {x_in},{y_b}" fill="{edge}"/>')
    span = y_b - y_h
    for i in range(n):
        y0 = y_h + span / (1 + k * i)
        y1 = y_h + span / (1 + k * (i + .55))
        w0, w1 = 34 * (y0 - y_h) / span, 34 * (y1 - y_h) / span
        out.append(f'<polygon points="{cx - w0},{y0:.1f} {cx + w0},{y0:.1f} {cx + w1},{y1:.1f} {cx - w1},{y1:.1f}" fill="{dash_c}"/>')
    return "".join(out)


# ---------------------------------------------------------------- ROLL-UPS (corte 850 × 2100; visible 0–2000)
def roll4():  # Palabra vertical gigante + sello delante
    return f"""<rect x="-5" y="-5" width="860" height="2110" fill="{OL}"/>
{vtext(800, 1000, 560, 'RACING', OR, ls=-6)}
<circle cx="330" cy="600" r="300" fill="{OL}"/>
{logo(330, 600, 540)}
{T(60, 1760, 40, 'COMPRAVENTA', a='start', w=600, ls=4)}
{T(60, 1815, 40, 'DE MOTOS', a='start', w=600, ls=4)}
<rect x="60" y="1850" width="80" height="6" fill="{OR}"/>
{T(60, 1910, 30, 'GRANADA', a='start', w=400, ls=10, c=OR)}"""


def roll5():  # Carretera hacia el horizonte
    return f"""<rect x="-5" y="-5" width="860" height="2110" fill="{OL}"/>
<clipPath id="r5"><rect x="-5" y="-5" width="860" height="2110"/></clipPath>
<g clip-path="url(#r5)">
{rings(425, 1120, 300, 620, 34, OL3, 4)}
<circle cx="425" cy="1120" r="250" fill="{OR}"/>
{ridge(-5, 855, 1060, 70, 1200, 4, OL2, 7)}
{ridge(-5, 855, 1110, 45, 1200, 9, OL3, 8)}
<rect x="-5" y="1118" width="860" height="1000" fill="{OL}"/>
{road(425, 1120, 2105, 560, CR, OR, n=8, k=.6)}
</g>
{logo(425, 470, 560)}
{T(425, 880, 46, 'COMPRAVENTA DE MOTOS', w=600, ls=8)}"""


def roll6():  # Ficha técnica clara
    cx, cy, d = 425, 640, 600
    ticks = "".join(f'<line x1="{cx + (d / 2 + 40) * c}" y1="{cy + (d / 2 + 40) * s}" x2="{cx + (d / 2 + 70) * c}" y2="{cy + (d / 2 + 70) * s}" stroke="{OL}" stroke-width="3"/>'
                    for c, s in [(__import__('math').cos(a), __import__('math').sin(a)) for a in [i * 3.14159 / 12 for i in range(24)]])
    return f"""<rect x="-5" y="-5" width="860" height="2110" fill="{CR}"/>
<line x1="60" y1="{cy}" x2="790" y2="{cy}" stroke="{OL}" stroke-width="2" opacity=".35"/>
<line x1="{cx}" y1="230" x2="{cx}" y2="1060" stroke="{OL}" stroke-width="2" opacity=".35"/>
<circle cx="{cx}" cy="{cy}" r="{d / 2 + 40}" fill="none" stroke="{OL}" stroke-width="3"/>
{ticks}
{logo(cx, cy, d)}
{T(60, 150, 26, 'TAGADONA RACING · GARAGE', a='start', c=OL, w=500, ls=6)}
{T(790, 150, 26, '37°16′N · 3°34′O', a='end', c=OL, w=400, ls=4)}
{T(60, 1095, 24, 'COGOLLOS DE LA VEGA', a='start', c=OL, w=400, ls=6)}
{T(790, 1095, 24, 'GRANADA', a='end', c=OL, w=400, ls=6)}
{T(60, 1380, 150, 'COMPRA', a='start', c=OL, w=700)}
{T(60, 1540, 150, 'VENTA', a='start', c=OR, w=700)}
<rect x="60" y="1590" width="730" height="4" fill="{OL}"/>
{T(60, 1660, 40, 'DE MOTOS', a='start', c=OL, w=600, ls=14)}
<rect x="-5" y="1940" width="860" height="165" fill="{OL}"/>"""


# ---------------------------------------------------------------- LONA · ALFOMBRA · TECHO nuevos
def lona4():  # Palabra gigante detrás del sello
    return f"""<rect width="2000" height="1000" fill="{OL}"/>
<clipPath id="l4"><rect width="2000" height="1000"/></clipPath>
<g clip-path="url(#l4)">{T(1000, 870, 740, 'RACING', c=OR, w=700, ls=-8, safe=False)}</g>
<circle cx="1000" cy="520" r="355" fill="{OL}"/>
{logo(1000, 520, 640)}
{T(1000, 170, 40, 'COMPRAVENTA DE MOTOS · GRANADA', w=500, ls=14)}"""


def lona5():  # Carretera al horizonte
    return f"""<rect width="2000" height="1000" fill="{OL}"/>
<clipPath id="l5"><rect width="2000" height="1000"/></clipPath>
<g clip-path="url(#l5)">
{rings(1000, 600, 260, 900, 38, OL3, 4)}
<circle cx="1000" cy="600" r="220" fill="{OR}"/>
{ridge(-10, 2010, 545, 80, 640, 21, OL2, 12)}
{ridge(-10, 2010, 585, 45, 640, 33, OL3, 14)}
<rect x="0" y="598" width="2000" height="402" fill="{OL}"/>
{road(1000, 600, 1000, 520, CR, OR, n=6, k=.7)}
</g>
{logo(380, 420, 470)}
{T(1540, 400, 115, 'Compraventa', f=GERM)}
{T(1540, 520, 115, 'de motos', f=GERM, c=OR)}"""


def mat4():  # Carretera de entrada vista desde arriba, con rotulación alargada como la pintura vial
    dashes = "".join(f'<rect x="512" y="{y}" width="26" height="150" fill="{OR}"/>' for y in range(880, 1520, 240))
    return f"""<rect x="-5" y="-5" width="1060" height="2160" fill="{ASPH}"/>
<rect x="-5" y="-5" width="1060" height="2160" fill="url(#grain3)"/>
<rect x="110" y="-5" width="18" height="2160" fill="{CR}"/><rect x="922" y="-5" width="18" height="2160" fill="{CR}"/>
{dashes}
<circle cx="525" cy="500" r="290" fill="{OL}"/>
{logo(525, 500, 520)}
<g transform="translate(525 1960) scale(1 2.4)">{T(0, 0, 150, 'GARAGE', c=CR, w=600, ls=10, safe=False)}</g>"""


def techo4():  # Rayos de sol detrás del sello
    import math
    cx, cy = 1500, 1100
    rays = "".join(f'<polygon points="{cx},{cy} {cx + 3000 * math.cos(a):.0f},{cy + 3000 * math.sin(a):.0f} {cx + 3000 * math.cos(a + math.pi / 24):.0f},{cy + 3000 * math.sin(a + math.pi / 24):.0f}" fill="{OL2}"/>'
                   for a in [i * math.pi / 12 for i in range(24)])
    f = face(f'{rays}<circle cx="{cx}" cy="{cy}" r="560" fill="{OL}"/>{logo(cx, cy, 1000)}<rect x="0" y="1715" width="3000" height="35" fill="{OR}"/>')
    return {s: (f, cen_name()) for s in "FRBL"}


# ---------------------------------------------------------------- páginas
SP = B.SPEC
B.DEFS = B.DEFS.replace("</defs>", '<pattern id="grain3" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="7" cy="9" r="2.2" fill="#fff" opacity=".05"/><circle cx="28" cy="31" r="1.6" fill="#fff" opacity=".04"/><circle cx="31" cy="12" r="1.4" fill="#000" opacity=".3"/><circle cx="16" cy="27" r="1.2" fill="#000" opacity=".25"/></pattern></defs>')
mood = base64.b64encode(Path(sys.argv[1]).read_bytes()).decode() if len(sys.argv) > 1 else ""
ROLLS = [("R4", "Palabra vertical", roll4, "«RACING» en vertical ocupando toda la altura y el sello delante, a la altura de los ojos. Es el gesto más reconocible de los roll-ups de motos en Pinterest (1190RX, RIDE, KAWASAKI)."),
         ("R5", "Carretera al horizonte", roll5, "La carretera lleva la vista desde el suelo hasta el sol y el sello. Las líneas de fuga hacen que se mire hacia arriba. Casi sin texto."),
         ("R6", "Ficha técnica", roll6, "Fondo claro, sello en una mira con marcas finas y «COMPRA / VENTA» enorme. Estilo ficha técnica de moto (Fireblade, Buell). Las coordenadas son las de Cogollos de la Vega.")]
OTHERS = [("lona", "L4", "Palabra detrás del sello", lona4, "«RACING» a toda la anchura, cortado por los bordes, y el sello delante. Lo único escrito además es una línea pequeña arriba."),
          ("lona", "L5", "Carretera al horizonte", lona5, "La misma carretera del R5 en horizontal. Funciona en pareja con ese roll-up."),
          ("mat", "M4", "Carretera de entrada", mat4, "La alfombra es una carretera vista desde arriba que te mete en la tienda. «GARAGE» va alargado como la pintura vial, para leerse bien desde la entrada. El sello está al fondo.")]
pages = [f"""<section class="pg cover"><div class="cv">
<p class="eb">TAGADONA RACING · RONDA 3 · INSPIRACIÓN PINTEREST</p>
<h1>Roll-up y variantes</h1>
<p class="lead">Lo que más se repite en los roll-ups y carteles de motos que funcionan: una palabra gigante detrás, líneas de fuga, estilo de ficha técnica y mucho espacio vacío. Con eso hay tres roll-ups nuevos y una variante nueva de lona, alfombra y techo. Las propuestas de la ronda 2 siguen siendo válidas para mezclar.</p>
</div></section>""",
         f"""<section class="pg"><header><span class="id">REF</span><h2>Panel de referencias (Pinterest, uso interno)</h2></header>
<div class="stage"><img src="data:image/png;base64,{mood}" style="max-width:100%;max-height:100%;display:block"></div>
<footer>Patrones tomados: palabra gigante detrás del producto, texto vertical a lo alto, carretera o franja como línea de fuga, ficha técnica con microtexto, curvas de nivel y mucho vacío, rayos de sol de garaje vintage. Solo como inspiración; no se copia ninguna pieza.</footer></section>"""]
cmp_ = "".join(f'<figure>{B.art("roll", fn)}<figcaption><b>{pid}</b> {t}</figcaption></figure>' for pid, t, fn, _ in ROLLS)
pages.append(B.page(f'<div class="cmp roll">{cmp_}</div>', "Roll-up · comparativa ronda 3", SP["roll"]["name"], "ROLL-UP"))
for pid, t, fn, why in ROLLS:
    pages.append(B.page(f'<div class="one roll">{B.art("roll", fn)}</div>', t, f'{why} <span class="spec">{SP["roll"]["name"]}</span>', pid))
for kind, pid, t, fn, why in OTHERS:
    pages.append(B.page(f'<div class="one {kind}">{B.art(kind, fn)}</div>', t, f'{why} <span class="spec">{SP[kind]["name"]}</span>', pid))
pages.append(B.page(f'<div class="one techo">{B.techo_net(techo4)}</div>', "Rayos de garaje",
                    'Tu techo favorito (sello en el centro y cenefa crema) con rayos de sol oliva sobre oliva detrás del sello, como en los carteles de garaje vintage. Gana presencia sin añadir texto. <span class="spec">Maqueta: caras de ~3.000 × 1.750 mm y cenefas de 3.000 × 250 mm. El troquel real sale de la plantilla del fabricante.</span>', "T4"))
html = B.html.split("<body>")[0] + f'<body><svg width="0" height="0" style="position:absolute">{B.DEFS}</svg>{"".join(pages)}</body></html>'
html = html.replace("Propuestas planas · Ronda 2", "Ronda 3")
(HERE / "presentacion3.html").write_text(html)
print("presentacion3.html", len(html) // 1024, "KB,", len(pages), "páginas")
