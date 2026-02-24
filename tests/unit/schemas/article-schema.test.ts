import { describe, it, expect } from 'vitest';
import { articleSchema } from '../../../src/schemas/content';

describe('Article Schema', () => {
  it('should_reject_article_when_no_disciplines_provided', () => {
    const frontmatter = {
      title: 'Test Article',
      description: 'Test description',
      author: 'Tshepo Machele',
      publishDate: new Date('2026-01-15'),
      disciplines: [], // Invalid - must have at least 1
      tags: [],
      featured: false,
      draft: false,
    };

    expect(() => articleSchema.parse(frontmatter)).toThrow();
  });

  it('should_accept_article_with_multiple_disciplines', () => {
    const frontmatter = {
      title: 'Test Article',
      description: 'Test description',
      author: 'Tshepo Machele',
      publishDate: new Date('2026-01-15'),
      disciplines: ['PM', 'Engineering'],
      tags: [],
      featured: false,
      draft: false,
    };

    const result = articleSchema.parse(frontmatter);
    expect(result.disciplines).toEqual(['PM', 'Engineering']);
  });

  it('should_accept_article_with_single_discipline', () => {
    const frontmatter = {
      title: 'Test Article',
      description: 'Test description',
      author: 'Tshepo Machele',
      publishDate: new Date('2026-01-15'),
      disciplines: ['Design'],
      tags: [],
      featured: false,
      draft: false,
    };

    const result = articleSchema.parse(frontmatter);
    expect(result.disciplines).toEqual(['Design']);
  });

  it('should_reject_when_title_exceeds_60_chars', () => {
    const frontmatter = {
      title: 'A'.repeat(61), // 61 characters
      description: 'Valid description',
      author: 'Tshepo Machele',
      publishDate: new Date('2026-01-15'),
      disciplines: ['PM'],
      tags: [],
      featured: false,
      draft: false,
    };

    expect(() => articleSchema.parse(frontmatter)).toThrow();
  });

  it('should_reject_when_description_exceeds_155_chars', () => {
    const frontmatter = {
      title: 'Valid Title',
      description: 'A'.repeat(156), // 156 characters
      author: 'Tshepo Machele',
      publishDate: new Date('2026-01-15'),
      disciplines: ['PM'],
      tags: [],
      featured: false,
      draft: false,
    };

    expect(() => articleSchema.parse(frontmatter)).toThrow();
  });

  it('should_accept_valid_title_at_60_chars', () => {
    const frontmatter = {
      title: 'A'.repeat(60), // Exactly 60 characters
      description: 'Valid description',
      author: 'Tshepo Machele',
      publishDate: new Date('2026-01-15'),
      disciplines: ['PM'],
      tags: [],
      featured: false,
      draft: false,
    };

    const result = articleSchema.parse(frontmatter);
    expect(result.title.length).toBe(60);
  });

  it('should_accept_valid_description_at_155_chars', () => {
    const frontmatter = {
      title: 'Valid Title',
      description: 'A'.repeat(155), // Exactly 155 characters
      author: 'Tshepo Machele',
      publishDate: new Date('2026-01-15'),
      disciplines: ['PM'],
      tags: [],
      featured: false,
      draft: false,
    };

    const result = articleSchema.parse(frontmatter);
    expect(result.description.length).toBe(155);
  });

  it('should_use_default_author_when_not_provided', () => {
    const frontmatter = {
      title: 'Test Article',
      description: 'Test description',
      publishDate: new Date('2026-01-15'),
      disciplines: ['PM'],
    };

    const result = articleSchema.parse(frontmatter);
    expect(result.author).toBe('Tshepo Machele');
  });

  it('should_default_tags_to_empty_array', () => {
    const frontmatter = {
      title: 'Test Article',
      description: 'Test description',
      author: 'Tshepo Machele',
      publishDate: new Date('2026-01-15'),
      disciplines: ['PM'],
    };

    const result = articleSchema.parse(frontmatter);
    expect(result.tags).toEqual([]);
  });

  it('should_default_featured_to_false', () => {
    const frontmatter = {
      title: 'Test Article',
      description: 'Test description',
      author: 'Tshepo Machele',
      publishDate: new Date('2026-01-15'),
      disciplines: ['PM'],
    };

    const result = articleSchema.parse(frontmatter);
    expect(result.featured).toBe(false);
  });

  it('should_default_draft_to_false', () => {
    const frontmatter = {
      title: 'Test Article',
      description: 'Test description',
      author: 'Tshepo Machele',
      publishDate: new Date('2026-01-15'),
      disciplines: ['PM'],
    };

    const result = articleSchema.parse(frontmatter);
    expect(result.draft).toBe(false);
  });

  it('should_coerce_string_date_to_date_object', () => {
    const frontmatter = {
      title: 'Test Article',
      description: 'Test description',
      author: 'Tshepo Machele',
      publishDate: '2026-01-15',
      disciplines: ['PM'],
    };

    const result = articleSchema.parse(frontmatter);
    expect(result.publishDate).toBeInstanceOf(Date);
  });

  it('should_accept_optional_updatedDate', () => {
    const frontmatter = {
      title: 'Test Article',
      description: 'Test description',
      author: 'Tshepo Machele',
      publishDate: new Date('2026-01-15'),
      updatedDate: new Date('2026-01-20'),
      disciplines: ['PM'],
    };

    const result = articleSchema.parse(frontmatter);
    expect(result.updatedDate).toBeInstanceOf(Date);
  });

  it('should_accept_optional_hero_image', () => {
    const frontmatter = {
      title: 'Test Article',
      description: 'Test description',
      author: 'Tshepo Machele',
      publishDate: new Date('2026-01-15'),
      disciplines: ['PM'],
      heroImage: '/images/hero.jpg',
      heroImageAlt: 'Hero image description',
    };

    const result = articleSchema.parse(frontmatter);
    expect(result.heroImage).toBe('/images/hero.jpg');
    expect(result.heroImageAlt).toBe('Hero image description');
  });

  it('should_accept_optional_scheduledDate', () => {
    const frontmatter = {
      title: 'Test Article',
      description: 'Test description',
      author: 'Tshepo Machele',
      publishDate: new Date('2026-01-15'),
      scheduledDate: new Date('2026-03-01'),
      disciplines: ['PM'],
    };

    const result = articleSchema.parse(frontmatter);
    expect(result.scheduledDate).toBeInstanceOf(Date);
  });

  it('should_accept_article_without_scheduledDate', () => {
    const frontmatter = {
      title: 'Test Article',
      description: 'Test description',
      author: 'Tshepo Machele',
      publishDate: new Date('2026-01-15'),
      disciplines: ['PM'],
    };

    const result = articleSchema.parse(frontmatter);
    expect(result.scheduledDate).toBeUndefined();
  });

  it('should_coerce_string_scheduledDate_to_Date', () => {
    const frontmatter = {
      title: 'Test Article',
      description: 'Test description',
      author: 'Tshepo Machele',
      publishDate: new Date('2026-01-15'),
      scheduledDate: '2026-03-01T10:00:00Z',
      disciplines: ['PM'],
    };

    const result = articleSchema.parse(frontmatter);
    expect(result.scheduledDate).toBeInstanceOf(Date);
  });

  it('should_reject_invalid_discipline_value', () => {
    const frontmatter = {
      title: 'Test Article',
      description: 'Test description',
      author: 'Tshepo Machele',
      publishDate: new Date('2026-01-15'),
      disciplines: ['InvalidDiscipline'],
    };

    expect(() => articleSchema.parse(frontmatter)).toThrow();
  });
});
