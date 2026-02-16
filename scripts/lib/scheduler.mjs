/**
 * Round-robin scheduler for weekly book review generation.
 *
 * Strategy: Rotate disciplines each week (PM -> Design -> Engineering -> PM -> ...)
 * Within each discipline: Progress Junior -> Mid-Level -> Senior by list_position.
 * Skips books already reviewed, deferred, or duplicated under another category.
 */

const DISCIPLINE_ORDER = ['PM', 'Design', 'Engineering'];
const LEVEL_ORDER = ['Junior', 'Mid-Level', 'Senior'];
const CURRENT_YEAR = new Date().getFullYear();
const SCHEMA_MAX_YEAR = CURRENT_YEAR - 5;

/**
 * @typedef {import('./book-deduplicator.mjs').UniqueBook} UniqueBook
 *
 * @typedef {Object} ProgressEntry
 * @property {string} id
 * @property {string} status - pending/in_progress/reviewed/deferred/skipped/failed
 * @property {string} [reviewFile]
 * @property {string} [reviewDate]
 * @property {number} [weekNumber]
 * @property {string} [deferReason]
 * @property {number} [deferUntilYear]
 */

/**
 * Build a sorted queue of books per discipline, ordered by level then list_position.
 * @param {UniqueBook[]} books
 * @returns {Map<string, UniqueBook[]>}
 */
function buildDisciplineQueues(books) {
  const queues = new Map();
  for (const d of DISCIPLINE_ORDER) {
    queues.set(d, []);
  }

  for (const book of books) {
    const queue = queues.get(book.primaryDiscipline);
    if (queue) {
      queue.push(book);
    }
  }

  // Sort each queue by level order, then by list_position
  for (const [, queue] of queues) {
    queue.sort((a, b) => {
      const levelDiff = LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level);
      if (levelDiff !== 0) return levelDiff;
      return a.listPosition - b.listPosition;
    });
  }

  return queues;
}

/**
 * Determine if a book should be deferred based on publication year.
 * @param {UniqueBook} book
 * @returns {{ deferred: boolean, reason?: string }}
 */
export function checkDeferral(book) {
  if (book.year > SCHEMA_MAX_YEAR) {
    return {
      deferred: true,
      reason: `publicationYear ${book.year} > ${SCHEMA_MAX_YEAR} (schema max). Will become eligible in ${book.year + 5}.`,
    };
  }
  return { deferred: false };
}

/**
 * Get the next book to review based on round-robin scheduling.
 *
 * @param {UniqueBook[]} books - All unique books
 * @param {Map<string, ProgressEntry>} progressMap - Current progress state
 * @returns {{ book: UniqueBook, weekNumber: number, discipline: string } | null}
 */
export function getNextBook(books, progressMap) {
  const queues = buildDisciplineQueues(books);

  // Count reviewed books to determine current week/discipline
  let reviewed = 0;
  for (const [, entry] of progressMap) {
    if (entry.status === 'reviewed') reviewed++;
  }

  // Try each discipline starting from where we left off in rotation
  const startDisciplineIdx = reviewed % DISCIPLINE_ORDER.length;
  const weekNumber = reviewed + 1;

  for (let attempt = 0; attempt < DISCIPLINE_ORDER.length; attempt++) {
    const disciplineIdx = (startDisciplineIdx + attempt) % DISCIPLINE_ORDER.length;
    const discipline = DISCIPLINE_ORDER[disciplineIdx];
    const queue = queues.get(discipline);

    for (const book of queue) {
      const progress = progressMap.get(book.id);

      // Skip already reviewed, in_progress, or deferred books
      if (progress && ['reviewed', 'in_progress', 'deferred', 'skipped'].includes(progress.status)) {
        continue;
      }

      // Check if this book needs deferral
      const deferral = checkDeferral(book);
      if (deferral.deferred) {
        continue;
      }

      return { book, weekNumber, discipline };
    }
  }

  return null; // All books reviewed or deferred
}

/**
 * Generate the full schedule (for preview/dry-run).
 * @param {UniqueBook[]} books
 * @param {Map<string, ProgressEntry>} progressMap
 * @param {number} [limit=10] - Number of upcoming books to show
 * @returns {Array<{ book: UniqueBook, weekNumber: number, discipline: string }>}
 */
export function previewSchedule(books, progressMap, limit = 10) {
  // Clone the progress map to simulate without mutating
  const simMap = new Map(progressMap);
  const schedule = [];

  for (let i = 0; i < limit; i++) {
    const next = getNextBook(books, simMap);
    if (!next) break;

    schedule.push(next);

    // Simulate marking as reviewed to advance
    simMap.set(next.book.id, {
      id: next.book.id,
      status: 'reviewed',
      weekNumber: next.weekNumber,
    });
  }

  return schedule;
}

export { DISCIPLINE_ORDER, LEVEL_ORDER, SCHEMA_MAX_YEAR };
