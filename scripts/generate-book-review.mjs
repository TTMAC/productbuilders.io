#!/usr/bin/env node

/**
 * Weekly Book Review Generator — Orchestration Script
 *
 * Modes:
 *   --init       Parse CSV, deduplicate, detect existing reviews, create progress file
 *   --dry-run    Show next book without generating
 *   --status     Show progress statistics
 *   --csv-row N  Generate specific book by CSV row number
 *   (default)    Generate next scheduled review via `claude -p` CLI
 */

import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { parseBooksCSV } from './lib/csv-parser.mjs';
import { deduplicateBooks, normalizeTitle } from './lib/book-deduplicator.mjs';
import {
  checkDeferral,
  getNextBook,
  previewSchedule,
  DISCIPLINE_ORDER,
  SCHEMA_MAX_YEAR,
} from './lib/scheduler.mjs';
import {
  loadProgress,
  saveProgress,
  buildProgressMap,
  markInProgress,
  markReviewed,
  markFailed,
  getProgressPath,
  SCHEMA_VERSION,
} from './lib/progress-tracker.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const BOOKS_DIR = resolve(ROOT, 'src/content/books');
const PROGRESS_PATH = getProgressPath();

// ─── CLI Argument Parsing ────────────────────────────────────────────────

const args = process.argv.slice(2);
const flags = {
  init: args.includes('--init'),
  dryRun: args.includes('--dry-run'),
  status: args.includes('--status'),
  csvRow: null,
};

const csvRowIdx = args.indexOf('--csv-row');
if (csvRowIdx !== -1 && args[csvRowIdx + 1]) {
  flags.csvRow = parseInt(args[csvRowIdx + 1], 10);
}

// ─── Init Mode ───────────────────────────────────────────────────────────

async function init() {
  console.log('Initializing book review progress tracker...\n');

  // 1. Parse CSV
  const { entries } = parseBooksCSV();
  console.log(`Parsed ${entries.length} entries from CSV`);

  // 2. Deduplicate
  const { unique, duplicateCount, duplicateGroups } = deduplicateBooks(entries);
  console.log(`Found ${unique.length} unique books (${duplicateCount} duplicates across categories)`);

  if (duplicateGroups.size > 0) {
    console.log('\nDuplicate books (appear in multiple categories):');
    for (const [key, group] of duplicateGroups) {
      const cats = group.map((e) => e.category).join(', ');
      console.log(`  - "${group[0].title}" -> ${cats}`);
    }
  }

  // 3. Detect existing reviews
  const existingReviews = detectExistingReviews();
  console.log(`\nDetected ${existingReviews.size} existing review(s) in ${BOOKS_DIR}`);
  for (const [slug, file] of existingReviews) {
    console.log(`  - ${file} (slug: "${slug}")`);
  }

  // 4. Check deferrals
  const deferred = [];
  for (const book of unique) {
    const deferral = checkDeferral(book);
    if (deferral.deferred) {
      deferred.push({
        id: book.id,
        title: book.title,
        author: book.author,
        year: book.year,
        deferUntilYear: book.year + 5,
        reason: deferral.reason,
      });
    }
  }

  console.log(`\nDeferred books (publicationYear > ${SCHEMA_MAX_YEAR}): ${deferred.length}`);
  for (const d of deferred) {
    console.log(`  - "${d.title}" (${d.year}) — eligible in ${d.deferUntilYear}`);
  }

  // 5. Build progress entries
  const books = unique.map((book) => {
    const deferral = checkDeferral(book);
    const slug = titleToSlug(book.title);
    const isReviewed = existingReviews.has(slug);

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      year: book.year,
      discipline: book.primaryDiscipline,
      level: book.level,
      allDisciplines: book.allDisciplines,
      csvRows: book.csvRows,
      listPosition: book.listPosition,
      status: isReviewed ? 'reviewed' : deferral.deferred ? 'deferred' : 'pending',
      ...(isReviewed && {
        reviewFile: `src/content/books/${existingReviews.get(slug)}`,
        reviewDate: existingReviews.get(slug).substring(0, 10),
        weekNumber: 0, // Pre-existing, no week number
      }),
    };
  });

  // 6. Create progress file
  const progress = {
    schemaVersion: SCHEMA_VERSION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    summary: {},
    books,
    deferred,
  };

  saveProgress(progress);

  // 7. Summary
  const reviewed = books.filter((b) => b.status === 'reviewed').length;
  const pending = books.filter((b) => b.status === 'pending').length;
  const deferredCount = books.filter((b) => b.status === 'deferred').length;

  console.log('\n--- Initialization Complete ---');
  console.log(`Total unique books: ${unique.length}`);
  console.log(`  Pending:  ${pending}`);
  console.log(`  Reviewed: ${reviewed}`);
  console.log(`  Deferred: ${deferredCount}`);
  console.log(`\nProgress file: ${PROGRESS_PATH}`);
  console.log(`\nEstimated timeline: ~${Math.ceil(pending / 52)} years ${pending % 52} weeks (1/week)`);
}

// ─── Dry Run Mode ────────────────────────────────────────────────────────

