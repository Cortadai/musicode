import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('sidebar links navigate to correct pages', async ({ page }) => {
    // Albums (already on it)
    await expect(page.getByText('Albums').first()).toBeVisible();

    // Artists
    await page.getByRole('link', { name: 'Artists', exact: true }).click();
    await expect(page).toHaveURL('/artists');
    await expect(page.locator('a[href^="/artists/"]').first()).toBeVisible({ timeout: 5_000 });

    // Tracks
    await page.getByRole('link', { name: 'Tracks' }).click();
    await expect(page).toHaveURL('/tracks');
    await expect(page.locator('[class*="cursor-pointer"]').first()).toBeVisible({ timeout: 5_000 });

    // Search
    await page.getByRole('link', { name: 'Search' }).click();
    await expect(page).toHaveURL('/search');
    await expect(page.getByText(/type something/i)).toBeVisible({ timeout: 5_000 });

    // Settings (admin only)
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL('/settings');

    // Users (admin only)
    await page.getByRole('link', { name: 'Users' }).click();
    await expect(page).toHaveURL('/users');
  });

  test('tracks page shows track list with durations', async ({ page }) => {
    await page.getByRole('link', { name: 'Tracks', exact: true }).click();
    await page.waitForURL('/tracks');

    // Track rows contain durations in format "X:XX"
    const trackRow = page.locator('[class*="cursor-pointer"]').filter({ hasText: /\d+:\d{2}/ }).first();
    await expect(trackRow).toBeVisible({ timeout: 10_000 });
  });

  test('full browse flow: artists → artist → album → play track', async ({ page }) => {
    // Start at artists
    await page.getByRole('link', { name: 'Artists', exact: true }).click();
    await page.waitForURL('/artists');

    // Click first artist
    await page.locator('a[href^="/artists/"]').first().click();
    await page.waitForURL(/\/artists\/\d+/);
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // Click an album from the artist page (if albums are shown as cards)
    const albumLink = page.locator('a[href^="/albums/"]').first();
    if (await albumLink.isVisible().catch(() => false)) {
      await albumLink.click();
      await page.waitForURL(/\/albums\/\d+/);

      // Click a track to play
      const trackRow = page.locator('[class*="cursor-pointer"]').filter({ hasText: /\d+:\d{2}/ }).first();
      if (await trackRow.isVisible().catch(() => false)) {
        await trackRow.click();
        // Player bar should appear
        await expect(page.locator('[class*="animate-slide-up"]')).toBeVisible({ timeout: 5_000 });
      }
    }
  });
});
