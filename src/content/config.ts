import { defineCollection, z } from 'astro:content';

// Define qué datos lleva cada entrada del blog (lo de arriba del .md).
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    fecha: z.date(),
    actualizado: z.date().optional(),   // fecha de última revisión (si aplica)
    autor: z.string().default('Tagadona Racing'),
    imagen: z.string(),            // nombre del archivo en public/img/blog/
    categoria: z.string().default('Consejos'),
    resumen: z.string(),           // frase corta para la tarjeta del índice
    destacada: z.boolean().default(false),
    // Fuentes consultadas (solo en artículos con cifras, rankings o datos
    // externos). Se muestran al pie y dan autoridad al contenido.
    fuentes: z.array(z.object({ nombre: z.string(), url: z.string().url() })).default([]),
    // Enlazado interno hacia páginas comerciales. Opcionales.
    relatedLanding: z.object({ href: z.string(), label: z.string() }).optional(),
    cta: z.string().optional(),    // texto del bloque de llamada a la acción final
  }),
});

export const collections = { blog };