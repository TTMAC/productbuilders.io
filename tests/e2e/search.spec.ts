import { test, expect } from '@playwright/test';

test.describe('Search', () => {
  test('search toggle button exists in header', async ({ page }) => {
    await page.goto('/');

    // At least one search toggle should exist
    const searchToggles = page.locator('.search-toggle');
    const count = await searchToggles.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('search panel expands on toggle click', async ({ page }) => {
    await page.goto('/');

    // Use the desktop search container
    const desktopContainer = page.locator('header .hidden.md\\:flex .search-container');
    const searchToggle = desktopContainer.locator('.search-toggle');
    const searchPanel = desktopContainer.locator('.search-panel');

    // Panel initially hidden
    await expect(searchPanel).toBeHidden();

    // Click toggle to open
    await searchToggle.click();
    await expect(searchPanel).toBeVisible();

    // Search input should be focused
    const searchInput = desktopContainer.locator('.search-input');
    await expect(searchInput).toBeFocused();
  });

  test('search panel closes on Escape key', async ({ page }) => {
    await page.goto('/');

    const desktopContainer = page.locator('header .hidden.md\\:flex .search-container');
    const searchToggle = desktopContainer.locator('.search-toggle');
    const searchPanel = desktopContainer.locator('.search-panel');

    // Open search
    await searchToggle.click();
    await expect(searchPanel).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');
    await expect(searchPanel).toBeHidden();
  });

  test('search panel closes on click outside', async ({ page }) => {
    await page.goto('/');

    const desktopContainer = page.locator('header .hidden.md\\:flex .search-container');
    const searchToggle = desktopContainer.locator('.search-toggle');
    const searchPanel = desktopContainer.locator('.search-panel');

    // Open search
    await searchToggle.click();
    await expect(searchPanel).toBeVisible();

    // Click outside (on the hero heading)
    await page.locator('section h1').click();
    await expect(searchPanel).toBeHidden();
  });

  test('full search page loads', async ({ page }) => {
    await page.goto('/search/');

    await expect(page.locator('h1')).toContainText('Search');

    // The search container div exists
    await expect(page.locator('#search')).toHaveCount(1);
  });
});
