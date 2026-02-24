import { describe, it, expect } from 'vitest';
import {
  filterByDiscipline,
  filterByLevel,
  filterDrafts,
  getFeaturedArticles,
  getDisciplineLabel,
  getDisciplineColor,
  getRelatedBooks,
} from '../../../src/utils/content';

describe('filterByDiscipline', () => {
  const createMockArticle = (disciplines: string[]) => ({
    data: { disciplines, publishDate: new Date() },
    slug: 'test',
    collection: 'articles' as const,
  });

  const createMockBook = (discipline: string) => ({
    data: { discipline, rating: 5 },
    slug: 'test',
    collection: 'books' as const,
  });

  it('should_return_all_items_when_no_discipline_specified', () => {
    const articles = [
      createMockArticle(['PM']),
      createMockArticle(['Design']),
      createMockArticle(['Engineering']),
    ];

    const result = filterByDiscipline(articles, undefined);
    expect(result).toHaveLength(3);
  });

  it('should_filter_articles_by_discipline', () => {
    const articles = [
      createMockArticle(['PM']),
      createMockArticle(['Design']),
      createMockArticle(['PM', 'Engineering']),
    ];

    const result = filterByDiscipline(articles, 'PM');
    expect(result).toHaveLength(2);
    expect(result[0].data.disciplines).toContain('PM');
    expect(result[1].data.disciplines).toContain('PM');
  });

  it('should_filter_books_by_single_discipline', () => {
    const books = [
      createMockBook('PM'),
      createMockBook('Design'),
      createMockBook('Engineering'),
    ];

    const result = filterByDiscipline(books, 'Design');
    expect(result).toHaveLength(1);
    expect(result[0].data.discipline).toBe('Design');
  });

  it('should_handle_empty_array', () => {
    const result = filterByDiscipline([], 'PM');
    expect(result).toEqual([]);
  });

  it('should_return_empty_when_no_matches', () => {
    const articles = [
      createMockArticle(['PM']),
      createMockArticle(['Engineering']),
    ];

    const result = filterByDiscipline(articles, 'Design');
    expect(result).toEqual([]);
  });
});

describe('filterDrafts', () => {
  const createMockItem = (draft: boolean) => ({
    data: { draft, publishDate: new Date() },
    slug: 'test',
  });

  it('should_exclude_drafts_by_default', () => {
    const items = [
      createMockItem(false),
      createMockItem(true),
      createMockItem(false),
    ];

    const result = filterDrafts(items);
    expect(result).toHaveLength(2);
    expect(result.every((item) => !item.data.draft)).toBe(true);
  });

  it('should_include_drafts_when_requested', () => {
    const items = [
      createMockItem(false),
      createMockItem(true),
      createMockItem(false),
    ];

    const result = filterDrafts(items, true);
    expect(result).toHaveLength(3);
  });

  it('should_handle_items_without_draft_field', () => {
    const items = [
      { data: { publishDate: new Date() }, slug: 'test' },
      { data: { draft: false, publishDate: new Date() }, slug: 'test2' },
    ];

    const result = filterDrafts(items);
    expect(result).toHaveLength(2);
  });

  it('should_handle_empty_array', () => {
    const result = filterDrafts([]);
    expect(result).toEqual([]);
  });

  it('should_exclude_items_with_future_scheduledDate', () => {
    const futureDate = new Date(Date.now() + 86400000); // tomorrow
    const items = [
      { data: { draft: false, scheduledDate: futureDate }, slug: 'future' },
      { data: { draft: false }, slug: 'no-schedule' },
    ];

    const result = filterDrafts(items);
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('no-schedule');
  });

  it('should_include_items_with_past_scheduledDate', () => {
    const pastDate = new Date(Date.now() - 86400000); // yesterday
    const items = [
      { data: { draft: false, scheduledDate: pastDate }, slug: 'past' },
      { data: { draft: false }, slug: 'no-schedule' },
    ];

    const result = filterDrafts(items);
    expect(result).toHaveLength(2);
  });

  it('should_exclude_draft_even_with_past_scheduledDate', () => {
    const pastDate = new Date(Date.now() - 86400000); // yesterday
    const items = [
      { data: { draft: true, scheduledDate: pastDate }, slug: 'draft-past' },
    ];

    const result = filterDrafts(items);
    expect(result).toHaveLength(0);
  });

  it('should_include_future_scheduled_when_includeDrafts_true', () => {
    const futureDate = new Date(Date.now() + 86400000); // tomorrow
    const items = [
      { data: { draft: false, scheduledDate: futureDate }, slug: 'future' },
    ];

    const result = filterDrafts(items, true);
    expect(result).toHaveLength(1);
  });

  it('should_handle_items_without_scheduledDate_field', () => {
    const items = [
      { data: { draft: false }, slug: 'no-field' },
      { data: { draft: false, scheduledDate: undefined }, slug: 'undefined-field' },
    ];

    const result = filterDrafts(items);
    expect(result).toHaveLength(2);
  });
});

