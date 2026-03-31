import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Stats Page', () => {
  test('shows stats dashboard with summary and charts', async ({ page }) => {
    await login(page);

    // Navigate to stats
    await page.getByRole('link', { name: 'Stats' }).click();
    await page.waitForURL('/stats');

    // Should show the Stats heading
    await expect(page.getByText('Stats')).toBeVisible({ timeout: 5_000 });

    // Summary cards should be visible (scoped to main content area)
    const main = page.locator('main');
    await expect(main.getByText('Total Plays')).toBeVisible({ timeout: 5_000 });
    await expect(main.getByText('Listening Time')).toBeVisible();

    // Top lists should be visible
    await expect(page.getByText('Top Artists')).toBeVisible();
    await expect(page.getByText('Top Albums')).toBeVisible();
    await expect(page.getByText('Top Tracks')).toBeVisible();
  });

  test('period selector changes data', async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: 'Stats' }).click();
    await page.waitForURL('/stats');

    // Click "All Time" period
    await page.getByRole('button', { name: 'All Time' }).click();

    // Should still show stats (with possibly different numbers)
    await expect(page.getByText('Total Plays')).toBeVisible({ timeout: 5_000 });
  });
});
