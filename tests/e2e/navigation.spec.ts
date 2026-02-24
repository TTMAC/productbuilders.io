import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads with hero section and article cards', async ({ page }) => {
    await page.goto('/');

    // Hero section
    await expect(page.locator('section h1')).toContainText('ProductBuilders.tech');
    await expect(page.locator('text=Explore Articles')).toBeVisible();

    // Recent articles section
    await expect(page.locator('text=Recent Articles')).toBeVisible();

    // Article cards are displayed
    const articleCards = page.locator('a[href^="/articles/2026"]');
    await expect(articleCards.first()).toBeVisible();
  });

  test('header nav links navigate to correct pages', async ({ page }) => {
    await page.goto('/');

    // Use desktop nav container for specific targeting
    const desktopNav = page.locator('header .hidden.md\\:flex');

    await desktopNav.locator('a[href="/articles"]').click();
    await expect(page).toHaveURL(/\/articles/);
    await expect(page.locator('h1')).toContainText('Articles');

    await page.locator('header a[href="/books"]').first().click();
    await expect(page).toHaveURL(/\/books/);

    await page.locator('header a[href="/about"]').first().click();
    await expect(page).toHaveURL(/\/about/);

    await page.locator('header a[href="/subscribe"]').first().click();
    await expect(page).toHaveURL(/\/subscribe/);

    // Logo goes home
    await page.locator('header a[href="/"]').first().click();
    await expect(page).toHaveURL('/');
  });

  test('articles page displays article cards', async ({ page }) => {
    await page.goto('/articles/');

    await expect(page.locator('h1')).toContainText('Articles');

    // Article cards are present (12 total articles)
    const cards = page.locator('.grid a[href^="/articles/"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(12);
  });

  test('discipline filter works on articles page', async ({ page }) => {
    await page.goto('/articles/');

    // All filter buttons visible
    await expect(page.locator('a:text("All Disciplines")')).toBeVisible();
    await expect(page.locator('a:text("Product Management")')).toBeVisible();

    // "All Disciplines" should be active by default
    const allBtn = page.locator('.filter-btn[data-filter-value=""]');
    await expect(allBtn).toHaveClass(/bg-blue-600/);

    // Filter by PM discipline
    await page.locator('a[href="/articles?discipline=PM"]').click();
    await expect(page).toHaveURL(/discipline=PM/);

    // PM button should now be active
    const pmBtn = page.locator('.filter-btn[data-filter-value="PM"]');
    await expect(pmBtn).toHaveClass(/bg-blue-600/);

    // Visible cards should only be PM articles
    const visibleCards = page.locator('.article-card:visible');
    const count = await visibleCards.count();
    expect(count).toBeGreaterThan(0);

    // All visible cards should have PM in their disciplines
    for (let i = 0; i < count; i++) {
      const disciplines = await visibleCards.nth(i).getAttribute('data-disciplines');
      expect(disciplines).toContain('PM');
    }
  });

  test('clicking an article card navigates to article page', async ({ page }) => {
    await page.goto('/articles/');

    const firstCard = page.locator('.grid a[href^="/articles/"]').first();
    const href = await firstCard.getAttribute('href');
    await firstCard.click();

    await expect(page).toHaveURL(new RegExp(href!));
    // Article page has a title
    await expect(page.locator('article h1')).toBeVisible();
  });
});