function dryRun() {
  const progress = loadProgress();
  const progressMap = buildProgressMap(progress);

  // Reconstruct unique books from progress
  const uniqueBooks = progress.books.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    year: b.year,
    primaryDiscipline: b.discipline,
    level: b.level,
    allDisciplines: b.allDisciplines || [b.discipline],
    csvRows: b.csvRows,
    listPosition: b.listPosition,
    notes: '',
  }));

  const next = getNextBook(uniqueBooks, progressMap);

  if (!next) {
    console.log('All books have been reviewed or deferred!');
    return;
  }

  console.log('--- Next Book to Review ---');
  console.log(`Title:      "${next.book.title}"`);
  console.log(`Author:     ${next.book.author}`);
  console.log(`Year:       ${next.book.year}`);
  console.log(`Discipline: ${next.discipline}`);
  console.log(`Level:      ${next.book.level}`);
  console.log(`Week #:     ${next.weekNumber}`);
  console.log(`CSV Row(s): ${next.book.csvRows.join(', ')}`);

  if (next.book.allDisciplines.length > 1) {
    console.log(`Also in:    ${next.book.allDisciplines.join(', ')}`);
  }

  console.log('\nUpcoming schedule (next 10):');
  const upcoming = previewSchedule(uniqueBooks, progressMap, 10);
  for (const item of upcoming) {
    console.log(
      `  Week ${String(item.weekNumber).padStart(3)}: [${item.discipline.padEnd(11)}] "${item.book.title}" (${item.book.level})`,
    );
  }
}

// ─── Status Mode ─────────────────────────────────────────────────────────

function status() {
  const progress = loadProgress();

  console.log('--- Book Review Progress ---');
  console.log(`Last updated: ${progress.updatedAt}`);
  console.log();

  const { summary } = progress;
  const total = summary.total || progress.books.length;

  console.log(`Total: ${total}`);
  console.log(`  Reviewed: ${summary.reviewed || 0}`);
  console.log(`  Pending:  ${summary.pending || 0}`);
  console.log(`  Deferred: ${summary.deferred || 0}`);
  console.log(`  Failed:   ${summary.failed || 0}`);
  console.log(`  Skipped:  ${summary.skipped || 0}`);

  // By discipline
  console.log('\nBy Discipline:');
  for (const d of DISCIPLINE_ORDER) {
    const inDiscipline = progress.books.filter((b) => b.discipline === d);
    const reviewed = inDiscipline.filter((b) => b.status === 'reviewed').length;
    console.log(`  ${d.padEnd(12)} ${reviewed}/${inDiscipline.length} reviewed`);
  }

  // By level
  console.log('\nBy Level:');
  for (const level of ['Junior', 'Mid-Level', 'Senior']) {
    const inLevel = progress.books.filter((b) => b.level === level);
    const reviewed = inLevel.filter((b) => b.status === 'reviewed').length;
    console.log(`  ${level.padEnd(12)} ${reviewed}/${inLevel.length} reviewed`);
  }

  // Recent reviews
  const recentReviews = progress.books
    .filter((b) => b.status === 'reviewed' && b.reviewDate)
    .sort((a, b) => (b.reviewDate || '').localeCompare(a.reviewDate || ''))
    .slice(0, 5);

  if (recentReviews.length > 0) {
    console.log('\nRecent Reviews:');
    for (const r of recentReviews) {
      console.log(`  ${r.reviewDate} — "${r.title}" (Week ${r.weekNumber})`);
    }
  }

  // Deferred
  if (progress.deferred.length > 0) {
    console.log('\nDeferred Books:');
    for (const d of progress.deferred) {
      console.log(`  "${d.title}" (${d.year}) — eligible in ${d.deferUntilYear}`);
    }
  }

  // Remaining estimate
  const remaining = (summary.pending || 0) + (summary.failed || 0);
  if (remaining > 0) {
    const years = Math.floor(remaining / 52);
    const weeks = remaining % 52;
    console.log(`\nRemaining: ${remaining} books (~${years}y ${weeks}w at 1/week)`);
  }
}

// ─── Generate Mode ───────────────────────────────────────────────────────

