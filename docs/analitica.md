# Analítica de Tagadona Racing

## Identificadores

- Contenedor principal de Google Tag Manager: `GTM-PL9RNV5J`.
- Flujo web de Google Analytics 4: `G-XZRX950DDQ`.
- **No instalar también** el snippet alternativo `GTM-NRMMR842` ofrecido por el asistente de Google Analytics: duplicaría o complicaría el seguimiento.

## Instalación en la web

El componente `src/components/CookieConsent.astro` se incluye desde `src/layouts/Base.astro`.
- En la primera visita muestra un aviso de cookies de analítica con **Aceptar** y **Rechazar**.
- Antes de aceptar no se carga ninguna etiqueta de GTM/GA4 desde esta integración (modo de consentimiento básico).
- Tras aceptar, se añade dinámicamente el script `gtm.js?id=GTM-PL9RNV5J`.
- La decisión se guarda en `localStorage` con la clave `tagadona_analytics_consent_v1`. Se puede revisar desde **Configurar cookies** en el pie de página.
- Si el usuario revoca el consentimiento después de que GTM haya cargado, se recarga la página para dejar de ejecutar las etiquetas.
- No se añade `noscript` de GTM de forma incondicional, para no iniciar mediciones sin consentimiento.
- Antes de publicar es necesario revisar la página `/politica-de-cookies/` y el resto de obligaciones de información de protección de datos con los datos legales reales de la empresa.

## Paso manual OBLIGATORIO en Tag Manager

El código web instala el contenedor, pero **por sí solo no conecta GA4**. En https://tagmanager.google.com/:

1. Abre el contenedor **GTM-PL9RNV5J**.
2. Ve a **Etiquetas → Nueva → Configuración de la etiqueta → Etiqueta de Google**.
3. En **ID de etiqueta**, introduce `G-XZRX950DDQ`.
4. En **Activación**, elige **Inicialización — Todas las páginas**.
5. Guarda. Usa **Vista previa** para probar la instalación aceptando cookies en el sitio.
6. Pulsa **Enviar → Publicar** para activar la versión de GTM.
7. Comprueba la propiedad GA4 mediante **Informes → Tiempo real** o **DebugView**.

La etiqueta debe existir una sola vez en ese contenedor. No insertes `gtag.js` de GA4 directamente en el sitio si usas esta configuración.

## Eventos de clic existentes

`src/layouts/Base.astro` emite un evento en `dataLayer` por cada clic en un elemento con `data-track` solo cuando GTM ha sido cargado tras aceptar. Formato:

```js
{
  event: 'cta_click',
  cta: 'whatsapp_moto',
  source: 'ficha',
  moto: 'honda-sh-125-2019'
}
```

Eventos de interés: `whatsapp_flotante`, `whatsapp_moto`, `whatsapp_tasacion`, `whatsapp_general`, `quiero_parecida`, `telefono`, `email`, `como_llegar`, `ver_catalogo`, `ver_ficha`, `vender_moto` y `red_social`.

Para que estos eventos aparezcan en GA4, configura en GTM:
- Un **Activador de evento personalizado** con nombre del evento: `cta_click`.
- Variables de capa de datos, versión 2: `cta`, `source`, `moto`.
- Una **Etiqueta de evento de Google Analytics: GA4** con ID de medición `G-XZRX950DDQ`, nombre de evento `cta_click`, parámetros `cta`, `source`, `moto`, y el activador anterior.
- Publica la versión tras comprobar con Vista previa que aparece **una sola** ocurrencia por clic.

Si quieres consultar `cta`, `source` y `moto` en informes personalizados, regístralos en GA4 como dimensiones personalizadas de ámbito Evento. Para medir contactos, crea un evento derivado o un activador filtrado por `cta` (WhatsApp o teléfono) y márcalo como evento clave. Un clic indica intención de contacto, **no una venta ni una conversación confirmada**.

## Visitas procedentes de ChatGPT

Analiza **Adquisición de tráfico** y el origen/medio de sesión (`chatgpt.com / referral`, por ejemplo). Los enlaces de ChatGPT pueden incluir `utm_source=chatgpt.com`; además conviene comparar el tráfico de referencia y los parámetros de campaña. La procedencia puede no estar disponible en todas las visitas.

## Comprobaciones previas al despliegue

```bash
npm ci
npm run audit
```

Pruebas manuales:
- Rechazar cookies: no se solicita `gtm.js` ni se registran sesiones en GA4 desde esta integración.
- Aceptar cookies: se solicita `gtm.js?id=GTM-PL9RNV5J` una sola vez; GA4 registra al menos una visita cuando la etiqueta está publicada.
- Reabrir preferencias y rechazar: el sitio recarga y ya no se carga GTM.
- Tras aceptar, comprobar en Vista previa de Tag Manager que los clics `cta_click` se registran solo una vez.
- Revisar diseño y comportamiento móvil del banner.
