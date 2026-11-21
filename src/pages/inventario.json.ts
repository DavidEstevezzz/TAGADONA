// Feed público legible por máquinas del inventario disponible.
// Se genera en el build estático de Astro a partir del mismo archivo que usa
// el catálogo. No es un feed oficial de OpenAI ni permite actualizaciones
// en tiempo real: hay que desplegar de nuevo tras modificar el stock.
import { motosVenta } from "../data/motos.js";
import { business } from "../config/business.js";

export function GET() {
  const motos = motosVenta
    .filter((m) => m.estado === "Disponible")
    .map((m) => ({
      id: m.slug,
      nombre: `${m.marca} ${m.modelo} ${m.anio}`,
      marca: m.marca,
      modelo: m.modelo,
      anio: m.anio,
      kilometros: m.km,
      precio: m.precio,
      moneda: "EUR",
      estado: m.estado,
      categoria: m.categoria,
      carnet: m.carnet,
      cilindrada: m.cilindrada,
      url: new URL(`/motos/${m.slug}/`, business.dominio).href,
      imagen: new URL(`/img/${m.fotos[0]}`, business.dominio).href,
    }));

  const body = {
    version: 1,
    negocio: business.nombre,
    url: business.dominio,
    generadoEn: new Date().toISOString(),
    totalDisponibles: motos.length,
    motos,
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
