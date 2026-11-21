// Comprueba que el sitio generado describe el mismo stock que src/data/motos.js.
// Uso: npm run build && node scripts/check-inventory-feed.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { motos, motosVenta } from "../src/data/motos.js";
import { business } from "../src/config/business.js";

const read = (...paths) => readFileSync(join("dist", ...paths), "utf8");
const feed = JSON.parse(read("inventario.json"));
const disponibles = motosVenta.filter((m) => m.estado === "Disponible");

assert.equal(feed.version, 1);
assert.equal(feed.negocio, business.nombre);
assert.equal(feed.url, business.dominio);
assert.equal(feed.totalDisponibles, disponibles.length);
assert.equal(feed.motos.length, disponibles.length);

const slugs = (xs) => xs.map((m) => m.slug ?? m.id).sort();
assert.deepEqual(slugs(feed.motos), slugs(disponibles), "El feed debe excluir motos vendidas, reservadas y para reparar");
for (const entrada of feed.motos) {
  const moto = disponibles.find((m) => m.slug === entrada.id);
  assert.ok(moto, `Moto no disponible en el feed: ${entrada.id}`);
  assert.equal(entrada.precio, moto.precio, `Precio incorrecto en ${entrada.id}`);
  assert.equal(entrada.kilometros, moto.km, `Kilometraje incorrecto en ${entrada.id}`);
  assert.equal(entrada.estado, "Disponible");
  assert.equal(entrada.url, new URL(`/motos/${moto.slug}/`, business.dominio).href);
}

function schemas(html) {
  const scripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return scripts.flatMap((match) => {
    const json = JSON.parse(match[1]);
    return json["@graph"] ? json["@graph"] : [json];
  });
}

const listado = schemas(read("catalogo", "index.html")).find((s) => s["@type"] === "ItemList");
assert.ok(listado, "Falta ItemList en /catalogo/");
assert.equal(listado.numberOfItems, disponibles.length);
assert.deepEqual(
  listado.itemListElement.map((e) => e.url).sort(),
  disponibles.map((m) => new URL(`/motos/${m.slug}/`, business.dominio).href).sort(),
  "ItemList no coincide con el stock disponible"
);

const estados = {
  Disponible: "https://schema.org/InStock",
  Reservada: "https://schema.org/OutOfStock",
  Vendida: "https://schema.org/SoldOut",
};
for (const moto of motos) {
  const ficha = schemas(read("motos", moto.slug, "index.html")).find((s) => s["@type"] === "Product");
  assert.ok(ficha, `Falta Product en ${moto.slug}`);
  assert.equal(ficha.offers.availability, estados[moto.estado], `Disponibilidad incorrecta para ${moto.slug}`);
  assert.equal(Number(ficha.offers.price), moto.precio, `Precio JSON-LD incorrecto en ${moto.slug}`);
  assert.equal(ficha.url, new URL(`/motos/${moto.slug}/`, business.dominio).href);
}

console.log(`OK — ${disponibles.length} motos de venta disponibles en el feed/ItemList; ${motos.length} fichas Product coherentes.`);
