import { test, expect } from '@playwright/test';
import { login, logout } from './helpers';

test.describe('Authentication', () => {
  test('login with valid credentials', async ({ page }) => {
    await login(page);
    // Should be on albums page with sidebar visible
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByText('admin', { exact: true })).toBeVisible();
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();
    // Should stay on login page and show error
    await expect(page).toHaveURL('/login');
    await expect(page.getByText(/invalid|error|incorrect/i)).toBeVisible({ timeout: 5_000 });
  });

  test('logout redirects to login page', async ({ page }) => {
    await login(page);
    await logout(page);
    await expect(page).toHaveURL('/login');
    // Verify we can't access protected pages
    await page.goto('/');
    await expect(page).toHaveURL('/login');
  });
});
