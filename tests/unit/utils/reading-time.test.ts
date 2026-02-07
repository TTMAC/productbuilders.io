import { describe, it, expect } from 'vitest';
import { calculateReadingTime, getWordCount } from '../../../src/utils/reading-time';

describe('getWordCount', () => {
  it('should_count_words_correctly', () => {
    const text = 'This is a simple test';
    expect(getWordCount(text)).toBe(5);
  });

  it('should_handle_multiple_spaces', () => {
    const text = 'This  is   a    test';
    expect(getWordCount(text)).toBe(4);
  });

  it('should_handle_newlines', () => {
    const text = 'This\nis\na\ntest';
    expect(getWordCount(text)).toBe(4);
  });

  it('should_handle_tabs', () => {
    const text = 'This\tis\ta\ttest';
    expect(getWordCount(text)).toBe(4);
  });

  it('should_trim_leading_and_trailing_whitespace', () => {
    const text = '  This is a test  ';
    expect(getWordCount(text)).toBe(4);
  });

  it('should_handle_empty_string', () => {
    expect(getWordCount('')).toBe(0);
  });

  it('should_handle_whitespace_only', () => {
    expect(getWordCount('   ')).toBe(0);
  });

  it('should_count_words_with_punctuation', () => {
    const text = 'Hello, world! How are you?';
    expect(getWordCount(text)).toBe(5);
  });

  it('should_handle_long_text', () => {
    const text = 'a '.repeat(1000).trim();
    expect(getWordCount(text)).toBe(1000);
  });
});

describe('calculateReadingTime', () => {
  it('should_calculate_reading_time_at_200_wpm', () => {
    const wordCount = 200;
    expect(calculateReadingTime(wordCount)).toBe(1);
  });

  it('should_round_up_fractional_minutes', () => {
    const wordCount = 250; // 1.25 minutes
    expect(calculateReadingTime(wordCount)).toBe(2);
  });

  it('should_handle_small_word_counts', () => {
    const wordCount = 50; // 0.25 minutes
    expect(calculateReadingTime(wordCount)).toBe(1); // Should round up to 1
  });

  it('should_handle_large_word_counts', () => {
    const wordCount = 2000; // 10 minutes
    expect(calculateReadingTime(wordCount)).toBe(10);
  });

  it('should_handle_zero_words', () => {
    expect(calculateReadingTime(0)).toBe(0);
  });

  it('should_calculate_for_typical_article_length', () => {
    const wordCount = 2250; // Target article length
    const readingTime = calculateReadingTime(wordCount);
    expect(readingTime).toBe(12); // 2250 / 200 = 11.25, rounds to 12
  });

  it('should_handle_very_short_content', () => {
    const wordCount = 10;
    expect(calculateReadingTime(wordCount)).toBe(1); // 0.05 rounds up to 1
  });

  it('should_calculate_correctly_for_edge_cases', () => {
    expect(calculateReadingTime(199)).toBe(1); // Just under 1 minute
    expect(calculateReadingTime(201)).toBe(2); // Just over 1 minute
    expect(calculateReadingTime(400)).toBe(2); // Exactly 2 minutes
    expect(calculateReadingTime(401)).toBe(3); // Just over 2 minutes
  });
});
