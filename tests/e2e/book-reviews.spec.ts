import { test, expect } from '@playwright/test';

test.describe('Book Reviews Index Page', () => {
  test('books index page loads with published reviews', async ({ page }) => {
    await page.goto('/books');

    await expect(page.locator('h1')).toHaveText('Book Reviews');
    // Should show book count
    await expect(page.locator('text=/\\d+ book review/')).toBeVisible();

    // Should have book cards
    const cards = page.locator('article');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('discipline filter works on books page', async ({ page }) => {
    await page.goto('/books');

    // Click PM filter
    await page.click('a:has-text("Product Management")');
    await expect(page).toHaveURL(/discipline=PM/);

    // PM filter button should be active (blue)
    const pmBtn = page.locator('.filter-btn[data-filter-value="PM"]');
    await expect(pmBtn).toHaveClass(/bg-blue-600/);

    // Cards should still be visible (both books are PM)
    const visibleCards = page.locator('.book-card:visible');
    const count = await visibleCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('discipline filter hides non-matching cards', async ({ page }) => {
    await page.goto('/books?discipline=Design');

    // No Design books exist — all cards should be hidden
    const visibleCards = page.locator('.book-card:visible');
    const count = await visibleCards.count();
    expect(count).toBe(0);

    // Empty state should be visible
    await expect(page.locator('#empty-state')).toBeVisible();

    // Count should say 0
    await expect(page.locator('#book-count')).toHaveText('0 book reviews');
  });

  test('level filter works on books page', async ({ page }) => {
    await page.goto('/books');

    // Click Junior filter
    await page.click('a:has-text("Junior")');
    await expect(page).toHaveURL(/level=Junior/);

    // Junior filter button should be active (dark)
    const juniorBtn = page.locator('.filter-btn[data-filter-value="Junior"]');
    await expect(juniorBtn).toHaveClass(/bg-gray-800/);

    // Cards should still be visible (both books are Junior)
    const visibleCards = page.locator('.book-card:visible');
    const count = await visibleCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('combined filters preserve both params', async ({ page }) => {
    await page.goto('/books?discipline=PM&level=Junior');

    // Both filters should be active
    await expect(page.locator('.filter-btn[data-filter-value="PM"]')).toHaveClass(/bg-blue-600/);
    await expect(page.locator('.filter-btn[data-filter-value="Junior"]')).toHaveClass(/bg-gray-800/);

    // Discipline filter links should preserve level param
    const designLink = page.locator('.filter-btn[data-filter-value="Design"]');
    const href = await designLink.getAttribute('href');
    expect(href).toContain('level=Junior');
  });

  test('books are sorted by rating descending', async ({ page }) => {
    await page.goto('/books');

    // Get all rating displays from cards
    const ratingTexts = page.locator('article span:has-text("/5)")');
    const count = await ratingTexts.count();

    if (count >= 2) {
      const ratings: number[] = [];
      for (let i = 0; i < count; i++) {
        const text = await ratingTexts.nth(i).textContent();
        const match = text?.match(/\((\d)\/5\)/);
        if (match) ratings.push(parseInt(match[1]));
      }

      // Verify descending order
      for (let i = 0; i < ratings.length - 1; i++) {
        expect(ratings[i]).toBeGreaterThanOrEqual(ratings[i + 1]);
      }
    }
  });
});

test.describe('Individual Book Review Page', () => {
  const bookUrl = '/books/2026-01-10-inspired/';

  test('book review page renders correctly', async ({ page }) => {
    await page.goto(bookUrl);

    // Title
    await expect(page.locator('article h1')).toBeVisible();

    // Author in header
    await expect(page.locator('article header').locator('text=By Marty Cagan')).toBeVisible();

    // Rating stars in header
    await expect(page.locator('article header div[title*="out of 5 stars"]')).toBeVisible();

    // Discipline badge in header
    await expect(page.locator('article header span[class*="badge-pm"]')).toBeVisible();

    // Level badge in header
    await expect(page.locator('article header span.badge-level')).toBeVisible();

    // Reading time
    await expect(page.locator('text=/\\d+ min read/')).toBeVisible();
  });

  test('cross-functional value callout is displayed', async ({ page }) => {
    await page.goto(bookUrl);

    await expect(page.locator('text=Cross-Functional Value')).toBeVisible();
  });

  test('key takeaways section is displayed', async ({ page }) => {
    await page.goto(bookUrl);

    await expect(page.locator('h3:has-text("Key Takeaways")')).toBeVisible();

    // Should have 3-5 takeaways
    const takeaways = page.locator('h3:has-text("Key Takeaways") + ul li');
    const count = await takeaways.count();
    expect(count).toBeGreaterThanOrEqual(3);
    expect(count).toBeLessThanOrEqual(5);
  });

  test('who should read section is displayed', async ({ page }) => {
    await page.goto(bookUrl);

    await expect(page.locator('h4:has-text("Who Should Read This")')).toBeVisible();
  });

  test('affiliate link is displayed', async ({ page }) => {
    await page.goto(bookUrl);

    const purchaseLink = page.locator('a:has-text("Purchase on Amazon")');
    await expect(purchaseLink).toBeVisible();
    await expect(purchaseLink).toHaveAttribute('target', '_blank');
    await expect(purchaseLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('navigation from card to detail page works', async ({ page }) => {
    await page.goto('/books');

    // Click on the first "Read review" link
    const firstReviewLink = page.locator('a:has-text("Read review")').first();
    await firstReviewLink.click();

    // Should be on a book detail page
    await expect(page).toHaveURL(/\/books\//);
    await expect(page.locator('article h1')).toBeVisible();
  });

  test('back to book reviews link works', async ({ page }) => {
    await page.goto(bookUrl);

    const backLink = page.locator('article footer a[href="/books"]');
    await backLink.click();
    await expect(page).toHaveURL(/\/books/);
  });

  test('social share buttons are present', async ({ page }) => {
    await page.goto(bookUrl);

    const footer = page.locator('article footer');
    await expect(footer.locator('text=Share:')).toBeVisible();
    await expect(footer.locator('a[aria-label="Share on Twitter"]')).toBeVisible();
    await expect(footer.locator('a[aria-label="Share on LinkedIn"]')).toBeVisible();
  });

  test('newsletter CTA appears below book review', async ({ page }) => {
    await page.goto(bookUrl);

    const forms = page.locator('#newsletter-form');
    await expect(forms.first()).toBeVisible();
  });
});
