# Lectura de facturas en imagen con IA (Google Gemini)

Las **fotos y escaneos** de facturas se leen ahora con un modelo de visión de
Google (Gemini), mucho más preciso que el OCR del navegador. La clave de Gemini
se guarda como **secreto en Supabase** y nunca llega al navegador: el front
llama a una *Edge Function* (`extraer-factura`) que hace de intermediaria.

> Mientras la función no esté desplegada, todo sigue funcionando: las imágenes
> caen automáticamente al OCR local (Tesseract) y los PDFs se leen en local como
> hasta ahora. No se rompe nada.

Los **PDFs** se siguen leyendo en local (texto directo con pdf.js), que es
gratis y preciso; solo las **imágenes** pasan por Gemini.

---

## 1) Conseguir una clave gratuita de Gemini

1. Entra en **https://aistudio.google.com/apikey** con tu cuenta de Google.
2. Pulsa **Create API key** y copia la clave (empieza por `AIza...`).

El plan gratuito es suficiente para el volumen de facturas de un taller.
**Aviso de privacidad:** en el plan gratuito, Google puede usar los datos
enviados para mejorar sus productos. Si prefieres que no se usen, habría que
pasar a un plan de pago (o a Claude); dímelo y lo adapto.

---

## 2) Instalar el Supabase CLI y enlazar el proyecto

```bash
# Instalar el CLI (macOS con Homebrew; para Windows/Linux ver la doc de Supabase)
brew install supabase/tap/supabase

# Iniciar sesión (abre el navegador)
supabase login

# Enlazar con tu proyecto (el ref está en la URL del panel de Supabase:
#   https://supabase.com/dashboard/project/<REF>)
supabase link --project-ref TU_PROJECT_REF
```

---

## 3) Guardar la clave como secreto

```bash
supabase secrets set GEMINI_API_KEY=AIza...tu_clave...
```

---

## 4) Desplegar la función

El código ya está en el repo, en `supabase/functions/extraer-factura/`.

```bash
supabase functions deploy extraer-factura
```

Cuando termine, ya está: al subir una **foto** de una factura en la pestaña
Gastos, el programa la enviará a Gemini y rellenará fecha, proveedor, NIF/CIF,
base, IVA y total para que los revises antes de guardar.

---

## Comprobar / solucionar problemas

- Ver los logs de la función en tiempo real:
  ```bash
  supabase functions logs extraer-factura
  ```
- Si al subir una imagen ves «IA no disponible, usando lectura local…», es que
  la función aún no está desplegada, la clave no está puesta, o Gemini devolvió
  error. Revisa los logs.
- Si quieres cambiar de modelo o de proveedor (por ejemplo a Claude), solo hay
  que tocar `supabase/functions/extraer-factura/index.ts`.
