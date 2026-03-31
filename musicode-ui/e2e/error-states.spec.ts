import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Error States', () => {
  test('accessing a non-existent album shows error', async ({ page }) => {
    await login(page);
    await page.goto('/albums/999999');
    // Should show an error message or a not-found state
    await expect(page.getByText(/not found|error|something went wrong/i).first()).toBeVisible({ timeout: 5_000 });
  });

  test('unauthenticated access redirects to login', async ({ page }) => {
    // Try to access protected routes without login
    await page.goto('/settings');
    await expect(page).toHaveURL('/login');

    await page.goto('/users');
    await expect(page).toHaveURL('/login');

    await page.goto('/tracks');
    await expect(page).toHaveURL('/login');
  });
});
