// ============================================================
//  MOTOS — TU ÚNICO ARCHIVO DE TRABAJO
// ============================================================
//  Para AÑADIR una moto: copia un bloque { ... } entero,
//  pégalo dentro de la lista y cambia los datos.
//  Para QUITAR una moto: borra su bloque (o pon estado: "Vendida").
//
//  El "slug" es la parte de la URL: la moto se verá en
//  /motos/yamaha-xsr-700  — usa solo minúsculas y guiones.
//
//  Las fotos van en  public/img/  y aquí pones solo el nombre.
//  La primera foto del array es la principal.
// ============================================================

export const motos = [
  {
    slug: "piaggio-medley-125-2020",
    marca: "Piaggio",
    modelo: "Medley 125",
    categoria: "Scooter · Urbana",
    anio: 2020,
    km: 15463,
    precio: 2200,
    estado: "Disponible",            // "Disponible" | "Reservada" | "Vendida"
    destacada: true,                 // true = sale primero en el catálogo
    fotos: [
      "medley125-1.jpg",
      "medley125-2.png",
      "medley125-3.png",
      "medley125-4.jpg",
      "medley125-5.png",
      "medley125-6.png",
      "medley125-7.jpg",
      "medley125-8.png",
    ],
    // Datos rápidos (los 4 de arriba)
    cilindrada: "125 cc",
    potencia: "14,75 CV",
    combustible: "Gasolina",
    carnet: "A1 / B + 3 años",
    // Ficha técnica completa
    especificaciones: {
      "Motor": "Monocilíndrico · 4 tiempos · Refrigeración líquida",
      "Cambio": "Automático CVT",
      "ABS": "Bosch de doble canal",
      "Propietarios": "Una sola propietaria",
      "Revisión": "Recién hecha",
      "Estado general": "Muy buen estado",
      "Color": "Blanco · tapicería marrón",
      "Garantía": "12 meses",
      "Ubicación": "Granada",
    },
    descripcion: [
      "Piaggio Medley 125 del año 2020 con 15.463 km, en muy buen estado y con una sola propietaria. Una scooter de rueda alta ideal para el día a día, cómoda y práctica, con un plus de estilo gracias a su tapicería y detalles en marrón.",
      "La moto está recién revisada y lista para usar. Monta motor monocilíndrico de 4 tiempos con refrigeración líquida, cambio automático CVT y ABS Bosch de doble canal, un conjunto fiable y muy fácil de conducir.",
      "Se vende por 2.200 €, con cambio de nombre incluido y un año de garantía. Disponible en Granada.",
    ],
  },

  {
    slug: "yamaha-tricity-300",
    marca: "Yamaha",
    modelo: "Tricity 300",
    categoria: "Scooter · Triciclo",
    anio: 2020,
    km: 36395,
    precio: 4250,
    estado: "Vendida",            // "Disponible" | "Reservada" | "Vendida"
    destacada: true,                 // true = sale primero en el catálogo
    fotos: [
      "tricity300-1.jpeg",
      "tricity300-2.jpeg",
      "tricity300-3.jpeg",
      "tricity300-4.jpeg",
      "tricity300-5.jpeg"
    ],
    // Datos rápidos (los 4 de arriba)
    cilindrada: "300 cc",
    potencia: "27,6 CV",
    combustible: "Gasolina",
    carnet: "B",
    // Ficha técnica completa
    especificaciones: {
      "Motor": "Monocilíndrico · 4 tiempos",
      "Cambio": "Automático CVT",
      "Sistema delantero": "Doble rueda delantera",
      "Freno de estacionamiento": "Sí",
      "Bloqueo de dirección": "Sí",
      "Top case": "Original Yamaha",
      "Color": "A consultar",
      "Ubicación": "Granada",
    },
    descripcion: [
      "Yamaha Tricity 300 del año 2020 con 36.395 km, en muy buenas condiciones y con solo dos propietarios. Una opción muy interesante para quien busca algo más que una 125 pero quiere seguir conduciendo con carnet B.",
      "Cuenta con freno de estacionamiento, sistema de bloqueo de dirección para evitar que la moto se vuelque al dejarla parada y top case original de Yamaha, detalles que suman comodidad y practicidad en el uso diario.",
      "Se vende por 4.250 €, con cambio de nombre incluido y 12 meses de garantía. Disponible en Granada.",
    ],
  },
  
  {
    slug: "yamaha-tmax-530-sx-2017",
    marca: "Yamaha",
    modelo: "TMAX 530 SX",
    categoria: "Scooter · Deportivo",
    anio: 2017,
    km: 21700,
    precio: 7900,
    estado: "Disponible",            // "Disponible" | "Reservada" | "Vendida"
    destacada: true,                 // true = sale primero en el catálogo
    fotos: [
      "tmax530-1.png",
      "tmax530-2.png",
      "tmax530-3.png",
      "tmax530-4.png",
      "tmax530-5.png",
      "tmax530-6.png",

    ],
    // Datos rápidos (los 4 de arriba)
    cilindrada: "530 cc",
    potencia: "46 CV",
    combustible: "Gasolina",
    carnet: "A2 / A",
    // Ficha técnica completa
    especificaciones: {
      "Motor": "Bicilíndrico · 4 tiempos",
      "Cambio": "Automático CVT",
      "Revisión": "20.000 km hecha",
      "Mantenimiento": "Correa, aceite y servicio con productos originales",
      "Asiento": "Gel",
      "Llaves": "2",
      "Garantía": "12 meses",
      "Ubicación": "Granada",
    },
    descripcion: [
      "Yamaha TMAX 530 SX del año 2017, con 21.700 km, en muy buen estado general. Se trata de una unidad de mi propiedad, muy cuidada y mantenida como es debido.",
      "Tiene hecha la revisión de los 20.000 km, incluyendo correa, aceite y el mantenimiento correspondiente, todo realizado con productos originales. Además, cuenta con asiento de gel y se entrega con dos llaves.",
      "Se vende por 7.900 €, con cambio de nombre incluido y 12 meses de garantía. Disponible en Granada.",
    ],
  },
  {
    slug: "cfmoto-nk-125-2025",
    marca: "CFMoto",
    modelo: "NK 125",
    categoria: "Naked",
    anio: 2025,
    km: 600,
    precio: 2750,
    estado: "Disponible",            // "Disponible" | "Reservada" | "Vendida"
    destacada: true,                 // true = sale primero en el catálogo
    fotos: [
      "nk125-1.jpeg",
      "nk125-2.jpeg",
      "nk125-3.jpeg",
    ],
    // Datos rápidos (los 4 de arriba)
    cilindrada: "125 cc",
    potencia: "15 CV",
    combustible: "Gasolina",
    carnet: "A1 / B + 3 años",
    // Ficha técnica completa
    especificaciones: {
      "ABS": "Doble canal",
      "Pantalla": "TFT",
      "Conectividad": "Móvil / navegación",
      "Estado": "Prácticamente nueva",
      "Garantía": "Oficial",
      "Ubicación": "Granada",
    },
    descripcion: [
      "CFMoto NK 125 del año 2025 con solo 600 km, una unidad prácticamente nueva y aún sin el rodaje completado. Una naked 125 muy actual, con un diseño moderno y un nivel de equipamiento muy por encima de lo habitual en su categoría.",
      "Cuenta con doble sistema ABS, tanto delante como detrás, además de pantalla TFT con conectividad para el móvil. A través de la aplicación de CFMoto se puede mostrar el navegador directamente en pantalla, algo especialmente útil para el uso diario.",
      "Se vende por 2.750 €, con cambio de nombre incluido y garantía oficial. Disponible en Granada.",
    ],
  },

  {
    slug: "honda-sh-125-2019",
    marca: "Honda",
    modelo: "SH 125",
    categoria: "Scooter · Urbana",
    anio: 2019,
    km: 35500,
    precio: 2499,
    estado: "Disponible",            // "Disponible" | "Reservada" | "Vendida"
    destacada: true,
    fotos: [
      "honda-sh-1.png",
      "honda-sh-2.png",
      "honda-sh-3.png",
      "honda-sh-4.png",
      "honda-sh-5.png",
    ],
    // Datos rápidos
    cilindrada: "125 cc",
    potencia: "13 CV",
    combustible: "Gasolina",
    carnet: "A1 / B + 3 años",
    // Ficha técnica completa
    especificaciones: {
      "Motor": "Monocilíndrico · 4 tiempos",
      "Cambio": "Automático CVT",
      "Revisión": "Hecha",
      "Mantenimiento": "Con componentes originales de Honda",
      "Estado general": "Muy buen estado",
      "Color": "A consultar",
      "Ubicación": "Granada",
    },
    descripcion: [
      "Honda SH 125 del año 2019 con 35.500 km, una scooter muy práctica para el día a día, cómoda, ágil y perfecta para moverse por ciudad.",
      "La moto se entrega revisada y con todo original de Honda, algo que siempre suma a la hora de valorar una unidad bien cuidada y mantenida.",
      "Una opción muy interesante para quien busque una scooter fiable, bien mantenida y lista para usar. Disponible por 2.499 € en Granada.",
    ],
  },
];

// --- Utilidades internas (no necesitas tocar esto) ---
// Inserta puntos de miles a la española: 6900 -> "6.900"
const miles = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const formatPrecio = (n) => miles(n) + " €";
export const formatKm = (n) => miles(n) + " km";
