import { test, expect } from '@playwright/test';

test.describe('Newsletter Signup', () => {
  test('newsletter form is present on homepage', async ({ page }) => {
    await page.goto('/');

    const form = page.locator('#newsletter-form');
    await expect(form).toBeVisible();

    // Email input
    await expect(form.locator('input[type="email"]')).toBeVisible();

    // Submit button
    await expect(form.locator('button[type="submit"]')).toContainText('Subscribe');

    // Discipline selector
    await expect(form.locator('select[name="discipline"]')).toBeVisible();
  });

  test('newsletter form is present on subscribe page', async ({ page }) => {
    await page.goto('/subscribe/');

    await expect(page.locator('h1')).toContainText('Subscribe');

    const form = page.locator('#newsletter-form');
    await expect(form).toBeVisible();
    await expect(form.locator('input[type="email"]')).toBeVisible();
    await expect(form.locator('button[type="submit"]')).toBeVisible();
  });

  test('email input has required validation', async ({ page }) => {
    await page.goto('/subscribe/');

    const emailInput = page.locator('#newsletter-form input[type="email"]');

    // Input has required attribute
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('discipline selector has correct options', async ({ page }) => {
    await page.goto('/subscribe/');

    const select = page.locator('select[name="discipline"]');
    const options = select.locator('option');

    await expect(options).toHaveCount(4); // Select..., PM, Design, Engineering
    await expect(options.nth(0)).toHaveText('Select...');
    await expect(options.nth(1)).toHaveText('Product Management');
    await expect(options.nth(2)).toHaveText('Design');
    await expect(options.nth(3)).toHaveText('Engineering');
  });
});
