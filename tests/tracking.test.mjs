import test from "node:test";
import assert from "node:assert/strict";
import { conversionEventForCta, trackingEventsForClick } from "../src/lib/tracking.js";

test("todos los enlaces de WhatsApp normales son contactos", () => {
  for (const cta of ["whatsapp_flotante", "whatsapp_moto", "whatsapp_general", "quiero_parecida"]) {
    assert.equal(conversionEventForCta(cta), "contacto_whatsapp");
  }
});

test("tasación y llamada se registran por separado", () => {
  assert.equal(conversionEventForCta("whatsapp_tasacion"), "solicitud_tasacion");
  assert.equal(conversionEventForCta("telefono"), "contacto_telefono");
});

test("navegar por el catálogo no genera una conversión", () => {
  for (const cta of ["ver_catalogo", "ver_ficha", "vender_moto", "red_social", "email", "como_llegar"]) {
    assert.equal(conversionEventForCta(cta), null);
    assert.equal(trackingEventsForClick({ cta }).length, 1);
  }
});

test("cada clic comercial emite exactamente una conversión, además del cta_click genérico", () => {
  const types = ["whatsapp_flotante", "whatsapp_moto", "whatsapp_general", "quiero_parecida", "whatsapp_tasacion", "telefono"];
  for (const cta of types) {
    const events = trackingEventsForClick({ cta, source: "ficha", moto: "honda-sh-125-2019" });
    assert.deepEqual(events.map(({ event }) => event), ["cta_click", conversionEventForCta(cta)]);
    assert.equal(events[1].source, "ficha");
    assert.equal(events[1].moto, "honda-sh-125-2019");
  }
});

test("un clic sin tracking no emite nada", () => {
  assert.deepEqual(trackingEventsForClick({}), []);
});
