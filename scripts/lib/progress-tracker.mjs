import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const SCHEMA_VERSION = 1;

/**
 * @typedef {Object} ProgressFile
 * @property {number} schemaVersion
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {{ reviewed: number, pending: number, deferred: number, failed: number, skipped: number, total: number }} summary
 * @property {ProgressEntry[]} books
 * @property {DeferredEntry[]} deferred
 */

/**
 * @typedef {Object} ProgressEntry
 * @property {string} id - Normalized title key
 * @property {string} title
 * @property {string} author
 * @property {number} year
 * @property {string} discipline
 * @property {string} level
 * @property {number[]} csvRows
 * @property {string} status - pending/in_progress/reviewed/deferred/skipped/failed
 * @property {string} [reviewFile]
 * @property {string} [reviewDate]
 * @property {number} [weekNumber]
 * @property {string} [failureReason]
 */

/**
 * @typedef {Object} DeferredEntry
 * @property {string} id
 * @property {string} title
 * @property {string} author
 * @property {number} year
 * @property {number} deferUntilYear
 * @property {string} reason
 */

/**
 * Get the default progress file path.
 * @returns {string}
 */
export function getProgressPath() {
  return resolve(import.meta.dirname, '../../docs/book_review_progress.json');
}

/**
 * Load progress file with backup fallback.
 * @param {string} [filePath]
 * @returns {ProgressFile}
 */
export function loadProgress(filePath) {
  const path = filePath || getProgressPath();

  if (!existsSync(path)) {
    throw new Error(
      `Progress file not found at ${path}. Run --init first.`,
    );
  }

  try {
    const content = readFileSync(path, 'utf-8');
    const data = JSON.parse(content);

    if (data.schemaVersion !== SCHEMA_VERSION) {
      console.warn(
        `Warning: Progress file schema version ${data.schemaVersion} differs from expected ${SCHEMA_VERSION}`,
      );
    }

    return data;
  } catch (err) {
    // Try backup
    const bakPath = path + '.bak';
    if (existsSync(bakPath)) {
      console.warn(
        `Warning: Progress file corrupt, loading backup from ${bakPath}`,
      );
      const bakContent = readFileSync(bakPath, 'utf-8');
      return JSON.parse(bakContent);
    }
    throw new Error(`Progress file corrupt and no backup found: ${err.message}`);
  }
}

/**
 * Save progress file with atomic write and backup.
 * @param {ProgressFile} data
 * @param {string} [filePath]
 */
export function saveProgress(data, filePath) {
  const path = filePath || getProgressPath();
  const tmpPath = path + '.tmp';
  const bakPath = path + '.bak';

  // Update timestamp and summary
  data.updatedAt = new Date().toISOString();
  data.summary = computeSummary(data.books);

  const json = JSON.stringify(data, null, 2) + '\n';

  // Backup existing file
  if (existsSync(path)) {
    try {
      renameSync(path, bakPath);
    } catch {
      // Backup failure is non-fatal
    }
  }

  // Atomic write: write to tmp, then rename
  writeFileSync(tmpPath, json, 'utf-8');
  renameSync(tmpPath, path);
}

/**
 * Compute summary counts from books array.
 * @param {ProgressEntry[]} books
 * @returns {{ reviewed: number, pending: number, deferred: number, failed: number, skipped: number, total: number }}
 */
function computeSummary(books) {
  const summary = { reviewed: 0, pending: 0, deferred: 0, failed: 0, skipped: 0, total: books.length };
  for (const book of books) {
    if (summary[book.status] !== undefined) {
      summary[book.status]++;
    }
  }
  return summary;
}

/**
 * Build a Map from the books array for quick lookup by id.
 * @param {ProgressFile} progress
 * @returns {Map<string, ProgressEntry>}
 */
export function buildProgressMap(progress) {
  const map = new Map();
  for (const book of progress.books) {
    map.set(book.id, book);
  }
  return map;
}

/**
 * Mark a book as in_progress (pre-generation).
 * @param {ProgressFile} progress
 * @param {string} bookId
 * @param {string} [filePath]
 */
export function markInProgress(progress, bookId, filePath) {
  const book = progress.books.find((b) => b.id === bookId);
  if (!book) throw new Error(`Book not found: ${bookId}`);
  book.status = 'in_progress';
  saveProgress(progress, filePath);
}

/**
 * Mark a book as reviewed (post-verification).
 * @param {ProgressFile} progress
 * @param {string} bookId
 * @param {string} reviewFile
 * @param {number} weekNumber
 * @param {string} [filePath]
 */
export function markReviewed(progress, bookId, reviewFile, weekNumber, filePath) {
  const book = progress.books.find((b) => b.id === bookId);
  if (!book) throw new Error(`Book not found: ${bookId}`);
  book.status = 'reviewed';
  book.reviewFile = reviewFile;
  book.reviewDate = new Date().toISOString().split('T')[0];
  book.weekNumber = weekNumber;
  saveProgress(progress, filePath);
}

/**
 * Mark a book as failed.
 * @param {ProgressFile} progress
 * @param {string} bookId
 * @param {string} reason
 * @param {string} [filePath]
 */
export function markFailed(progress, bookId, reason, filePath) {
  const book = progress.books.find((b) => b.id === bookId);
  if (!book) throw new Error(`Book not found: ${bookId}`);
  book.status = 'failed';
  book.failureReason = reason;
  saveProgress(progress, filePath);
}

/**
 * Reset a failed book back to pending (for retry).
 * @param {ProgressFile} progress
 * @param {string} bookId
 * @param {string} [filePath]
 */
export function resetToPending(progress, bookId, filePath) {
  const book = progress.books.find((b) => b.id === bookId);
  if (!book) throw new Error(`Book not found: ${bookId}`);
  if (book.status !== 'failed' && book.status !== 'in_progress') {
    throw new Error(`Can only reset failed/in_progress books, got: ${book.status}`);
  }
  book.status = 'pending';
  delete book.failureReason;
  saveProgress(progress, filePath);
}

export { SCHEMA_VERSION };
