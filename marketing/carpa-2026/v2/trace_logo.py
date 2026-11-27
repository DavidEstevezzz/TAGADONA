"""Calco vectorial PROVISIONAL del sello (PNG 640 px -> SVG por capas de color).
No sustituye al original vectorial: sirve para ver el sello grande en las propuestas."""
import cv2, numpy as np, sys
from PIL import Image
SRC, OUT, K = sys.argv[1], sys.argv[2], 6  # escala de supermuestreo
im = Image.open(SRC).convert("RGBA")
big = im.resize((im.width * K, im.height * K), Image.LANCZOS)
a = np.array(big).astype(np.float32)
rgb, alpha = a[..., :3], a[..., 3]
pal = {"white": (255, 255, 255), "olive": (0x1f, 0x23, 0x15), "orange": (0xbe, 0x71, 0x21)}
names = list(pal); P = np.array([pal[n] for n in names], np.float32)
d = ((rgb[..., None, :] - P[None, None]) ** 2).sum(-1)
lab = d.argmin(-1)
def paths(mask):
    mask = cv2.GaussianBlur(mask.astype(np.uint8) * 255, (0, 0), K * .55)
    _, mask = cv2.threshold(mask, 127, 255, cv2.THRESH_BINARY)
    cs, _ = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    out = []
    for c in cs:
        if cv2.contourArea(c) < (K * K * 2): continue
        c = cv2.approxPolyDP(c, K * .35, True).reshape(-1, 2) / K
        out.append("M" + "L".join(f"{x:.2f} {y:.2f}" for x, y in c) + "Z")
    return "".join(out)
solid = alpha > 128
layers = [("#ffffff", solid),                       # silueta completa (borde de pegatina)
          ("#1f2315", solid & (lab == 1)),
          ("#D97A28", solid & (lab == 2)),
          ("#ffffff", solid & (lab == 0) & cv2.erode(solid.astype(np.uint8), np.ones((K * 8, K * 8))).astype(bool))]
svg = "".join(f'<path fill="{c}" fill-rule="evenodd" d="{paths(m)}"/>' for c, m in layers)
open(OUT, "w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="61 60 527 529">{svg}</svg>')
print(OUT, len(svg) // 1024, "KB")