describe('getFeaturedArticles', () => {
  const createMockArticle = (featured: boolean) => ({
    data: { featured, publishDate: new Date(), disciplines: ['PM'] },
    slug: 'test',
    collection: 'articles' as const,
  });

  it('should_return_only_featured_articles', () => {
    const articles = [
      createMockArticle(true),
      createMockArticle(false),
      createMockArticle(true),
      createMockArticle(false),
    ];

    const result = getFeaturedArticles(articles as any);
    expect(result).toHaveLength(2);
    expect(result.every((article) => article.data.featured)).toBe(true);
  });

  it('should_return_empty_when_no_featured', () => {
    const articles = [
      createMockArticle(false),
      createMockArticle(false),
    ];

    const result = getFeaturedArticles(articles as any);
    expect(result).toEqual([]);
  });

  it('should_handle_empty_array', () => {
    const result = getFeaturedArticles([]);
    expect(result).toEqual([]);
  });
});

describe('getDisciplineLabel', () => {
  it('should_return_correct_label_for_PM', () => {
    expect(getDisciplineLabel('PM')).toBe('Product Management');
  });

  it('should_return_correct_label_for_Design', () => {
    expect(getDisciplineLabel('Design')).toBe('Design');
  });

  it('should_return_correct_label_for_Engineering', () => {
    expect(getDisciplineLabel('Engineering')).toBe('Engineering');
  });

  it('should_return_input_for_unknown_discipline', () => {
    expect(getDisciplineLabel('Unknown')).toBe('Unknown');
  });

  it('should_handle_empty_string', () => {
    expect(getDisciplineLabel('')).toBe('');
  });
});

describe('getDisciplineColor', () => {
  it('should_return_pm_for_PM_discipline', () => {
    expect(getDisciplineColor('PM')).toBe('pm');
  });

  it('should_return_design_for_Design_discipline', () => {
    expect(getDisciplineColor('Design')).toBe('design');
  });

  it('should_return_engineering_for_Engineering_discipline', () => {
    expect(getDisciplineColor('Engineering')).toBe('engineering');
  });

  it('should_return_gray_for_unknown_discipline', () => {
    expect(getDisciplineColor('Unknown')).toBe('gray');
  });

  it('should_return_gray_for_empty_string', () => {
    expect(getDisciplineColor('')).toBe('gray');
  });
});

describe('filterByLevel', () => {
  const createMockBook = (level: string) => ({
    data: { level, discipline: 'PM', rating: 4 },
    slug: 'test',
    collection: 'books' as const,
  });

  it('should_return_all_items_when_no_level_specified', () => {
    const books = [
      createMockBook('Junior'),
      createMockBook('Mid-Level'),
      createMockBook('Senior'),
    ];

    const result = filterByLevel(books, undefined);
    expect(result).toHaveLength(3);
  });

  it('should_filter_books_by_level', () => {
    const books = [
      createMockBook('Junior'),
      createMockBook('Mid-Level'),
      createMockBook('Junior'),
      createMockBook('Senior'),
    ];

    const result = filterByLevel(books, 'Junior');
    expect(result).toHaveLength(2);
    expect(result.every((b) => b.data.level === 'Junior')).toBe(true);
  });

  it('should_return_empty_when_no_matches', () => {
    const books = [
      createMockBook('Junior'),
      createMockBook('Mid-Level'),
    ];

    const result = filterByLevel(books, 'Senior');
    expect(result).toEqual([]);
  });

  it('should_handle_empty_array', () => {
    const result = filterByLevel([], 'Junior');
    expect(result).toEqual([]);
  });
});

