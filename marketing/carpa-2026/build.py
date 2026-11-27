"""Une las fuentes en un único HTML autocontenido (index.html)."""
from pathlib import Path
src = Path(__file__).parent / "src"
js = "\n".join((src / f).read_text() for f in ["data.js", "designs.js", "scene.js", "app.js"])
html = (src / "page.html").read_text() + f"\n<script>\n{js}\n</script>\n"
(Path(__file__).parent / "index.html").write_text(html)
print("index.html", len(html) // 1024, "KB")
