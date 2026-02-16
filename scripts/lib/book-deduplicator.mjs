/**
 * Deduplicate books that appear in multiple CSV categories.
 * Normalizes titles, groups by title, merges categories.
 */

/**
 * Normalize a title for comparison.
 * Strips subtitles (after colon/dash), lowercases, removes punctuation.
 * @param {string} title
 * @returns {string}
 */
function normalizeTitle(title) {
  return title
    .split(':')[0] // strip subtitle after colon
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[^\w\s']/g, '') // remove punctuation except apostrophes
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @typedef {import('./csv-parser.mjs').BookEntry} BookEntry
 *
 * @typedef {Object} UniqueBook
 * @property {string} id - Normalized title used as key
 * @property {string} title - Display title (from first occurrence)
 * @property {string} author - Author (from first occurrence)
 * @property {number} year - Lowest publicationYear across duplicates
 * @property {string} primaryDiscipline - Discipline from first CSV occurrence
 * @property {string} level - Level from first CSV occurrence
 * @property {string[]} allDisciplines - All disciplines this book appears under
 * @property {string[]} allCategories - All CSV categories
 * @property {number[]} csvRows - All CSV row numbers
 * @property {number} listPosition - List position from first occurrence
 * @property {string} notes - Notes from first occurrence
 */

/**
 * Deduplicate book entries by normalized title.
 * @param {BookEntry[]} entries
 * @returns {{ unique: UniqueBook[], duplicateCount: number, duplicateGroups: Map<string, BookEntry[]> }}
 */
export function deduplicateBooks(entries) {
  /** @type {Map<string, BookEntry[]>} */
  const groups = new Map();

  for (const entry of entries) {
    const key = normalizeTitle(entry.title);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(entry);
  }

  const unique = [];
  let duplicateCount = 0;
  const duplicateGroups = new Map();

  for (const [key, group] of groups) {
    const first = group[0];

    // Use lowest year across duplicates (conservative for schema validation)
    const minYear = Math.min(...group.map((e) => e.year));

    // Collect all unique disciplines and categories
    const allDisciplines = [...new Set(group.map((e) => e.discipline))];
    const allCategories = [...new Set(group.map((e) => e.category))];
    const csvRows = group.map((e) => e.csvRow);

    unique.push({
      id: key,
      title: first.title,
      author: first.author,
      year: minYear,
      primaryDiscipline: first.discipline,
      level: first.level,
      allDisciplines,
      allCategories,
      csvRows,
      listPosition: first.listPosition,
      notes: first.notes,
    });

    if (group.length > 1) {
      duplicateCount += group.length - 1;
      duplicateGroups.set(key, group);
    }
  }

  return { unique, duplicateCount, duplicateGroups };
}

export { normalizeTitle };
