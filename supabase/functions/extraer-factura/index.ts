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
- lineas: el detalle de conceptos/artículos facturados, cada uno como {"concepto":"", "base":null}.
  MUY IMPORTANTE: cada fila, línea o artículo del detalle de la factura debe ser un elemento SEPARADO del array. NUNCA juntes ni concatenes varios conceptos en un mismo elemento. Si la factura detalla 4 artículos, el array debe tener 4 elementos, uno por artículo.
  · concepto: la descripción de ESE artículo o servicio (por ejemplo "Neumático 120/70 R17", "Retrovisor izquierdo", "Mano de obra"). No lo mezcles con otros.
  · base: el importe de ESA línea antes de IVA, como número con punto decimal. Si la línea muestra cantidad y precio unitario, usa el importe total de la línea (cantidad × precio unitario). Si en el detalle solo aparece el importe con IVA incluido, pon ese importe. Si no se ve, null.
  Ejemplo de una factura con tres conceptos:
  "lineas":[{"concepto":"Neumático 120/70 R17","base":75.00},{"concepto":"Retrovisor izquierdo","base":18.50},{"concepto":"Mano de obra","base":30.00}]
  Devuelve [] SOLO si el documento no tiene un detalle de líneas distinguible.
- base: base imponible total como número con punto decimal (suele coincidir con la suma de las bases de las líneas). Si no se ve, null.
- iva_pct: porcentaje de IVA como número entero (por ejemplo 21). Si no se ve, null.
- total: importe total como número con punto decimal. Si no se ve, null.
No incluyas símbolos de moneda ni separadores de miles.`;

// Esquema que FUERZA la estructura de la respuesta de Gemini: garantiza que
// `lineas` sea siempre un array de objetos {concepto, base}, de modo que cada
// concepto de la factura llegue como una fila independiente (y no todo en una).
const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    fecha: { type: "STRING" },
    proveedor_nombre: { type: "STRING" },
    proveedor_nif: { type: "STRING" },
    lineas: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          concepto: { type: "STRING" },
          base: { type: "NUMBER", nullable: true },
        },
        required: ["concepto", "base"],
        propertyOrdering: ["concepto", "base"],
      },
    },
    base: { type: "NUMBER", nullable: true },
    iva_pct: { type: "INTEGER", nullable: true },
    total: { type: "NUMBER", nullable: true },
  },
  required: ["fecha", "proveedor_nombre", "proveedor_nif", "lineas", "base", "iva_pct", "total"],
  propertyOrdering: ["fecha", "proveedor_nombre", "proveedor_nif", "lineas", "base", "iva_pct", "total"],
};

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
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
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
