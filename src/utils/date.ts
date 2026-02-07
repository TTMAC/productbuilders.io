import { format, parseISO } from 'date-fns';

/**
 * Format a date using date-fns
 * @param date - Date object or ISO string
 * @param formatString - Format pattern (default: 'MMM dd, yyyy')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  formatString: string = 'MMM dd, yyyy'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
}

/**
 * Sort items by publishDate in descending order (newest first) or ascending
 * @param items - Array of items with data.publishDate
 * @param order - Sort order: 'desc' (default) or 'asc'
 * @returns Sorted array (new array, doesn't mutate original)
 */
export function sortByDate<T extends { data: { publishDate: Date } }>(
  items: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const diff = b.data.publishDate.getTime() - a.data.publishDate.getTime();
    return order === 'desc' ? diff : -diff;
  });
}
