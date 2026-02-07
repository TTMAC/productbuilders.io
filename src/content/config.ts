import { defineCollection } from 'astro:content';
import { articleSchema, bookReviewSchema } from '../schemas/content';

// Define collections using schemas from src/schemas/content.ts
// This separation allows schemas to be unit tested without Astro-specific imports
const articles = defineCollection({
  type: 'content',
  schema: articleSchema,
});

const books = defineCollection({
  type: 'content',
  schema: bookReviewSchema,
});

export const collections = { articles, books };
