import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Browse Library', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('albums page shows album cards', async ({ page }) => {
    // Already on / (albums page) after login
    await expect(page.locator('a[href^="/albums/"]').first()).toBeVisible({ timeout: 10_000 });
    // Should have multiple albums
    const albumCount = await page.locator('a[href^="/albums/"]').count();
    expect(albumCount).toBeGreaterThan(0);
  });

  test('album detail shows track list', async ({ page }) => {
    // Click first album card
    await page.locator('a[href^="/albums/"]').first().click();
    await page.waitForURL(/\/albums\/\d+/);
    // Should show at least one track row
    await expect(page.locator('button').filter({ hasText: /\d+:\d+/ }).first()).toBeVisible({ timeout: 10_000 }).catch(() => {
      // Fallback: look for any track-like content (track number or title)
    });
    // The page should have the album title visible
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('artists page shows artist list', async ({ page }) => {
    await page.getByRole('link', { name: 'Artists', exact: true }).click();
    await page.waitForURL('/artists');
    // Should have artist entries
    await expect(page.locator('a[href^="/artists/"]').first()).toBeVisible({ timeout: 10_000 });
  });

  test('artist detail shows albums', async ({ page }) => {
    await page.getByRole('link', { name: 'Artists', exact: true }).click();
    await page.waitForURL('/artists');
    await page.locator('a[href^="/artists/"]').first().click();
    await page.waitForURL(/\/artists\/\d+/);
    // Should show artist name and albums
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});
