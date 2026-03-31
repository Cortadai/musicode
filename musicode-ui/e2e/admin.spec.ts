import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Admin User Management', () => {
  const testUsername = `e2etest${Date.now()}`;
  const testPassword = 'testpass123';

  test('create, verify, and delete a user', async ({ page }) => {
    await login(page);

    // Navigate to users page
    await page.getByRole('link', { name: 'Users', exact: true }).click();
    await page.waitForURL('/users');

    // Fill the create user form
    await page.getByPlaceholder('Username').fill(testUsername);
    await page.getByPlaceholder('Password').fill(testPassword);
    // Click create button
    await page.getByRole('button', { name: /create user/i }).click();

    // Verify user appears in the list
    await expect(page.getByText(testUsername, { exact: true })).toBeVisible({ timeout: 5_000 });

    // Delete the test user
    const userRow = page.locator('div[class*="rounded-lg"]').filter({ hasText: testUsername }).first();
    await userRow.getByTitle('Delete user').click();

    // Verify user is removed from the list
    await expect(page.getByText(testUsername, { exact: true })).not.toBeVisible({ timeout: 5_000 });
  });

  test('cannot delete own admin account', async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: 'Users', exact: true }).click();
    await page.waitForURL('/users');

    // Find the admin row and try to delete
    const adminRow = page.locator('div[class*="rounded-lg"]').filter({ hasText: 'admin' }).filter({ hasText: 'ADMIN' }).first();
    await adminRow.getByTitle('Delete user').click();

    // Should show an error message about not being able to delete own account
    await expect(page.getByText(/cannot delete/i)).toBeVisible({ timeout: 5_000 });
  });
});
