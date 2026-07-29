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
  //  Aparecen solo en /motos-para-reparar-granada/, con el aviso
  //  de venta sin garantía y la lista de desperfectos.
  //
  //  ⚠ PENDIENTE ANTES DE PUBLICAR EN PRODUCCIÓN:
  //    1. Los PRECIOS son provisionales (marcados abajo).
  //    2. Las FOTOS son marcadores de posición: sobrescribe los
  //       archivos de public/img/ con las reales, con el MISMO
  //       nombre, y ya está.
  //    3. Confirmar la potencia y los datos marcados con "?".
  // ══════════════════════════════════════════════════════════

  {
    slug: "piaggio-beverly-125-2017",
    marca: "Piaggio",
    modelo: "Beverly 125",
    categoria: "Scooter · Proyecto",
    anio: 2017,
    km: 44878,
    precio: 1100,                    // ⚠ PRECIO PROVISIONAL — cambiar por el real
    estado: "Disponible",
    destacada: false,
    seccion: "reparacion",
    fotos: [
      "piaggio-beverly-125-2017-1.jpg",
      "piaggio-beverly-125-2017-2.jpg",
      "piaggio-beverly-125-2017-3.jpg",
      "piaggio-beverly-125-2017-4.jpg",
      "piaggio-beverly-125-2017-5.jpg",
    ],
    cilindrada: "125 cc",
    potencia: "11 CV",               // ⚠ confirmar
    combustible: "Gasolina",
    carnet: "A1 / B + 3 años",
    imperfecciones: [
      "Cuerpo de mariposa averiado: necesita reparación o sustitución",
    ],
    especificaciones: {
      "Motor": "Monocilíndrico · 4 tiempos",
      "Cambio": "Automático CVT",
      "ITV": "En vigor",
      "Estado general": "Para reparar",
      "Ubicación": "Granada",
      // Añade aquí "Arranca y rueda": "Sí" / "No · se entrega parada"
    },
    descripcion: [
      "Piaggio Beverly 125 del año 2017 con 44.878 km, una scooter de rueda alta muy cómoda para el día a día que se vende como proyecto: necesita reparar el cuerpo de mariposa.",
      "El resto de la moto es una Beverly de las de siempre —rueda grande, buena postura de conducción y espacio de sobra—, con la ITV en vigor. Es una avería concreta y localizada, no un problema de motor.",
      "Se vende tal cual, con esa reparación por delante y sin garantía, a un precio muy por debajo del de una Beverly lista para circular. Buena opción para quien pueda resolver la mariposa por su cuenta.",
    ],
  },

  {
    slug: "piaggio-beverly-400-2007",
    marca: "Piaggio",
    modelo: "Beverly 400 ie",
    categoria: "Scooter · Proyecto",
    anio: 2007,
    km: 46172,
    precio: 950,                     // ⚠ PRECIO PROVISIONAL — cambiar por el real
    estado: "Disponible",
    destacada: false,
    seccion: "reparacion",
    fotos: [
      "piaggio-beverly-400-2007-1.jpg",
      "piaggio-beverly-400-2007-2.jpg",
      "piaggio-beverly-400-2007-3.jpg",
      "piaggio-beverly-400-2007-4.jpg",
      "piaggio-beverly-400-2007-5.jpg",
    ],
    cilindrada: "400 cc",
    potencia: "34 CV",               // ⚠ confirmar
    combustible: "Gasolina",
    carnet: "A2 / A",
    imperfecciones: [
      "Pérdida de aceite por la tapa de balancines",
      "Plásticos y carenados en estado regular, con roces y marcas de uso",
    ],
    especificaciones: {
      "Motor": "Monocilíndrico · 4 tiempos",
      "Cambio": "Automático CVT",
      "Arranca y rueda": "Sí · en funcionamiento",
      "ITV": "En vigor",
      "Estado general": "Para reparar",
      "Ubicación": "Granada",
    },
    descripcion: [
      "Piaggio Beverly 400 ie del año 2007 con 46.172 km. Está en funcionamiento y con la ITV en vigor, pero pierde aceite por la tapa de balancines, así que se vende como proyecto.",
      "La estética acompaña a los años que tiene: los plásticos están regular, con roces y marcas de uso. Nada de eso afecta a cómo se mueve, pero conviene saberlo antes de venir a verla.",
      "Un maxiscooter de rueda alta con mucho fondo por poco dinero, para quien se maneje con una junta de tapa de balancines y quiera dejarlo fino. Se vende tal cual y sin garantía.",
    ],
  },

  {
    slug: "kymco-people-s-250-2008",
    marca: "Kymco",
    modelo: "People S 250",
    categoria: "Scooter · Proyecto",
    anio: 2008,
    km: 22700,
    precio: 800,                     // ⚠ PRECIO PROVISIONAL — cambiar por el real
    estado: "Disponible",
    destacada: false,
    seccion: "reparacion",
    fotos: [
      "kymco-people-s-250-2008-1.jpg",
      "kymco-people-s-250-2008-2.jpg",
      "kymco-people-s-250-2008-3.jpg",
      "kymco-people-s-250-2008-4.jpg",
      "kymco-people-s-250-2008-5.jpg",
    ],
    cilindrada: "250 cc",
    potencia: "21 CV",               // ⚠ confirmar
    combustible: "Gasolina",
    carnet: "A2 / A",
    imperfecciones: [
      "Pendiente la revisión de los 20.000 km: correa de transmisión sin hacer",
    ],
    especificaciones: {
      "Motor": "Monocilíndrico · 4 tiempos",
      "Cambio": "Automático CVT",
      "Estado general": "Para reparar",
      "Ubicación": "Granada",
      // Añade aquí "Arranca y rueda" y el estado de la ITV
    },
    descripcion: [
      "Kymco People S 250 del año 2008 con solo 22.700 km, muy pocos para su edad. Se vende como proyecto porque le falta la revisión de los 20.000 km: la correa de transmisión está sin hacer y toca cambiarla.",
      "La People S es una scooter de rueda alta ligera y muy manejable, con una mecánica sencilla y conocida, de las que se dejan trabajar sin complicaciones.",
      "Se vende tal cual, con esa revisión pendiente y sin garantía. Para quien sepa hacerse el conjunto de la transmisión, es mucha moto por muy poco.",
    ],
  },

  // ── Plantilla para añadir otra moto para reparar ────────────
  //  Copia el bloque de abajo, quita las barras /* */ y rellena.
  /*
  {
    slug: "marca-modelo-anio-para-reparar",   // parte de la URL: minúsculas y guiones
    marca: "Honda",
    modelo: "CBF 125",
    categoria: "Naked · Proyecto",            // "Scooter · Proyecto", "Trail · Proyecto"…
    anio: 2012,
    km: 48200,
    precio: 750,
    estado: "Disponible",                     // "Disponible" | "Reservada" | "Vendida"
    destacada: false,
    seccion: "reparacion",                    // ← la manda a /motos-para-reparar-granada/
    fotos: [
      "honda-cbf-125-2012-1.jpg",             // van en public/img/ ; la 1ª es la principal
      "honda-cbf-125-2012-2.jpg",
    ],
    cilindrada: "125 cc",
    potencia: "11 CV",
    combustible: "Gasolina",
    carnet: "A1 / B + 3 años",
    // Lo que hay que arreglar. Obligatorio: al menos uno.
    // Sé concreto: es lo que hace honesto el anuncio y evita sorpresas.
    imperfecciones: [
      "Arranca y rueda, pero le cuesta arrancar en frío",
      "Carenado lateral derecho rayado",
      "Neumático trasero al límite del dibujo",
    ],
    especificaciones: {
      "Motor": "Monocilíndrico · 4 tiempos",
      "Cambio": "Manual · 5 velocidades",
      "Arranca y rueda": "Sí",                // o "No · se entrega parada"
      "Documentación": "En regla · ITV caducada",
      "Estado general": "Para reparar",
      "Ubicación": "Granada",
    },
    descripcion: [
      "Primer párrafo: qué moto es, año, kilómetros y por qué se vende como proyecto.",
      "Segundo párrafo: el detalle de lo que falla y de lo que está bien.",
      "Tercer párrafo: se vende tal cual, sin garantía, y a quién le puede encajar.",
    ],
  },
  */
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
