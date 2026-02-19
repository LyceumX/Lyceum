import { z } from 'zod';

export const bookSummarySchema = z.object({
  title: z.string(),
  author: z.string(),
  year: z.number().optional(),
  movement: z.array(z.string()).optional(),
  genre: z.array(z.string()),
  theme: z.array(z.string()),
  dynamic_tags: z.object({
    category: z.string(),
    origin: z.string()
  }),
  plot_summary: z.string(),
  key_characters: z.array(z.object({
    name: z.string(),
    description: z.string()
  })),
  recommendation_reason: z.string(),
  quotes: z.array(z.string())
});

export type BookSummary = z.infer<typeof bookSummarySchema>;
