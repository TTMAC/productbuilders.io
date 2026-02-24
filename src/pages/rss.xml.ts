import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { filterDrafts } from '@/utils/content';
import type { APIContext } from 'astro';

/**
 * Parse date from book slug (format: YYYY-MM-DD-title)
 */
function parseDateFromSlug(slug: string): Date {
  const match = slug.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) return new Date(match[1]);
  return new Date();
}

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');
  const books = await getCollection('books');
  const publishedArticles = filterDrafts(articles);
  const publishedBooks = filterDrafts(books);

  const articleItems = publishedArticles.map((article) => ({
    title: article.data.title,
    pubDate: article.data.publishDate,
    description: article.data.description,
    link: `/articles/${article.slug}/`,
    author: article.data.author,
    categories: [...article.data.disciplines, ...article.data.tags],
  }));

  const bookItems = publishedBooks.map((book) => ({
    title: `Book Review: ${book.data.title}`,
    pubDate: parseDateFromSlug(book.slug),
    description: `A review of "${book.data.title}" by ${book.data.bookAuthor}. ${book.data.whoShouldRead}`,
    link: `/books/${book.slug}/`,
    categories: [book.data.discipline, book.data.level, ...book.data.tags],
  }));

  // Merge and sort all items by date descending
  const allItems = [...articleItems, ...bookItems].sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime()
  );

  return rss({
    title: 'ProductBuilders.tech',
    description: 'Insights for product managers, designers, and engineers building exceptional products',
    site: context.site!,
    items: allItems,
    customData: '<language>en-us</language>',
  });
}
