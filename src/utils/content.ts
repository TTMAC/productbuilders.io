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

/**
 * Filter books by career level
 * @param books - Array of books with level field
 * @param level - Level to filter by (undefined returns all)
 * @returns Filtered array
 */
export function filterByLevel<T extends { data: { level?: string } }>(
  items: T[],
  level: string | undefined
): T[] {
  if (!level) return items;
  return items.filter((item) => item.data.level === level);
}

/**
 * Get related books for a given book
 * Scoring: +3 same discipline, +2 same level, +1 shared tag
 * @param currentBook - The book to find related content for
 * @param allBooks - Pool of all published books
 * @param count - Number of related books to return (default: 3)
 * @returns Array of related books, sorted by relevance
 */
export function getRelatedBooks(
  currentBook: CollectionEntry<'books'>,
  allBooks: CollectionEntry<'books'>[],
  count: number = 3
): CollectionEntry<'books'>[] {
  const candidates = allBooks.filter((b) => b.slug !== currentBook.slug);

  if (candidates.length === 0) return [];

  const scored = candidates.map((candidate) => {
    let score = 0;

    // +3 for same discipline
    if (candidate.data.discipline === currentBook.data.discipline) {
      score += 3;
    }

    // +2 for same level
    if (candidate.data.level === currentBook.data.level) {
      score += 2;
    }

    // +1 for each shared tag
    const currentTags = currentBook.data.tags || [];
    const candidateTags = candidate.data.tags || [];
    for (const tag of candidateTags) {
      if (currentTags.includes(tag)) {
        score += 1;
      }
    }

    return { book: candidate, score };
  });

  // Sort by score descending, break ties by title alphabetically
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.book.data.title.localeCompare(b.book.data.title);
  });

  return scored.slice(0, count).map((s) => s.book);
}

/**
 * Get related articles for a given article
 * Per UX Spec - prioritize cross-discipline content
 * Scoring: +3 shared discipline, +2 cross-discipline bonus, +1 shared tag
 * @param currentArticle - The article to find related content for
 * @param allArticles - Pool of all published articles
 * @param count - Number of related articles to return (default: 3)
 * @returns Array of related articles, sorted by relevance
 */
export function getRelatedArticles(
  currentArticle: CollectionEntry<'articles'>,
  allArticles: CollectionEntry<'articles'>[],
  count: number = 3
): CollectionEntry<'articles'>[] {
  const candidates = allArticles.filter((a) => a.slug !== currentArticle.slug);

  if (candidates.length === 0) return [];

  const scored = candidates.map((candidate) => {
    let score = 0;

    // +3 for each shared discipline
    const currentDisciplines = currentArticle.data.disciplines;
    const candidateDisciplines = candidate.data.disciplines;
    for (const d of candidateDisciplines) {
      if (currentDisciplines.includes(d)) {
        score += 3;
      }
    }

    // +2 bonus if candidate has a discipline NOT in current article (cross-functional bridging)
    for (const d of candidateDisciplines) {
      if (!currentDisciplines.includes(d)) {
        score += 2;
        break;
      }
    }

    // +1 for each shared tag
    const currentTags = currentArticle.data.tags || [];
    const candidateTags = candidate.data.tags || [];
    for (const tag of candidateTags) {
      if (currentTags.includes(tag)) {
        score += 1;
      }
    }

    return { article: candidate, score };
  });

  // Sort by score descending, break ties by publishDate descending
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.article.data.publishDate.getTime() - a.article.data.publishDate.getTime();
  });

  return scored.slice(0, count).map((s) => s.article);
}
