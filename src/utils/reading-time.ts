/**
 * Calculate reading time based on word count
 * Per SRD - 200 words per minute reading speed
 * @param wordCount - Number of words in the content
 * @returns Reading time in minutes (rounded up)
 */
export function calculateReadingTime(wordCount: number): number {
  if (wordCount === 0) return 0;
  return Math.ceil(wordCount / 200);
}

/**
 * Count words in text content
 * @param content - Text content to count words in
 * @returns Number of words
 */
export function getWordCount(content: string): number {
  const trimmed = content.trim();
  if (trimmed === '') return 0;
  return trimmed.split(/\s+/).length;
}