describe('getRelatedBooks', () => {
  const createMockBook = (
    slug: string,
    discipline: string,
    level: string,
    tags: string[] = [],
    title: string = slug
  ) => ({
    data: { discipline, level, tags, title, bookAuthor: 'Author', rating: 4, keyTakeaways: ['t1', 't2', 't3'], whoShouldRead: 'Everyone', crossFunctionalValue: 'High', publicationYear: 2015, draft: false },
    slug,
    collection: 'books' as const,
  });

  it('should_exclude_current_book', () => {
    const current = createMockBook('book-a', 'PM', 'Junior');
    const all = [current, createMockBook('book-b', 'PM', 'Junior')];

    const result = getRelatedBooks(current as any, all as any);
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('book-b');
  });

  it('should_score_same_discipline_higher', () => {
    const current = createMockBook('current', 'PM', 'Junior');
    const sameDiscipline = createMockBook('same-disc', 'PM', 'Senior');
    const diffDiscipline = createMockBook('diff-disc', 'Design', 'Junior');
    const all = [current, diffDiscipline, sameDiscipline];

    const result = getRelatedBooks(current as any, all as any);
    // same discipline (+3) + different level (0) = 3
    // diff discipline (0) + same level (+2) = 2
    expect(result[0].slug).toBe('same-disc');
    expect(result[1].slug).toBe('diff-disc');
  });

  it('should_score_same_level_as_bonus', () => {
    const current = createMockBook('current', 'PM', 'Junior');
    const sameLevel = createMockBook('same-level', 'Design', 'Junior');
    const diffLevel = createMockBook('diff-level', 'Design', 'Senior');
    const all = [current, diffLevel, sameLevel];

    const result = getRelatedBooks(current as any, all as any);
    // sameLevel: diff discipline (0) + same level (+2) = 2
    // diffLevel: diff discipline (0) + diff level (0) = 0
    expect(result[0].slug).toBe('same-level');
  });

  it('should_score_shared_tags', () => {
    const current = createMockBook('current', 'Design', 'Senior', ['ux', 'research']);
    const sharedTags = createMockBook('shared', 'Engineering', 'Junior', ['ux', 'research']);
    const noTags = createMockBook('no-tags', 'Engineering', 'Junior', []);
    const all = [current, noTags, sharedTags];

    const result = getRelatedBooks(current as any, all as any);
    // sharedTags: +0 disc + +0 level + +2 tags = 2
    // noTags: +0 disc + +0 level + +0 tags = 0
    expect(result[0].slug).toBe('shared');
  });

  it('should_limit_results_to_count', () => {
    const current = createMockBook('current', 'PM', 'Junior');
    const all = [
      current,
      createMockBook('b1', 'PM', 'Junior'),
      createMockBook('b2', 'PM', 'Junior'),
      createMockBook('b3', 'PM', 'Junior'),
      createMockBook('b4', 'PM', 'Junior'),
    ];

    const result = getRelatedBooks(current as any, all as any, 2);
    expect(result).toHaveLength(2);
  });

  it('should_return_empty_when_no_other_books', () => {
    const current = createMockBook('current', 'PM', 'Junior');
    const result = getRelatedBooks(current as any, [current] as any);
    expect(result).toEqual([]);
  });

  it('should_break_ties_by_title_alphabetically', () => {
    const current = createMockBook('current', 'PM', 'Junior');
    const bookA = createMockBook('a-book', 'Design', 'Senior', [], 'Alpha Book');
    const bookZ = createMockBook('z-book', 'Design', 'Senior', [], 'Zeta Book');
    const all = [current, bookZ, bookA];

    const result = getRelatedBooks(current as any, all as any);
    // Both score 0, tiebreak by title
    expect(result[0].slug).toBe('a-book');
    expect(result[1].slug).toBe('z-book');
  });
});
