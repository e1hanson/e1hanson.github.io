import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { STAGE_IDS, TRACK_IDS, stageBelongsTo } from './data/stages';

// Пустая строка в ссылке равна её отсутствию — так удобнее заполнять шаблон записи.
const optionalUrl = z.union([z.url(), z.literal('')]).optional();

const projects = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        summary: z.string(),
        track: z.enum(TRACK_IDS),
        stage: z.enum(STAGE_IDS),
        started: z.coerce.date(),
        updated: z.coerce.date(),
        cover: image().optional(),
        tags: z.array(z.string()).default([]),
        stack: z.array(z.string()).default([]),
        links: z.object({ demo: optionalUrl, repo: optionalUrl }).default({}),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        timeline: z
          .array(
            z.object({
              stage: z.enum(STAGE_IDS),
              date: z.coerce.date(),
              note: z.string(),
              images: z.array(image()).default([]),
            }),
          )
          .default([]),
      })
      .refine((data) => stageBelongsTo(data.track, data.stage), {
        message: 'Стадия `stage` не входит в дорожку `track` (см. docs/PUBLISHING.md)',
        path: ['stage'],
      })
      .refine((data) => data.timeline.every((item) => stageBelongsTo(data.track, item.stage)), {
        message: 'В `timeline` есть стадия не из дорожки `track` (см. docs/PUBLISHING.md)',
        path: ['timeline'],
      }),
});

export const collections = { projects };
