import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Parse books_to_review.csv into structured BookEntry objects.
 * Hand-rolled CSV parser handles quoted fields (authors with commas).
 */

const CATEGORY_TO_DISCIPLINE = {
  'Product Management': 'PM',
  'UX Design': 'Design',
  'Product Engineering': 'Engineering',
};

/**
 * Parse a single CSV line respecting quoted fields.
 * @param {string} line
 * @returns {string[]}
 */
function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

/**
 * Parse the books_to_review.csv file.
 * @param {string} [csvPath] - Optional path override for testing
 * @returns {{ entries: BookEntry[], headers: string[] }}
 *
 * @typedef {Object} BookEntry
 * @property {number} csvRow - 1-based row number (excluding header)
 * @property {string} title
 * @property {string} author
 * @property {number} year
 * @property {string} category - Raw CSV category
 * @property {string} discipline - Mapped discipline (PM/Design/Engineering)
 * @property {string} level - Junior/Mid-Level/Senior
 * @property {number} listPosition
 * @property {string} notes
 */
export function parseBooksCSV(csvPath) {
  const defaultPath = resolve(
    import.meta.dirname,
    '../../docs/books_to_review.csv',
  );
  const content = readFileSync(csvPath || defaultPath, 'utf-8');
  const lines = content.split('\n').filter((line) => line.trim());

  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows');
  }

  const headers = parseCsvLine(lines[0]);
  const entries = [];

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    if (fields.length < 6) continue; // skip malformed rows

    const category = fields[3];
    const discipline = CATEGORY_TO_DISCIPLINE[category];
    if (!discipline) {
      console.warn(
        `Warning: Unknown category "${category}" at row ${i}, skipping`,
      );
      continue;
    }

    entries.push({
      csvRow: i,
      title: fields[0],
      author: fields[1],
      year: parseInt(fields[2], 10),
      category,
      discipline,
      level: fields[4],
      listPosition: parseInt(fields[5], 10),
      notes: fields[6] || '',
    });
  }

  return { entries, headers };
}
