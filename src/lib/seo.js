// ============================================================
//  SEO — Ayudantes para datos estructurados (JSON-LD)
//  Se usan en las landings para generar BreadcrumbList y FAQPage
//  de forma consistente. Igual que en src/pages/motos/[slug].astro,
//  el resultado se serializa con set:html={JSON.stringify(...)}.
// ============================================================

// Miga de pan. `items` es un array de { name, path }, p. ej.:
//   [{ name: "Inicio", path: "/" }, { name: "Motos 125…", path: "/motos-125-segunda-mano-granada/" }]
// SITE es la URL base del sitio (Astro.site) para construir URLs absolutas.
export function breadcrumbSchema(items, SITE) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: new URL(it.path, SITE).href,
    })),
  };
}

// Página de preguntas frecuentes. `faqs` es un array de { q, a }.
// Deben coincidir con las preguntas visibles de la página (requisito de Google).
export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
