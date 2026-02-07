import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { filterDrafts } from '@/utils/content';
import { sortByDate } from '@/utils/date';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');
  const publishedArticles = filterDrafts(articles);
  const sortedArticles = sortByDate(publishedArticles);

  return rss({
    title: 'ProductBuilders.io',
    description: 'Insights for product managers, designers, and engineers building exceptional products',
    site: context.site!,
    items: sortedArticles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.publishDate,
      description: article.data.description,
      link: `/articles/${article.slug}/`,
      author: article.data.author,
      categories: [...article.data.disciplines, ...article.data.tags],
    })),
    customData: '<language>en-us</language>',
  });
}
