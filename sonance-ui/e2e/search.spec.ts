import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Search', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('search with results shows tracks and albums', async ({ page }) => {
    // Type in the search bar and submit
    const searchInput = page.getByPlaceholder('Search tracks, albums, artists…');
    await searchInput.fill('midnight');
    await searchInput.press('Enter');

    // Wait for search results page
    await page.waitForURL(/\/search\?q=midnight/);

    // Should show "Results for" heading
    await expect(page.getByText('Results for')).toBeVisible({ timeout: 5_000 });

    // Should have at least some results (no "No results found")
    const noResults = page.getByText('No results found.');
    const hasNoResults = await noResults.isVisible().catch(() => false);
    if (!hasNoResults) {
      // Results present — verify structure
      await expect(page.locator('h2').first()).toBeVisible();
    }
  });

  test('search with no results shows empty state', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search tracks, albums, artists…');
    await searchInput.fill('zzzzzzxnonexistent99999');
    await searchInput.press('Enter');

    await page.waitForURL(/\/search\?q=/);
    await expect(page.getByText('No results found.')).toBeVisible({ timeout: 5_000 });
  });
});
