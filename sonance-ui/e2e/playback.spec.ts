import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Audio Playback', () => {
  test('clicking a track shows player bar with track info', async ({ page }) => {
    await login(page);

    // Navigate to first album detail to see tracks
    await page.locator('a[href^="/albums/"]').first().click();
    await page.waitForURL(/\/albums\/\d+/);

    // Wait for tracks to load — track rows have cursor-pointer and duration text
    const trackRow = page.locator('[class*="cursor-pointer"]').filter({ hasText: /\d+:\d{2}/ }).first();
    await expect(trackRow).toBeVisible({ timeout: 10_000 });

    // Get the track title before clicking
    const trackTitle = await trackRow.locator('p').first().textContent();

    // Click the track row to start playback
    await trackRow.click();

    // Player bar slides up with the track info — has animate-slide-up class
    const playerBar = page.locator('[class*="animate-slide-up"]');
    await expect(playerBar).toBeVisible({ timeout: 5_000 });

    // Verify the player bar contains the track title
    if (trackTitle) {
      await expect(playerBar.getByText(trackTitle.trim().substring(0, 20), { exact: false })).toBeVisible({ timeout: 3_000 });
    }

    // Verify playback controls are visible (pause button means audio is playing)
    // The pause icon SVG appears when isPlaying is true
    const pauseButton = playerBar.locator('button').filter({ has: page.locator('svg') });
    await expect(pauseButton.first()).toBeVisible();
  });
});
