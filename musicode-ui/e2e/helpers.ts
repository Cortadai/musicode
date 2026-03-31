import { type Page, expect } from '@playwright/test';

/**
 * Login as a user via the UI login form.
 * Waits for the main app shell to appear (sidebar nav with Albums link).
 */
export async function login(page: Page, username = 'admin', password = 'changeme') {
  await page.goto('/login');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  // Wait for the app shell to render — sidebar contains "Albums" link
  await expect(page.getByRole('link', { name: 'Albums' })).toBeVisible({ timeout: 10_000 });
}

/**
 * Logout via the sidebar button.
 */
export async function logout(page: Page) {
  await page.getByRole('button', { name: 'Sign out' }).click();
  // Wait for login page to appear
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible({ timeout: 10_000 });
}
