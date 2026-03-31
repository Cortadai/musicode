import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Settings', () => {
  test('admin can view settings page with library folders', async ({ page }) => {
    await login(page);

    // Navigate to settings
    await page.getByRole('link', { name: /settings/i }).click();
    await page.waitForURL('/settings');

    // Should show the settings page with library folder section
    await expect(page.getByText(/library|folders/i).first()).toBeVisible({ timeout: 5_000 });
  });
});
