import { test, expect } from '@playwright/test';

test.describe('Article Reading Experience', () => {
  const articleUrl = '/articles/2026-01-15-building-product-roadmaps/';

  test('article page shows metadata', async ({ page }) => {
    await page.goto(articleUrl);

    // Title in article header
    await expect(page.locator('article h1')).toBeVisible();

    // Author in article header
    await expect(page.locator('article header').locator('text=By Tshepo Machele')).toBeVisible();

    // Reading time in article header
    await expect(page.locator('article header').locator('text=/\\d+ min read/')).toBeVisible();

    // Discipline badges in header
    const badges = page.locator('article header span[class*="badge"]');
    await expect(badges.first()).toBeVisible();
  });

  test('progress bar appears on scroll', async ({ page }) => {
    await page.goto(articleUrl);

    const progressBar = page.locator('#reading-progress-bar');
    await expect(progressBar).toHaveAttribute('style', 'width: 0%');

    // Scroll down significantly
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(300);

    // Progress bar should have moved
    const width = await progressBar.evaluate((el) => parseFloat(el.style.width));
    expect(width).toBeGreaterThan(0);
  });

  test('back-to-top button appears after scrolling', async ({ page }) => {
    await page.goto(articleUrl);

    const backToTop = page.locator('#back-to-top');

    // Initially hidden
    await expect(backToTop).toBeHidden();

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    // Should be visible now
    await expect(backToTop).toBeVisible();

    // Click to scroll to top
    await backToTop.click();
    await page.waitForTimeout(1000);

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(50);
  });

  test('social share buttons are present in article footer', async ({ page }) => {
    await page.goto(articleUrl);

    // Share section in article footer
    const footer = page.locator('article footer');
    await expect(footer.locator('text=Share:')).toBeVisible();
    await expect(footer.locator('a[aria-label="Share on Twitter"]')).toBeVisible();
    await expect(footer.locator('a[aria-label="Share on LinkedIn"]')).toBeVisible();
    await expect(footer.locator('button[aria-label="Copy link to clipboard"]')).toBeVisible();
  });

  test('related articles section appears', async ({ page }) => {
    await page.goto(articleUrl);

    await expect(page.locator('h2:text("Related Articles")')).toBeVisible();

    // Count article card elements (not links) inside the related articles grid
    const relatedGrid = page.locator('section:has(> h2:text("Related Articles")) .grid');
    const relatedCards = relatedGrid.locator('> article');
    const count = await relatedCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(3);
  });

  test('newsletter CTA appears below article', async ({ page }) => {
    await page.goto(articleUrl);

    // Newsletter form exists on the page
    const forms = page.locator('#newsletter-form');
    await expect(forms.first()).toBeVisible();
  });

  test('back to articles link works', async ({ page }) => {
    await page.goto(articleUrl);

    const backLink = page.locator('article footer a[href="/articles"]');
    await backLink.click();
    await expect(page).toHaveURL(/\/articles/);
  });
});
