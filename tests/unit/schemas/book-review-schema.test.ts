import { describe, it, expect } from 'vitest';
import { bookReviewSchema } from '../../../src/schemas/content';

describe('BookReview Schema', () => {
  it('should_accept_valid_book_review', () => {
    const frontmatter = {
      title: 'Inspired: How to Create Tech Products Customers Love',
      bookAuthor: 'Marty Cagan',
      discipline: 'PM',
      level: 'Mid-Level',
      rating: 5,
      publicationYear: 2017,
      tags: ['product-management', 'strategy'],
      crossFunctionalValue: 'Engineers and designers learn why strong PM practices reduce wasted work.',
      keyTakeaways: [
        'Product discovery must happen before delivery',
        'Empowered teams outperform feature teams',
        'Continuous discovery reduces risk',
      ],
      whoShouldRead: 'Mid-level PMs transitioning to leadership.',
      draft: false,
    };

    const result = bookReviewSchema.parse(frontmatter);
    expect(result.title).toBe('Inspired: How to Create Tech Products Customers Love');
    expect(result.discipline).toBe('PM');
    expect(result.rating).toBe(5);
  });

  it('should_reject_rating_below_1', () => {
    const frontmatter = {
      title: 'Test Book',
      bookAuthor: 'Test Author',
      discipline: 'PM',
      level: 'Junior',
      rating: 0,
      publicationYear: 2020,
      tags: [],
      crossFunctionalValue: 'Test value',
      keyTakeaways: ['One', 'Two', 'Three'],
      whoShouldRead: 'Everyone',
      draft: false,
    };

    expect(() => bookReviewSchema.parse(frontmatter)).toThrow();
  });

  it('should_reject_rating_above_5', () => {
    const frontmatter = {
      title: 'Test Book',
      bookAuthor: 'Test Author',
      discipline: 'PM',
      level: 'Junior',
      rating: 6,
      publicationYear: 2020,
      tags: [],
      crossFunctionalValue: 'Test value',
      keyTakeaways: ['One', 'Two', 'Three'],
      whoShouldRead: 'Everyone',
      draft: false,
    };

    expect(() => bookReviewSchema.parse(frontmatter)).toThrow();
  });

  it('should_reject_non_integer_rating', () => {
    const frontmatter = {
      title: 'Test Book',
      bookAuthor: 'Test Author',
      discipline: 'PM',
      level: 'Junior',
      rating: 4.5,
      publicationYear: 2020,
      tags: [],
      crossFunctionalValue: 'Test value',
      keyTakeaways: ['One', 'Two', 'Three'],
      whoShouldRead: 'Everyone',
      draft: false,
    };

    expect(() => bookReviewSchema.parse(frontmatter)).toThrow();
  });

  it('should_reject_future_publication_year', () => {
    const currentYear = new Date().getFullYear();
    const frontmatter = {
      title: 'Test Book',
      bookAuthor: 'Test Author',
      discipline: 'PM',
      level: 'Junior',
      rating: 5,
      publicationYear: currentYear - 4, // Must be at least 5 years ago
      tags: [],
      crossFunctionalValue: 'Test value',
      keyTakeaways: ['One', 'Two', 'Three'],
      whoShouldRead: 'Everyone',
      draft: false,
    };

    expect(() => bookReviewSchema.parse(frontmatter)).toThrow();
  });

  it('should_accept_publication_year_5_years_ago', () => {
    const currentYear = new Date().getFullYear();
    const frontmatter = {
      title: 'Test Book',
      bookAuthor: 'Test Author',
      discipline: 'PM',
      level: 'Junior',
      rating: 5,
      publicationYear: currentYear - 5,
      tags: [],
      crossFunctionalValue: 'Test value',
      keyTakeaways: ['One', 'Two', 'Three'],
      whoShouldRead: 'Everyone',
      draft: false,
    };

    const result = bookReviewSchema.parse(frontmatter);
    expect(result.publicationYear).toBe(currentYear - 5);
  });

  it('should_accept_all_valid_disciplines', () => {
    const disciplines = ['PM', 'Design', 'Engineering'];

    disciplines.forEach((discipline) => {
      const frontmatter = {
        title: 'Test Book',
        bookAuthor: 'Test Author',
        discipline,
        level: 'Junior',
        rating: 5,
        publicationYear: 2019,
        tags: [],
        crossFunctionalValue: 'Test value',
        keyTakeaways: ['One', 'Two', 'Three'],
        whoShouldRead: 'Everyone',
        draft: false,
      };

      const result = bookReviewSchema.parse(frontmatter);
      expect(result.discipline).toBe(discipline);
    });
  });

  it('should_accept_all_valid_levels', () => {
    const levels = ['Junior', 'Mid-Level', 'Senior'];

    levels.forEach((level) => {
      const frontmatter = {
        title: 'Test Book',
        bookAuthor: 'Test Author',
        discipline: 'PM',
        level,
        rating: 5,
        publicationYear: 2019,
        tags: [],
        crossFunctionalValue: 'Test value',
        keyTakeaways: ['One', 'Two', 'Three'],
        whoShouldRead: 'Everyone',
        draft: false,
      };

      const result = bookReviewSchema.parse(frontmatter);
      expect(result.level).toBe(level);
    });
  });

  it('should_reject_fewer_than_3_key_takeaways', () => {
    const frontmatter = {
      title: 'Test Book',
      bookAuthor: 'Test Author',
      discipline: 'PM',
      level: 'Junior',
      rating: 5,
      publicationYear: 2019,
      tags: [],
      crossFunctionalValue: 'Test value',
      keyTakeaways: ['One', 'Two'],
      whoShouldRead: 'Everyone',
      draft: false,
    };

    expect(() => bookReviewSchema.parse(frontmatter)).toThrow();
  });

  it('should_reject_more_than_5_key_takeaways', () => {
    const frontmatter = {
      title: 'Test Book',
      bookAuthor: 'Test Author',
      discipline: 'PM',
      level: 'Junior',
      rating: 5,
      publicationYear: 2019,
      tags: [],
      crossFunctionalValue: 'Test value',
      keyTakeaways: ['One', 'Two', 'Three', 'Four', 'Five', 'Six'],
      whoShouldRead: 'Everyone',
      draft: false,
    };

    expect(() => bookReviewSchema.parse(frontmatter)).toThrow();
  });

  it('should_require_crossFunctionalValue', () => {
    const frontmatter = {
      title: 'Test Book',
      bookAuthor: 'Test Author',
      discipline: 'PM',
      level: 'Junior',
      rating: 5,
      publicationYear: 2019,
      tags: [],
      crossFunctionalValue: '',
      keyTakeaways: ['One', 'Two', 'Three'],
      whoShouldRead: 'Everyone',
      draft: false,
    };

    expect(() => bookReviewSchema.parse(frontmatter)).toThrow();
  });

  it('should_default_tags_to_empty_array', () => {
    const frontmatter = {
      title: 'Test Book',
      bookAuthor: 'Test Author',
      discipline: 'PM',
      level: 'Junior',
      rating: 5,
      publicationYear: 2019,
      crossFunctionalValue: 'Test value',
      keyTakeaways: ['One', 'Two', 'Three'],
      whoShouldRead: 'Everyone',
    };

    const result = bookReviewSchema.parse(frontmatter);
    expect(result.tags).toEqual([]);
  });

  it('should_default_draft_to_false', () => {
    const frontmatter = {
      title: 'Test Book',
      bookAuthor: 'Test Author',
      discipline: 'PM',
      level: 'Junior',
      rating: 5,
      publicationYear: 2019,
      tags: [],
      crossFunctionalValue: 'Test value',
      keyTakeaways: ['One', 'Two', 'Three'],
      whoShouldRead: 'Everyone',
    };

    const result = bookReviewSchema.parse(frontmatter);
    expect(result.draft).toBe(false);
  });

  it('should_accept_optional_affiliate_link', () => {
    const frontmatter = {
      title: 'Test Book',
      bookAuthor: 'Test Author',
      discipline: 'PM',
      level: 'Junior',
      rating: 5,
      publicationYear: 2019,
      tags: [],
      crossFunctionalValue: 'Test value',
      keyTakeaways: ['One', 'Two', 'Three'],
      whoShouldRead: 'Everyone',
      affiliateLink: 'https://amazon.com/test-book',
      draft: false,
    };

    const result = bookReviewSchema.parse(frontmatter);
    expect(result.affiliateLink).toBe('https://amazon.com/test-book');
  });

  it('should_reject_invalid_affiliate_link_url', () => {
    const frontmatter = {
      title: 'Test Book',
      bookAuthor: 'Test Author',
      discipline: 'PM',
      level: 'Junior',
      rating: 5,
      publicationYear: 2019,
      tags: [],
      crossFunctionalValue: 'Test value',
      keyTakeaways: ['One', 'Two', 'Three'],
      whoShouldRead: 'Everyone',
      affiliateLink: 'not-a-valid-url',
      draft: false,
    };

    expect(() => bookReviewSchema.parse(frontmatter)).toThrow();
  });
});
