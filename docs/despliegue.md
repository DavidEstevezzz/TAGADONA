# Checklist de despliegue y Search Console

Guía para el propietario tras aplicar los cambios de SEO, rendimiento y
conversión. Sigue el orden.

## 1. Antes de desplegar (en local)

```bash
npm install
npm run audit      # valida datos + build + enlaces internos
npm run preview    # sirve dist/ en local para revisarlo
```

`npm run audit` debe terminar sin errores. Detecta, como mínimo: una imagen
que no existe, un slug duplicado, una moto sin foto, un estado inválido, un
enlace interno roto y errores de compilación de Astro.

Revisa a ojo en `npm run preview`:

- [ ] **Home**: carga, hero nítido, últimas incorporaciones, CTA "Vender mi moto".
- [ ] **Catálogo** (`/catalogo/`): rejilla, filtros por tipo/carnet/precio, vendidas.
- [ ] **Landing general** (`/motos-segunda-mano-granada/`).
- [ ] **Vender moto** (`/vender-moto-granada/`): documentación agrupada, WhatsApp de tasación.
- [ ] **Contacto**: teléfono, email, cómo llegar, horario.
- [ ] **Una ficha disponible**: galería, lightbox, botones, "motos parecidas".
- [ ] **Una ficha vendida**: badge "Vendida", "Quiero una parecida", alternativas.
- [ ] **Un artículo del blog**: fecha de publicación/actualización, fuentes, CTA interno.
- [ ] La web se ve bien en móvil (menú, tarjetas, botones).

## 2. Desplegar

- [ ] Subir el sitio (build estático de `dist/`).
- [ ] Confirmar que las nuevas versiones están accesibles (sin caché antigua).

## 3. Comprobaciones en producción

- [ ] `https://tagadonaracing.es/robots.txt` — permite todo salvo `/admin/` y apunta al sitemap.
- [ ] `https://tagadonaracing.es/sitemap-index.xml` — existe y no incluye `/admin/`.
- [ ] Página 404: visita una URL inventada y comprueba que sale la página 404 personalizada.
- [ ] Las imágenes cargan (no hay rotas) y pesan menos que antes.

## 4. Google Search Console

Inspecciona con "Inspección de URLs" estas páginas clave:

- [ ] Home
- [ ] Catálogo (`/catalogo/`)
- [ ] Landing general (`/motos-segunda-mano-granada/`)
- [ ] Vender moto (`/vender-moto-granada/`)
- [ ] Contacto
- [ ] Una ficha disponible
- [ ] Una ficha vendida
- [ ] Un artículo del blog

Para cada una:

- [ ] Comprobar que es indexable y que el **canonical** es el esperado.
- [ ] **Solicitar indexación** solo cuando el cambio sea importante (p. ej. el
      nuevo título del catálogo o de la landing).
- [ ] Revisar **Resultados enriquecidos**: `MotorcycleDealer`, `Product`/`Offer`
      (con `SoldOut` en vendidas), `BreadcrumbList`, `FAQPage`, `Article`.
- [ ] Revisar el informe de **Redirecciones** / cobertura y corregir errores previos.

## 5. Qué NO hacer

- No enviar todas las URLs a indexar cada día.
- No cambiar los títulos continuamente.
- No crear páginas nuevas sin analizar las actuales.
- No eliminar fichas vendidas de forma automática (conservan posicionamiento).
- No bloquear por `robots.txt` páginas que deban transmitir un `noindex`
  (si están bloqueadas, Google no llega a leer la etiqueta).

## 6. Analítica (opcional)

Si se quiere medir conversiones, ver `docs/analitica.md`: la web ya emite
eventos `data-track`; solo falta conectar GA4/GTM y resolver el consentimiento
de cookies.
