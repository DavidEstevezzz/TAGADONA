import { defineCollection, z } from 'astro:content';

// Define qué datos lleva cada entrada del blog (lo de arriba del .md).
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    fecha: z.date(),
    imagen: z.string(),            // nombre del archivo en public/img/blog/
    categoria: z.string().default('Consejos'),
    resumen: z.string(),           // frase corta para la tarjeta del índice
    destacada: z.boolean().default(false),
  }),
});

export const collections = { blog };