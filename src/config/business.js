// ============================================================
//  DATOS DEL NEGOCIO — FUENTE ÚNICA DE VERDAD
// ============================================================
//  Nombre, dirección, teléfono, email, horario, redes… viven
//  AQUÍ y solo aquí. Cualquier página (Base.astro, footer,
//  contacto, landing de venta, schema, mensajes de WhatsApp…)
//  importa estos datos en lugar de escribirlos a mano.
//
//  Si cambia el teléfono, el correo o la dirección, se edita
//  este archivo y se actualiza toda la web de golpe.
//
//  Es un módulo estándar de ES, así que también se puede
//  importar desde los scripts de validación en Node.
// ============================================================

export const business = {
  // --- Identidad ---
  nombre: "Tagadona Racing",
  dominio: "https://tagadonaracing.es",

  // --- Teléfono ---
  // `telefonoVisible` es como se muestra al usuario; `telefonoE164`
  // es el formato internacional (para tel: y schema); `whatsappNumero`
  // es el número sin símbolos que usa wa.me.
  telefonoVisible: "+34 644 904 418",
  telefonoE164: "+34644904418",
  whatsappNumero: "34644904418",

  // --- Email ---
  email: "info@tagadonaracing.es",

  // --- Dirección (NAP) ---
  direccion: "Paraje de Catacena",
  codigoPostal: "18211",
  municipio: "Cogollos de la Vega",
  provincia: "Granada",
  region: "Andalucía",
  pais: "ES",

  // --- Horario ---
  // Franjas para el schema (openingHoursSpecification) y textos legibles.
  horario: [
    { dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], abre: "08:00", cierra: "15:00" },
    { dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], abre: "17:00", cierra: "20:00" },
    { dias: ["Saturday"], abre: "08:00", cierra: "15:00" },
  ],
  horarioTexto: "Lunes a viernes · 8:00 – 15:00 y 17:00 – 20:00",
  horarioSabado: "Sábados · 8:00 – 15:00",

  // --- Atención con cita previa ---
  citaPrevia: true,
  citaPreviaTexto: "Atendemos solo con cita previa",

  // --- Redes sociales ---
  instagram: "https://www.instagram.com/tagadona.racing/",
  instagramHandle: "@tagadona.racing",
  tiktok: "https://www.tiktok.com/@tagadona.racing",
  tiktokHandle: "@tagadona.racing",

  // --- Mapa / reseñas ---
  maps: "https://www.google.es/maps/place/Tagadona+Racing/@37.2886687,-3.5701499,17z/data=!4m6!3m5!1s0xd6e1de92b7b786b:0x6b5fb4e651b619d7!8m2!3d37.2886645!4d-3.567575!16s%2Fg%2F11nqlsydln",
  googleResenas: "https://maps.app.goo.gl/cUE6pDvNbKgW5f9Q9",

  // --- Zona de servicio ---
  zonasAtendidas: ["Granada", "Cogollos de la Vega", "Andalucía"],
  areaServida: "Granada y Andalucía",

  // --- Imágenes de marca ---
  logo: "/img/logo.png",
  imagenSocial: "/img/hero-taller.jpg",
};

// --- Enlaces derivados (para no repetir el prefijo por todos lados) ---
export const tel = `tel:${business.telefonoE164}`;
export const mailto = `mailto:${business.email}`;
export const whatsapp = `https://wa.me/${business.whatsappNumero}`;

// Dirección en una línea, por si se necesita completa.
export const direccionCompleta =
  `${business.direccion}, ${business.codigoPostal} ${business.municipio} (${business.provincia})`;

// Construye un enlace de WhatsApp con un mensaje predefinido ya codificado.
// Uso: waLink("Hola, me interesa la Honda SH 125…")
export function waLink(mensaje) {
  return mensaje ? `${whatsapp}?text=${encodeURIComponent(mensaje)}` : whatsapp;
}
