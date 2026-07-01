// Supabase Edge Function: extraer-factura
// Recibe una factura (imagen o PDF) en base64 y usa Google Gemini para
// devolver los campos ya estructurados. La clave de Gemini se guarda como
// secreto en Supabase (GEMINI_API_KEY) y NUNCA llega al navegador.
//
// Despliegue e instrucciones: docs/supabase-edge-ocr.md

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const MODEL = "gemini-2.5-flash-lite"; // vigente, ligero, con visión y apto para el plan gratuito

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PROMPT = `Eres un extractor de datos de facturas españolas. Analiza el documento (una factura RECIBIDA de un proveedor) y devuelve SOLO un JSON válido, sin texto adicional ni markdown, con exactamente esta forma:
{"fecha":"","proveedor_nombre":"","proveedor_nif":"","lineas":[],"base":null,"iva_pct":null,"total":null}
Reglas:
- fecha: fecha de emisión en formato ISO YYYY-MM-DD. Si no se ve, "".
- proveedor_nombre: nombre o razón social de quien EMITE la factura (no el cliente/destinatario). Si no se ve, "".
- proveedor_nif: NIF o CIF del emisor, en mayúsculas y sin espacios. Si no se ve, "".
- lineas: conceptos facturados, cada uno como {"concepto":"", "base":null}. Usa la base/importe antes de IVA cuando sea visible. Si no se distinguen líneas, [].
- base: base imponible como número con punto decimal. Si no se ve, null.
- iva_pct: porcentaje de IVA como número entero (por ejemplo 21). Si no se ve, null.
- total: importe total como número con punto decimal. Si no se ve, null.
No incluyas símbolos de moneda ni separadores de miles.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) throw new Error("Falta el secreto GEMINI_API_KEY");

    const { mimeType, dataBase64 } = await req.json();
    if (!dataBase64) throw new Error("No se recibió ningún archivo");

    const body = {
      contents: [{
        parts: [
          { text: PROMPT },
          { inline_data: { mime_type: mimeType || "image/jpeg", data: dataBase64 } },
        ],
      }],
      generationConfig: { temperature: 0, responseMimeType: "application/json" },
    };

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    if (!resp.ok) {
      const detalle = await resp.text();
      throw new Error(`Gemini respondió ${resp.status}: ${detalle.slice(0, 300)}`);
    }

    const data = await resp.json();
    const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    let campos: Record<string, unknown> = {};
    try {
      campos = JSON.parse(texto);
    } catch {
      const m = texto.match(/\{[\s\S]*\}/);
      if (m) campos = JSON.parse(m[0]);
    }

    return new Response(JSON.stringify(campos), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String((err as Error)?.message || err) }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
