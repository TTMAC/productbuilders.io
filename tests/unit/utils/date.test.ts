import { describe, it, expect } from 'vitest';
import { formatDate, sortByDate } from '../../../src/utils/date';

describe('formatDate', () => {
  it('should_format_date_with_default_format', () => {
    const date = new Date('2026-01-15T12:00:00Z');
    const result = formatDate(date);
    expect(result).toBe('Jan 15, 2026');
  });

  it('should_format_date_with_custom_format', () => {
    const date = new Date('2026-01-15T12:00:00Z');
    const result = formatDate(date, 'yyyy-MM-dd');
    expect(result).toBe('2026-01-15');
  });

  it('should_handle_string_date_input', () => {
    const dateString = '2026-01-15';
    const result = formatDate(dateString);
    expect(result).toBe('Jan 15, 2026');
  });

  it('should_format_full_month_name', () => {
    const date = new Date('2026-03-20T12:00:00Z');
    const result = formatDate(date, 'MMMM dd, yyyy');
    expect(result).toBe('March 20, 2026');
  });

  it('should_format_with_day_of_week', () => {
    const date = new Date('2026-01-15T12:00:00Z');
    const result = formatDate(date, 'EEEE, MMMM dd, yyyy');
    expect(result).toContain('January 15, 2026');
  });
});

describe('sortByDate', () => {
  const createMockArticle = (publishDate: Date) => ({
    data: { publishDate },
    slug: 'test',
    collection: 'articles' as const,
    id: 'test',
    body: '',
    render: async () => ({ Content: null as any, headings: [], remarkPluginFrontmatter: {} }),
  });

  it('should_sort_articles_in_descending_order_by_default', () => {
    const articles = [
      createMockArticle(new Date('2026-01-10')),
      createMockArticle(new Date('2026-01-20')),
      createMockArticle(new Date('2026-01-15')),
    ];

    const sorted = sortByDate(articles);

    expect(sorted[0].data.publishDate.getTime()).toBe(new Date('2026-01-20').getTime());
    expect(sorted[1].data.publishDate.getTime()).toBe(new Date('2026-01-15').getTime());
    expect(sorted[2].data.publishDate.getTime()).toBe(new Date('2026-01-10').getTime());
  });

  it('should_sort_articles_in_ascending_order_when_specified', () => {
    const articles = [
      createMockArticle(new Date('2026-01-20')),
      createMockArticle(new Date('2026-01-10')),
      createMockArticle(new Date('2026-01-15')),
    ];

    const sorted = sortByDate(articles, 'asc');

    expect(sorted[0].data.publishDate.getTime()).toBe(new Date('2026-01-10').getTime());
    expect(sorted[1].data.publishDate.getTime()).toBe(new Date('2026-01-15').getTime());
    expect(sorted[2].data.publishDate.getTime()).toBe(new Date('2026-01-20').getTime());
  });

  it('should_handle_empty_array', () => {
    const articles: any[] = [];
    const sorted = sortByDate(articles);
    expect(sorted).toEqual([]);
  });

  it('should_handle_single_article', () => {
    const articles = [createMockArticle(new Date('2026-01-15'))];
    const sorted = sortByDate(articles);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].data.publishDate.getTime()).toBe(new Date('2026-01-15').getTime());
  });

  it('should_not_mutate_original_array', () => {
    const articles = [
      createMockArticle(new Date('2026-01-10')),
      createMockArticle(new Date('2026-01-20')),
    ];

    const original = [...articles];
    sortByDate(articles);

    expect(articles[0]).toBe(original[0]);
    expect(articles[1]).toBe(original[1]);
  });
});