async function generate(csvRow) {
  // Pre-flight: check Claude CLI
  if (!isClaudeCliAvailable()) {
    console.error('Error: Claude Code CLI not found.');
    console.error('Install it: npm install -g @anthropic-ai/claude-code');
    console.error('Or see: https://docs.anthropic.com/en/docs/claude-code');
    process.exit(1);
  }

  const progress = loadProgress();
  const progressMap = buildProgressMap(progress);

  let targetBook;
  let weekNumber;

  if (csvRow !== null) {
    // Find book by CSV row
    const match = progress.books.find((b) => b.csvRows.includes(csvRow));
    if (!match) {
      console.error(`Error: No book found at CSV row ${csvRow}`);
      process.exit(1);
    }
    if (match.status === 'reviewed') {
      console.error(`Error: "${match.title}" already reviewed (${match.reviewFile})`);
      process.exit(1);
    }
    if (match.status === 'deferred') {
      console.error(`Error: "${match.title}" is deferred (year ${match.year} > ${SCHEMA_MAX_YEAR})`);
      process.exit(1);
    }
    targetBook = match;
    weekNumber = (progress.summary.reviewed || 0) + 1;
  } else {
    // Get next from scheduler
    const uniqueBooks = progress.books.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      year: b.year,
      primaryDiscipline: b.discipline,
      level: b.level,
      allDisciplines: b.allDisciplines || [b.discipline],
      csvRows: b.csvRows,
      listPosition: b.listPosition,
      notes: '',
    }));

    const next = getNextBook(uniqueBooks, progressMap);
    if (!next) {
      console.log('All books have been reviewed or deferred!');
      process.exit(0);
    }
    targetBook = progress.books.find((b) => b.id === next.book.id);
    weekNumber = next.weekNumber;
  }

  console.log(`\n--- Generating Review ---`);
  console.log(`Title:      "${targetBook.title}"`);
  console.log(`Author:     ${targetBook.author}`);
  console.log(`Discipline: ${targetBook.discipline}`);
  console.log(`Level:      ${targetBook.level}`);
  console.log(`Week #:     ${weekNumber}`);
  console.log(`CSV Row(s): ${targetBook.csvRows.join(', ')}`);
  console.log();

  // Mark in_progress
  markInProgress(progress, targetBook.id);

  const csvRowArg = targetBook.csvRows[0];
  const today = new Date().toISOString().split('T')[0];
  const slug = titleToSlug(targetBook.title);
  const expectedFile = `src/content/books/${today}-${slug}.md`;

  try {
    console.log(`Invoking Claude Code CLI to draft review (CSV row #${csvRowArg})...`);
    console.log(`Expected output: ${expectedFile}\n`);

    // Invoke the /draft-book skill via claude CLI
    const command = `claude -p "/draft-book #${csvRowArg}"`;
    execSync(command, {
      cwd: ROOT,
      stdio: 'inherit',
      timeout: 5 * 60 * 1000, // 5 minute timeout
    });

    // Verify the file was created
    const fullPath = resolve(ROOT, expectedFile);
    if (!existsSync(fullPath)) {
      // Try to find any file created today with this slug
      const alternateFile = findReviewFile(slug, today);
      if (alternateFile) {
        markReviewed(progress, targetBook.id, alternateFile, weekNumber);
        console.log(`\nReview generated: ${alternateFile}`);
      } else {
        throw new Error(`Generated file not found at ${expectedFile} or any alternate path`);
      }
    } else {
      markReviewed(progress, targetBook.id, expectedFile, weekNumber);
      console.log(`\nReview generated: ${expectedFile}`);
    }

    console.log(`\nNext step: /quality-check ${expectedFile}`);
  } catch (err) {
    const reason = err.killed
      ? 'Claude CLI timed out (>5 minutes)'
      : `Generation failed: ${err.message}`;

    markFailed(progress, targetBook.id, reason);
    console.error(`\nError: ${reason}`);
    console.error('The book has been marked as "failed". It will be retried on the next run.');
    console.error('To retry manually: npm run book:generate');
    process.exit(1);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────

/**
 * Detect existing book review files.
 * @returns {Map<string, string>} slug -> filename
 */
function detectExistingReviews() {
  const reviews = new Map();

  if (!existsSync(BOOKS_DIR)) return reviews;

  const files = readdirSync(BOOKS_DIR).filter((f) => f.endsWith('.md'));
  for (const file of files) {
    // Extract slug from filename: YYYY-MM-DD-slug.md
    const match = file.match(/^\d{4}-\d{2}-\d{2}-(.+)\.md$/);
    if (match) {
      reviews.set(match[1], file);
    }
  }

  return reviews;
}

/**
 * Convert a book title to a kebab-case slug.
 * @param {string} title
 * @returns {string}
 */
function titleToSlug(title) {
  return title
    .split(':')[0] // strip subtitle
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Try to find a review file matching slug and date.
 * @param {string} slug
 * @param {string} date
 * @returns {string|null}
 */
function findReviewFile(slug, date) {
  if (!existsSync(BOOKS_DIR)) return null;

  const files = readdirSync(BOOKS_DIR).filter((f) => f.endsWith('.md'));
  // Try exact match first
  const exact = files.find((f) => f === `${date}-${slug}.md`);
  if (exact) return `src/content/books/${exact}`;

  // Try partial slug match for today
  const partial = files.find((f) => f.startsWith(date) && f.includes(slug.substring(0, 15)));
  if (partial) return `src/content/books/${partial}`;

  return null;
}

/**
 * Check if the Claude Code CLI is available.
 * @returns {boolean}
 */
function isClaudeCliAvailable() {
  try {
    execSync('claude --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// ─── Main ────────────────────────────────────────────────────────────────

async function main() {
  try {
    if (flags.init) {
      await init();
    } else if (flags.dryRun) {
      dryRun();
    } else if (flags.status) {
      status();
    } else {
      await generate(flags.csvRow);
    }
  } catch (err) {
    console.error(`Fatal error: ${err.message}`);
    process.exit(1);
  }
}

main();
