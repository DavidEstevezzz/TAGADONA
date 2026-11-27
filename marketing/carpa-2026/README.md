# Carpa Tagadona Racing · propuestas preliminares

Lona trasera, roll-up, alfombra y techo de carpa: 3 propuestas por pieza, 4 composiciones
con maqueta 3D a escala, reutilización en tienda, matriz de combinaciones y recomendación.

- `index.html`: página autocontenida (se abre en el navegador sin servidor).
- `src/designs.js`: gráficas en mm reales (1 unidad = 1 mm). Fuente única para vistas planas y maquetas.
- `src/scene.js`: maquetas 3D (CSS `matrix3d`).
- `src/app.js`, `src/page.html`: montaje de la página y textos.
- `src/data.js`: logo provisional (PNG 640 px, en base64) y QR de prueba.
- `python3 build.py` regenera `index.html`.

Estado: fase de comparación. Logo provisional (falta el vectorial), techo en maqueta (falta la
plantilla del fabricante), RGB en pantalla (arte final en CMYK Coated FOGRA39).
