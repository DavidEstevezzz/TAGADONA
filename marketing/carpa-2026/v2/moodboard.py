"""Monta un panel de referencias de Pinterest (uso interno, solo inspiración).
Uso: python3 -I moodboard.py <carpeta-con-json> <salida.png>"""
import json, sys, io, re, urllib.request
from PIL import Image, ImageDraw, ImageFont
src, out = sys.argv[1], sys.argv[2]
PICK = [("moto", 4, "Ficha técnica"), ("moto", 8, "Palabra gigante"), ("moto", 9, "Palabra detrás"),
        ("moto", 14, "Franja diagonal"), ("moto", 17, "Carretera y vertical"), ("minimal", 0, "Forma y vacío"),
        ("minimal", 14, "Curvas de nivel"), ("minimal", 4, "Tipografía vertical"), ("garage", 9, "Garaje vintage"),
        ("garage", 13, "Serigrafía"), ("garage", 16, "Rayos y carretera"), ("garage", 10, "Palabra roja detrás")]
def urls(pre):
    seen, res = set(), []
    for i in json.load(open(f"{src}/{pre}.json")):
        u = re.sub(r"/\d+x/", "/474x/", i["src"])
        if u not in seen and "/75x75" not in u and "/30x30" not in u:
            seen.add(u); res.append(u)
    return res
cache = {p: urls(p) for p in ("moto", "minimal", "garage")}
W, H = 300, 470
board = Image.new("RGB", (6 * W, 2 * (H + 40)), (15, 13, 12))
d = ImageDraw.Draw(board)
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
except OSError:
    font = ImageFont.load_default()
for k, (pre, idx, label) in enumerate(PICK):
    u = cache[pre][idx]
    im = Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=20).read())).convert("RGB")
    im.thumbnail((W - 16, H - 10))
    x, y = (k % 6) * W, (k // 6) * (H + 40)
    board.paste(im, (x + (W - im.width) // 2, y + (H - im.height) // 2))
    d.text((x + 10, y + H + 8), label, fill=(229, 137, 58), font=font)
board.save(out); print(out, board.size)
