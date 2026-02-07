import type { CollectionEntry } from 'astro:content';

/**
 * Filter items by discipline
 * Handles both articles (disciplines array) and books (single discipline)
 * @param items - Array of articles or books
 * @param discipline - Discipline to filter by (undefined returns all)
 * @returns Filtered array
 */
export function filterByDiscipline<
  T extends { data: { disciplines?: string[]; discipline?: string } }
>(items: T[], discipline: string | undefined): T[] {
  if (!discipline) return items;

  return items.filter((item) => {
    // Handle articles with disciplines array
    if (item.data.disciplines) {
      return item.data.disciplines.includes(discipline);
    }
    // Handle books with single discipline
    return item.data.discipline === discipline;
  });
}

/**
 * Filter out draft items
 * @param items - Array of items with optional draft field
 * @param includeDrafts - Whether to include drafts (default: false)
 * @returns Filtered array
 */
export function filterDrafts<T extends { data: { draft?: boolean } }>(
  items: T[],
  includeDrafts: boolean = false
): T[] {
  if (includeDrafts) return items;
  return items.filter((item) => !item.data.draft);
}

/**
 * Get featured articles
 * @param articles - Array of articles
 * @returns Array of featured articles
 */
export function getFeaturedArticles(
  articles: CollectionEntry<'articles'>[]
): CollectionEntry<'articles'>[] {
  return articles.filter((article) => article.data.featured);
}

/**
 * Get human-readable label for discipline
 * Per DOMAIN_MODEL.md - exact label mapping
 * @param discipline - Discipline code
 * @returns Display label
 */
export function getDisciplineLabel(discipline: string): string {
  const labels: Record<string, string> = {
    PM: 'Product Management',
    Design: 'Design',
    Engineering: 'Engineering',
  };
  return labels[discipline] || discipline;
}

/**
 * Get Tailwind color class name for discipline
 * Per CLAUDE.md - exact color mapping to Tailwind config
 * @param discipline - Discipline code
 * @returns Tailwind color name (e.g., 'pm', 'design', 'engineering')
 */
export function getDisciplineColor(discipline: string): string {
  const colors: Record<string, string> = {
    PM: 'pm',
    Design: 'design',
    Engineering: 'engineering',
  };
  return colors[discipline] || 'gray';
}
