// Nombres de eventos que se configuran en GTM/GA4.
// Cada clic comercial pertenece a UNA categoría, no a varias.
const whatsapp = new Set([
  "whatsapp_flotante",
  "whatsapp_moto",
  "whatsapp_general",
  "quiero_parecida",
]);

export function conversionEventForCta(cta) {
  if (cta === "whatsapp_tasacion") return "solicitud_tasacion";
  if (cta === "telefono") return "contacto_telefono";
  if (whatsapp.has(cta)) return "contacto_whatsapp";
  return null;
}

// No se envían números de teléfono, mensajes de WhatsApp, emails ni PII.
// 'moto' es un slug público, nunca un identificador personal.
export function trackingEventsForClick({ cta, source = null, moto = null }) {
  if (!cta) return [];
  const common = { cta, source: source || null, moto: moto || null };
  const conversion = conversionEventForCta(cta);
  return [
    { event: "cta_click", ...common },
    ...(conversion ? [{ event: conversion, ...common }] : []),
  ];
}
