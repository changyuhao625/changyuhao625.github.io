import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    category: z.enum(['tech', 'softskill']).default('tech'),
    author: z.string().default("Harry Chang"),
    headerImg: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
