# Conversiones de Tagadona Racing en Google Analytics 4

Esta integración mide **clics que indican intención de contacto**, no ventas ni mensajes efectivamente enviados. La web utiliza un único contenedor de GTM (`GTM-PL9RNV5J`) y un único flujo de GA4 (`G-XZRX950DDQ`). No añadas otro snippet de Analytics al sitio.

## Eventos que emite la web

| Evento GA4 | Se dispara al hacer clic en… | Qué significa |
|---|---|---|
| `contacto_whatsapp` | WhatsApp flotante, contacto general, preguntar por una moto, pedir una moto parecida | Clic para abrir un chat; **no** confirma mensaje enviado |
| `solicitud_tasacion` | «Pedir tasación por WhatsApp» en la página de venta | Clic para iniciar tasación; **no** confirma solicitud recibida |
| `contacto_telefono` | Enlaces para llamar (`tel:`) | Clic de llamada; **no** confirma llamada atendida |

Para cada clic, se mantiene el evento genérico `cta_click` existente. Los tres eventos comerciales son **mutuamente excluyentes**, de modo que una tasación no suma a la vez un contacto de WhatsApp. El resto de botones no genera conversiones.

Parámetros de cada evento comercial:
- `cta`: identificador del botón.
- `cta_source`: sección de la web (en el `dataLayer` se llama `source`).
- `moto`: slug de la moto cuando procede.

Estos parámetros no contienen teléfono del comprador ni el texto del mensaje de WhatsApp.

## Configurar los tres eventos de una vez en GTM

**No puede publicarse un cambio de Google Tag Manager fusionando una PR de GitHub.** GTM mantiene su propia configuración. Para no crear tres etiquetas a mano, la PR incorpora un generador que trabaja sobre una exportación real de tu contenedor y conserva la etiqueta de Analytics que ya configuraste.

1. Entra en [Google Tag Manager](https://tagmanager.google.com/) → contenedor **tagadonaracing.es** (`GTM-PL9RNV5J`).
2. Ve a **Administrador → Exportar contenedor** y descarga el JSON de la versión actual publicada. Guarda una copia de seguridad de este archivo.
3. Desde la raíz del repositorio Tagadona (una vez incorporada la PR), ejecuta:

   ```bash
   node scripts/prepare-gtm-conversions.mjs ./exportacion-gtm.json ./importacion-gtm.json
   ```

4. En GTM abre **Administrador → Importar contenedor** y selecciona `importacion-gtm.json`, **espacio de trabajo actual**, **Combinar (Merge)** y **Sobrescribir elementos en conflicto**, no «Reemplazar contenedor». Revisa la vista previa de cambios: deben añadirse **3 etiquetas GA4**, **3 activadores de evento personalizado** y **3 variables de capa de datos**. La etiqueta actual «Google Analytics» debe seguir presente.
5. Pulsa **Confirmar**, pero **no publiques todavía**.

La configuración resultante utiliza tres activadores `CUSTOM_EVENT` cuyos nombres son idénticos a los tres eventos, y tres etiquetas `GA4 Event` con identificador `G-XZRX950DDQ`. Las variables `cta`, `source` y `moto` se recuperan de `dataLayer`. No hace falta otra etiqueta de configuración de GA4.

## Verificación antes de publicar

1. Fusiona/despliega la PR de la web.
2. Abre **Vista previa** en GTM y conecta `https://tagadonaracing.es/` con bloqueadores de anuncios desactivados y cookies de analítica aceptadas.
3. Haz una prueba con cada acción: WhatsApp de una ficha, WhatsApp de tasación y enlace «Llamar».
4. Comprueba que cada acción crea una entrada `cta_click` y **solo una** de las tres entradas comerciales. En Tag Assistant, verifica que se activa **solo su etiqueta GA4** y que no hay errores.
5. En GA4 → **Administrar → DebugView** verifica los tres nombres. Si funcionan, publica los cambios del contenedor con **Enviar → Publicar**.
6. En GA4 → **Administrar → Eventos / Eventos clave** marca los tres eventos como **eventos clave** cuando aparezcan (la ubicación de la opción puede variar según la interfaz). Opcionalmente, crea dimensiones personalizadas de ámbito Evento para `cta`, `cta_source` y `moto`.

En GA4 deben considerarse **acciones de intención**, no ventas cerradas. El seguimiento de las conversaciones recibidas y de las ventas reales requeriría otra fuente de datos.

## Privacidad y mantenimiento

- No se cargan GTM ni GA4 antes del consentimiento de analítica mediante `CookieConsent.astro`.
- Si el usuario rechaza las cookies, no se publica ningún evento comercial a GA4 desde esta implementación.
- No actives un segundo activador «Clic en enlace» para los mismos botones si ya usas estos eventos; provocaría duplicados.
- La herramienta generadora valida el ID del contenedor y el ID de medición. Rechaza un archivo de otro negocio o un archivo que ya contenga estas mismas etiquetas.
- Para automatizar más, en el futuro se pueden medir visitas a fichas, atribución desde ChatGPT y llamadas confirmadas mediante una solución de analítica más completa.

Fuentes de Google:
- https://support.google.com/tagmanager/answer/6106997?hl=es
- https://support.google.com/tagmanager/answer/13034206
- https://developers.google.com/analytics/devguides/collection/ga4/events
