import { describe, it, expect } from 'vitest';
import { getRelatedArticles } from '../../../src/utils/content';

// Factory for creating mock articles
const createMockArticle = (
  slug: string,
  disciplines: string[],
  tags: string[] = [],
  publishDate: Date = new Date('2026-01-15')
) => ({
  slug,
  collection: 'articles' as const,
  data: {
    title: `Article ${slug}`,
    description: 'Test description',
    author: 'Test Author',
    publishDate,
    disciplines,
    tags,
    featured: false,
    draft: false,
  },
  body: 'Test body content',
  render: async () => ({ Content: null as any }),
});

describe('getRelatedArticles', () => {
  it('should_exclude_current_article_from_results', () => {
    const current = createMockArticle('current', ['PM', 'Engineering']);
    const other = createMockArticle('other', ['PM', 'Engineering']);
    const articles = [current, other];

    const result = getRelatedArticles(current as any, articles as any, 3);

    expect(result.every((a) => a.slug !== 'current')).toBe(true);
    expect(result).toHaveLength(1);
  });

  it('should_return_max_count_articles', () => {
    const current = createMockArticle('current', ['PM']);
    const articles = [
      current,
      createMockArticle('a1', ['PM']),
      createMockArticle('a2', ['PM']),
      createMockArticle('a3', ['PM']),
      createMockArticle('a4', ['PM']),
    ];

    const result = getRelatedArticles(current as any, articles as any, 3);

    expect(result).toHaveLength(3);
  });

  it('should_prioritize_articles_with_shared_disciplines', () => {
    const current = createMockArticle('current', ['PM', 'Engineering']);
    const sharedBoth = createMockArticle('shared-both', ['PM', 'Engineering']);
    const sharedOne = createMockArticle('shared-one', ['PM']);
    const noShared = createMockArticle('no-shared', ['Design']);
    const articles = [current, noShared, sharedOne, sharedBoth];

    const result = getRelatedArticles(current as any, articles as any, 3);

    expect(result[0].slug).toBe('shared-both');
  });

  it('should_prioritize_cross_discipline_bridging', () => {
    const current = createMockArticle('current', ['PM']);
    // Both share PM, but bridge also brings Design (cross-functional bonus)
    const bridge = createMockArticle('bridge', ['PM', 'Design']);
    const sameOnly = createMockArticle('same-only', ['PM']);
    const articles = [current, sameOnly, bridge];

    const result = getRelatedArticles(current as any, articles as any, 3);

    // bridge: +3 (shared PM) + 2 (Design not in current) = 5
    // sameOnly: +3 (shared PM) = 3
    expect(result[0].slug).toBe('bridge');
  });

  it('should_score_shared_tags_for_relevance', () => {
    const current = createMockArticle('current', ['Design'], ['accessibility', 'wcag']);
    const sharedTags = createMockArticle('shared-tags', ['Design'], ['accessibility', 'wcag']);
    const noTags = createMockArticle('no-tags', ['Design'], []);
    const articles = [current, noTags, sharedTags];

    const result = getRelatedArticles(current as any, articles as any, 3);

    // sharedTags: +3 (Design) + 2 (shared tags) = 5
    // noTags: +3 (Design) = 3
    expect(result[0].slug).toBe('shared-tags');
  });

  it('should_return_empty_array_when_no_other_articles', () => {
    const current = createMockArticle('current', ['PM']);
    const articles = [current];

    const result = getRelatedArticles(current as any, articles as any, 3);

    expect(result).toEqual([]);
  });

  it('should_handle_single_available_article', () => {
    const current = createMockArticle('current', ['PM']);
    const other = createMockArticle('other', ['Design']);
    const articles = [current, other];

    const result = getRelatedArticles(current as any, articles as any, 3);

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('other');
  });

  it('should_break_ties_by_publish_date_descending', () => {
    const current = createMockArticle('current', ['PM']);
    const older = createMockArticle('older', ['PM'], [], new Date('2026-01-01'));
    const newer = createMockArticle('newer', ['PM'], [], new Date('2026-02-01'));
    const articles = [current, older, newer];

    const result = getRelatedArticles(current as any, articles as any, 3);

    // Same score, newer should come first
    expect(result[0].slug).toBe('newer');
    expect(result[1].slug).toBe('older');
  });

  it('should_default_to_count_of_3', () => {
    const current = createMockArticle('current', ['PM']);
    const articles = [
      current,
      createMockArticle('a1', ['PM']),
      createMockArticle('a2', ['PM']),
      createMockArticle('a3', ['PM']),
      createMockArticle('a4', ['PM']),
    ];

    const result = getRelatedArticles(current as any, articles as any);

    expect(result).toHaveLength(3);
  });
});
