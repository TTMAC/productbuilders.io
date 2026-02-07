import { z } from 'zod';

// Per DOMAIN_MODEL.md - Article uses disciplines ARRAY (multiple disciplines)
// Per CLAUDE.md - Must follow exact validation rules for SEO and content quality
export const articleSchema = z.object({
  title: z.string().max(60, 'Title must be ≤60 chars for SEO'),
  description: z.string().max(155, 'Description must be ≤155 chars for SEO'),
  author: z.string().default('Tshepo Machele'),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  disciplines: z
    .array(z.enum(['PM', 'Design', 'Engineering']))
    .min(1, 'Must have ≥1 discipline'),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  heroImage: z.string().optional(),
  heroImageAlt: z.string().optional(),
});

// Per DOMAIN_MODEL.md - BookReview uses single discipline + level
// Per CLAUDE.md - Books must be at least 5 years old to ensure lasting value
export const bookReviewSchema = z.object({
  title: z.string(),
  bookAuthor: z.string(),
  discipline: z.enum(['PM', 'Design', 'Engineering']),
  level: z.enum(['Junior', 'Mid-Level', 'Senior']),
  rating: z.number().int().min(1).max(5),
  publicationYear: z
    .number()
    .int()
    .max(new Date().getFullYear() - 5, 'Book must be ≥5 years old for lasting value'),
  tags: z.array(z.string()).default([]),
  crossFunctionalValue: z.string().min(1, 'Must explain value to other disciplines'),
  keyTakeaways: z
    .array(z.string())
    .min(3, 'Must have ≥3 key takeaways')
    .max(5, 'Must have ≤5 key takeaways'),
  whoShouldRead: z.string(),
  affiliateLink: z.string().url().optional(),
  draft: z.boolean().default(false),
});

// Type exports for TypeScript inference
export type Article = z.infer<typeof articleSchema>;
export type BookReview = z.infer<typeof bookReviewSchema>;
