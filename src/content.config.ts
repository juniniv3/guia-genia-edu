import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const modulos = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/modulos' }),
  schema: z.object({
    title: z.string(),
    /** Shorter label for the sidebar and home cards; falls back to `title`. */
    navTitle: z.string().optional(),
    /** Lead paragraph under the title and the page's meta description. */
    description: z.string(),
    /** One-line teaser for the home page cards. */
    summary: z.string(),
    order: z.number().int(),
    section: z.enum(['ruta', 'recursos']),
    readingMinutes: z.number().int().positive(),
    /** Short citations listed under "Fuentes de este módulo". */
    sources: z.array(z.string()).default([]),
  }),
});

export const collections = { modulos };
