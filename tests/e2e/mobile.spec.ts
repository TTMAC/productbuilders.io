import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test.describe('Mobile Experience', () => {
  test('hamburger menu toggles mobile navigation', async ({ page }) => {
    await page.goto('/');

    const menuButton = page.locator('#mobile-menu-button');
    const mobileMenu = page.locator('#mobile-menu');

    // Menu button visible on mobile
    await expect(menuButton).toBeVisible();

    // Mobile menu initially hidden
    await expect(mobileMenu).toBeHidden();

    // Click hamburger to open
    await menuButton.click();
    await expect(mobileMenu).toBeVisible();

    // Nav links visible in mobile menu
    await expect(mobileMenu.locator('a[href="/articles"]')).toBeVisible();
    await expect(mobileMenu.locator('a[href="/books"]')).toBeVisible();
    await expect(mobileMenu.locator('a[href="/about"]')).toBeVisible();
    await expect(mobileMenu.locator('a[href="/subscribe"]')).toBeVisible();

    // Click hamburger again to close
    await menuButton.click();
    await expect(mobileMenu).toBeHidden();
  });

  test('desktop nav is hidden on mobile', async ({ page }) => {
    await page.goto('/');

    // Desktop nav container should not be visible on mobile
    const desktopNav = page.locator('header .hidden.md\\:flex');
    await expect(desktopNav).toBeHidden();
  });

  test('homepage renders in mobile viewport', async ({ page }) => {
    await page.goto('/');

    // Hero title visible
    await expect(page.locator('h1')).toContainText('ProductBuilders.io');

    // Article cards visible
    const firstCard = page.locator('a[href^="/articles/2026"]').first();
    await expect(firstCard).toBeVisible();

    // Viewport is mobile-sized
    const viewportSize = page.viewportSize();
    expect(viewportSize?.width).toBe(390);
  });

  test('article page is readable on mobile', async ({ page }) => {
    await page.goto('/articles/2026-01-15-building-product-roadmaps/');

    // Title visible
    await expect(page.locator('article h1')).toBeVisible();

    // Content visible
    await expect(page.locator('.prose-custom')).toBeVisible();
  });

  test('mobile menu closes when clicking outside', async ({ page }) => {
    await page.goto('/');

    const menuButton = page.locator('#mobile-menu-button');
    const mobileMenu = page.locator('#mobile-menu');

    // Open menu
    await menuButton.click();
    await expect(mobileMenu).toBeVisible();

    // Click outside (on main content area)
    await page.locator('section h1').click();
    await expect(mobileMenu).toBeHidden();
  });

  test('mobile navigation links work', async ({ page }) => {
    await page.goto('/');

    // Open mobile menu
    await page.locator('#mobile-menu-button').click();
    await expect(page.locator('#mobile-menu')).toBeVisible();

    // Navigate to articles
    await page.locator('#mobile-menu a[href="/articles"]').click();
    await expect(page).toHaveURL(/\/articles/);
    await expect(page.locator('h1')).toContainText('Articles');
  });
});
