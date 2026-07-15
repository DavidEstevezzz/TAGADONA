# Medición de conversiones

La web emite un evento por cada clic en un elemento con `data-track`. El
despachador vive en `src/layouts/Base.astro` (un único listener delegado, no
bloqueante). **No incluye ninguna herramienta de seguimiento por sí solo**:
solo reenvía los eventos a Google Tag Manager (`dataLayer`) o Google Analytics
(`gtag`) **si están presentes** en la página. Si no hay ninguno, no hace nada
y no genera errores.

## Cómo conectar Google Analytics 4 (o GTM)

Añade el snippet oficial en el `<head>` de `src/layouts/Base.astro` (justo
antes de `</head>`). Ejemplo con GA4:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXХ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');
</script>
```

A partir de ahí, los clics con `data-track` llegan solos como eventos.

> **Aviso de cookies:** GA4 y GTM usan cookies/identificadores. Antes de
> activarlos en producción hay que mostrar un banner de consentimiento y
> cargar el script solo tras la aceptación (o usar Consent Mode). Este paso
> queda pendiente de decisión del propietario.

## Eventos que se emiten

Cada evento lleva `cta` (el `data-track`), `source` (`data-source`) y, cuando
aplica, `moto` (`data-moto`, el slug de la ficha).

| `cta`               | Dónde                                            |
|---------------------|--------------------------------------------------|
| `whatsapp_flotante` | Botón flotante de WhatsApp (todas las páginas)   |
| `whatsapp_moto`     | WhatsApp desde una ficha disponible              |
| `whatsapp_tasacion` | WhatsApp de tasación (landing de venta)          |
| `whatsapp_general`  | WhatsApp de contacto / landings                  |
| `quiero_parecida`   | WhatsApp desde una ficha vendida                 |
| `telefono`          | Enlaces `tel:` (footer, contacto, fichas, CTAs)  |
| `email`             | Enlaces `mailto:`                                |
| `como_llegar`       | Enlace a Google Maps                             |
| `ver_catalogo`      | Botones "Ver catálogo"                           |
| `ver_ficha`         | Tarjetas de moto (incluye `moto`)                |
| `vender_moto`       | CTAs "Vender mi moto" (hero, nav, CTA final)     |
| `red_social`        | Instagram / TikTok                               |

Para medir una conversión concreta se puede distinguir por `cta` + `source`
(p. ej. `whatsapp_moto` con `source=ficha` y `moto=honda-sh-125-2019`).
