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
//
//  Campos obligatorios: slug, marca, modelo, categoria, anio, km,
//  precio, estado, fotos (>=1), cilindrada, potencia, combustible,
//  carnet, descripcion.  Estado válido: "Disponible" | "Reservada" | "Vendida".
//
//  Campos opcionales estructurados (se validan si los usas):
//    orden (número, para forzar el orden), garantiaMeses (número),
//    fechaPublicacion / fechaActualizacion / fechaVenta ("AAAA-MM-DD").
//
//  ── SECCIÓN "PARA REPARAR" ──────────────────────────────────
//  Por defecto una moto pertenece a la venta normal (con garantía
//  y transferencia incluidas). Si la moto se vende TAL CUAL, con
//  desperfectos conocidos y sin garantía, añade:
//
//      seccion: "reparacion",
//      imperfecciones: [
//        "Carenado lateral derecho rayado",
//        "Batería que no mantiene la carga",
//      ],
//
//  Esas motos NO salen en el catálogo general ni en las landings
//  de categoría: van solo a /motos-para-reparar-granada/, con el
//  aviso de venta sin garantía y la lista de desperfectos visible
//  en la tarjeta y en la ficha.
//
//  El campo "imperfecciones" es obligatorio (mínimo 1) cuando
//  seccion vale "reparacion": es lo que hace honesto el anuncio.
//
//  Antes de publicar, ejecuta:  npm run validate:data
//  Comprueba slugs únicos, estados, precios, fotos existentes, etc.
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
      "piaggio-medley-125-2020-1.jpg",
      "piaggio-medley-125-2020-2.jpg",
      "piaggio-medley-125-2020-3.jpg",
      "piaggio-medley-125-2020-4.jpg",
      "piaggio-medley-125-2020-5.jpg",
      "piaggio-medley-125-2020-6.jpg",
      "piaggio-medley-125-2020-7.jpg",
      "piaggio-medley-125-2020-8.jpg",
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
      "yamaha-tricity-300-1.jpg",
      "yamaha-tricity-300-2.jpg",
      "yamaha-tricity-300-3.jpg",
      "yamaha-tricity-300-4.jpg",
      "yamaha-tricity-300-5.jpg",
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
    estado: "Vendida",            // "Disponible" | "Reservada" | "Vendida"
    destacada: true,                 // true = sale primero en el catálogo
    fotos: [
      "yamaha-tmax-530-sx-2017-1.jpg",
      "yamaha-tmax-530-sx-2017-2.jpg",
      "yamaha-tmax-530-sx-2017-3.jpg",
      "yamaha-tmax-530-sx-2017-4.jpg",
      "yamaha-tmax-530-sx-2017-5.jpg",
      "yamaha-tmax-530-sx-2017-6.jpg",
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
    estado: "Vendida",            // "Disponible" | "Reservada" | "Vendida"
    destacada: true,                 // true = sale primero en el catálogo
    fotos: [
      "cfmoto-nk-125-2025-1.jpg",
      "cfmoto-nk-125-2025-2.jpg",
      "cfmoto-nk-125-2025-3.jpg",
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
      "honda-sh-125-2019-1.jpg",
      "honda-sh-125-2019-2.jpg",
      "honda-sh-125-2019-3.jpg",
      "honda-sh-125-2019-4.jpg",
      "honda-sh-125-2019-5.jpg",
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

  // ══════════════════════════════════════════════════════════
  //  MOTOS PARA REPARAR  (seccion: "reparacion")
  // ----------------------------------------------------------
  //  ⚠ EJEMPLOS DE RELLENO: los tres bloques siguientes son
  //  plantillas con fotos de marcador de posición para que la
  //  página se pueda ver funcionando. Sustituye los datos y las
  //  fotos por los reales —o borra los bloques— antes de subir
  //  la web a producción.
  // ══════════════════════════════════════════════════════════

  {
    slug: "honda-cbf-125-2012-para-reparar",
    marca: "Honda",
    modelo: "CBF 125",
    categoria: "Naked · Proyecto",
    anio: 2012,
    km: 48200,
    precio: 750,
    estado: "Disponible",
    destacada: false,
    seccion: "reparacion",           // ← la manda a /motos-para-reparar-granada/
    fotos: [
      "reparar-ejemplo-1.jpg",
    ],
    cilindrada: "125 cc",
    potencia: "11 CV",
    combustible: "Gasolina",
    carnet: "A1 / B + 3 años",
    // Lo que hay que arreglar. Sé concreto: es lo que evita sorpresas.
    imperfecciones: [
      "Arranca y rueda, pero le cuesta arrancar en frío",
      "Carenado lateral derecho rayado y guardabarros con una fisura",
      "Escape original con óxido superficial",
      "Neumático trasero al límite del dibujo",
    ],
    especificaciones: {
      "Motor": "Monocilíndrico · 4 tiempos · Refrigeración por aire",
      "Cambio": "Manual · 5 velocidades",
      "Arranca y rueda": "Sí",
      "Documentación": "En regla · ITV caducada",
      "Estado general": "Para reparar",
      "Ubicación": "Granada",
    },
    descripcion: [
      "Honda CBF 125 de 2012 con 48.200 km que se vende como proyecto: funciona y se mueve, pero necesita mano de mecánica y algo de chapa para dejarla fina.",
      "El motor arranca y rueda, aunque en frío hay que insistir. La estética tiene el desgaste propio de los años: carenado rayado, una fisura en el guardabarros y óxido superficial en el escape. El neumático trasero pide cambio.",
      "Se vende tal cual, con estos desperfectos detallados y sin garantía, a un precio acorde. Ideal para quien quiera una 125 barata y no le importe meterle horas de taller.",
    ],
  },

  {
    slug: "yamaha-aerox-50-2015-para-reparar",
    marca: "Yamaha",
    modelo: "Aerox 50",
    categoria: "Scooter · Proyecto",
    anio: 2015,
    km: 19800,
    precio: 450,
    estado: "Disponible",
    destacada: false,
    seccion: "reparacion",
    fotos: [
      "reparar-ejemplo-2.jpg",
    ],
    cilindrada: "50 cc",
    potencia: "4 CV",
    combustible: "Gasolina",
    carnet: "AM / B",
    imperfecciones: [
      "No arranca: falta de compresión, probable segmentos",
      "Variador con holgura y correa vencida",
      "Carenados con roces y un anclaje partido",
      "Faro delantero con la óptica empañada",
    ],
    especificaciones: {
      "Motor": "Monocilíndrico · 2 tiempos",
      "Cambio": "Automático CVT",
      "Arranca y rueda": "No · se entrega parada",
      "Documentación": "En regla",
      "Estado general": "Para reparar",
      "Ubicación": "Granada",
    },
    descripcion: [
      "Yamaha Aerox 50 de 2015 que se vende parada, como proyecto de mecánica. Tiene falta de compresión, así que lo más probable es que pida segmentos o un pistón nuevo.",
      "El variador tiene holgura y la correa está vencida, así que conviene hacer el conjunto entero. Estéticamente los carenados tienen roces y hay un anclaje partido; la óptica del faro está empañada.",
      "Se entrega tal cual, sin garantía y con todo esto puesto por delante. Una base barata para quien disfrute reconstruyendo una scooter de 50.",
    ],
  },

  {
    slug: "kawasaki-er-6n-2009-para-reparar",
    marca: "Kawasaki",
    modelo: "ER-6n",
    categoria: "Naked · Proyecto",
    anio: 2009,
    km: 62400,
    precio: 1650,
    estado: "Disponible",
    destacada: false,
    seccion: "reparacion",
    fotos: [
      "reparar-ejemplo-3.jpg",
    ],
    cilindrada: "650 cc",
    potencia: "72 CV",
    combustible: "Gasolina",
    carnet: "A2 (limitable) / A",
    imperfecciones: [
      "Caída leve por el lado izquierdo: maneta, estribera y tapa rayadas",
      "Horquilla derecha con sudor de aceite (retenes)",
      "Kit de arrastre al límite, pide cadena y coronas",
      "Testigo de inyección intermitente, pendiente de diagnosticar",
    ],
    especificaciones: {
      "Motor": "Bicilíndrico en paralelo · 4 tiempos · Refrigeración líquida",
      "Cambio": "Manual · 6 velocidades",
      "Arranca y rueda": "Sí",
      "Documentación": "En regla · ITV en vigor",
      "Estado general": "Para reparar",
      "Ubicación": "Granada",
    },
    descripcion: [
      "Kawasaki ER-6n de 2009 con 62.400 km. Arranca, rueda y frena, pero tiene una caída leve por el lado izquierdo y varios puntos que hay que atender antes de darla por lista.",
      "Los retenes de la horquilla derecha sudan aceite, el kit de arrastre está al límite y el testigo de inyección se enciende de forma intermitente, sin que hayamos llegado a diagnosticar la causa.",
      "Se vende tal cual, con todo esto por delante y sin garantía. Una A2 limitable a buen precio para quien se maneje con la llave inglesa.",
    ],
  },
];

// --- Secciones de la web -------------------------------------
// Una moto pertenece a la sección "reparacion" solo si lo dice
// expresamente; el resto son venta normal (revisadas, con
// garantía y transferencia incluidas).
export const esReparacion = (m) => m.seccion === "reparacion";

// Motos de venta normal: catálogo, home y landings de categoría.
export const motosVenta = motos.filter((m) => !esReparacion(m));

// Motos para reparar: solo /motos-para-reparar-granada/.
export const motosReparacion = motos.filter(esReparacion);

// --- Utilidades internas (no necesitas tocar esto) ---
// Inserta puntos de miles a la española: 6900 -> "6.900"
const miles = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const formatPrecio = (n) => miles(n) + " €";
export const formatKm = (n) => miles(n) + " km";
