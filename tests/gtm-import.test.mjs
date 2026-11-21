import test from "node:test";
import assert from "node:assert/strict";
import { prepareGtmImport } from "../scripts/prepare-gtm-conversions.mjs";

function fixture() {
  return {
    exportFormatVersion: 2,
    containerVersion: {
      container: { accountId: "123", containerId: "456", publicId: "GTM-PL9RNV5J" },
      tag: [{
        accountId: "123",
        containerId: "456",
        tagId: "1",
        name: "Google Analytics",
        type: "googtag",
        parameter: [{ type: "TEMPLATE", key: "tagId", value: "G-XZRX950DDQ" }],
      }],
      trigger: [{ accountId: "123", containerId: "456", triggerId: "1", name: "Initialization", type: "INIT" }],
      variable: [],
    },
  };
}

test("se añaden 3 eventos sin modificar la etiqueta GA4 existente", () => {
  const original = fixture();
  const result = prepareGtmImport(original);
  assert.equal(original.containerVersion.tag.length, 1);
  assert.equal(result.containerVersion.tag.length, 4);
  assert.equal(result.containerVersion.trigger.length, 4);
  assert.equal(result.containerVersion.variable.length, 3);
  assert.equal(result.containerVersion.tag[0].name, "Google Analytics");
  const custom = result.containerVersion.tag.slice(1);
  assert.deepEqual(custom.map((tag) => tag.parameter.find((p) => p.key === "eventName")?.value), [
    "contacto_whatsapp", "solicitud_tasacion", "contacto_telefono"
  ]);
  for (const tag of custom) {
    assert.equal(tag.type, "gaawe");
    assert.equal(tag.parameter.find((p) => p.key === "measurementIdOverride")?.value, "G-XZRX950DDQ");
    assert.equal(tag.firingTriggerId.length, 1);
  }
});

test("no permite generar una importación para otra web", () => {
  const data = fixture();
  data.containerVersion.container.publicId = "GTM-OTRO";
  assert.throws(() => prepareGtmImport(data), /debe ser GTM-PL9RNV5J/);
});

test("impide importar dos veces", () => {
  const result = prepareGtmImport(fixture());
  assert.throws(() => prepareGtmImport(result), /No importes dos veces/);
});
