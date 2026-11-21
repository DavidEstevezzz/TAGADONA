// Añade las tres etiquetas de conversiones a una exportación REAL del contenedor
// actual de GTM. Conserva las etiquetas originales y sus IDs, evita inventar
// accountId/containerId y produce un JSON importable mediante Merge en GTM.
// Uso: node scripts/prepare-gtm-conversions.mjs exportado-gtm.json importacion-gtm.json
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const CONTAINER_ID = "GTM-PL9RNV5J";
const GA4_ID = "G-XZRX950DDQ";
const CONVERSIONS = [
  "contacto_whatsapp",
  "solicitud_tasacion",
  "contacto_telefono",
];

function nextId(items, field) {
  return Math.max(0, ...items.map((it) => Number(it[field]) || 0)) + 1;
}

const param = (key, value, type = "TEMPLATE") => ({ type, key, value });

export function prepareGtmImport(input) {
  const output = structuredClone(input);
  const version = output?.containerVersion;
  if (output.exportFormatVersion !== 2 || !version?.container) {
    throw new Error("Archivo inválido: exporta el contenedor completo desde Administrador → Exportar contenedor.");
  }
  if (version.container.publicId !== CONTAINER_ID) {
    throw new Error(`Este archivo es de ${version.container.publicId}; debe ser ${CONTAINER_ID}.`);
  }
  if (!(version.tag || []).some((tag) => JSON.stringify(tag.parameter || []).includes(GA4_ID))) {
    throw new Error(`El contenedor exportado no contiene la etiqueta de Analytics ${GA4_ID}.`);
  }

  for (const type of ["tag", "trigger", "variable"]) version[type] ??= [];
  const { accountId, containerId } = version.container;
  if (!accountId || !containerId) {
    throw new Error("El archivo exportado no contiene accountId/containerId de GTM.");
  }
  const names = new Set([
    ...version.tag.map((item) => item.name),
    ...version.trigger.map((item) => item.name),
    ...version.variable.map((item) => item.name),
  ]);
  const neededNames = [
    ...["cta", "source", "moto"].map((p) => `Tagadona - DLV ${p}`),
    ...CONVERSIONS.flatMap((event) => [`Tagadona - Activador ${event}`, `Tagadona - GA4 ${event}`]),
  ];
  if (neededNames.some((name) => names.has(name))) {
    throw new Error("Ya existen configuraciones Tagadona de conversión. No importes dos veces.");
  }

  let variableId = nextId(version.variable, "variableId");
  for (const key of ["cta", "source", "moto"]) {
    version.variable.push({
      accountId, containerId,
      variableId: String(variableId++),
      name: `Tagadona - DLV ${key}`,
      type: "v",
      parameter: [
        param("dataLayerVersion", "2", "INTEGER"),
        param("setDefaultValue", "false", "BOOLEAN"),
        param("name", key),
      ],
      formatValue: {},
    });
  }

  let triggerId = nextId(version.trigger, "triggerId");
  let tagId = nextId(version.tag, "tagId");
  for (const eventName of CONVERSIONS) {
    const id = String(triggerId++);
    version.trigger.push({
      accountId, containerId,
      triggerId: id,
      name: `Tagadona - Activador ${eventName}`,
      type: "CUSTOM_EVENT",
      customEventFilter: [{
        type: "EQUALS",
        parameter: [
          param("arg0", "{{_event}}"),
          param("arg1", eventName),
        ],
      }],
    });

    version.tag.push({
      accountId, containerId,
      tagId: String(tagId++),
      name: `Tagadona - GA4 ${eventName}`,
      type: "gaawe",
      parameter: [
        param("sendEcommerceData", "false", "BOOLEAN"),
        param("enhancedUserId", "false", "BOOLEAN"),
        {
          type: "LIST",
          key: "eventSettingsTable",
          list: [
            { parameter: "cta", variable: "cta" },
            { parameter: "cta_source", variable: "source" },
            { parameter: "moto", variable: "moto" },
          ].map(({ parameter, variable }) => ({
            type: "MAP",
            map: [
              param("parameter", parameter),
              param("parameterValue", `{{Tagadona - DLV ${variable}}}`),
            ],
          })),
        },
        param("eventName", eventName),
        param("measurementIdOverride", GA4_ID),
      ],
      firingTriggerId: [id],
      tagFiringOption: "ONCE_PER_EVENT",
      monitoringMetadata: { type: "MAP" },
      // El sitio carga este contenedor solo después de aceptar analítica.
      consentSettings: { consentStatus: "NOT_NEEDED" },
    });
  }

  output.exportTime = new Date().toISOString();
  return output;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const inputFile = process.argv[2];
  const outputFile = process.argv[3] || "gtm-tagadona-conversiones.json";
  if (!inputFile) {
    console.error("Uso: node scripts/prepare-gtm-conversions.mjs exportado-gtm.json importacion-gtm.json");
    process.exit(1);
  }
  const data = JSON.parse(readFileSync(inputFile, "utf8"));
  const generated = prepareGtmImport(data);
  writeFileSync(outputFile, JSON.stringify(generated, null, 2) + "\n", "utf8");
  console.log(`Generado ${outputFile} con 3 etiquetas GA4, 3 activadores y 3 variables. Conserva la configuración existente.`);
}
