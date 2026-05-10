import { defineConfig } from '@playwright/test';

/**
 * Playwright E2E test configuration for Musicode.
 *
 * PREREQUISITES: Spring Boot backend must be running on :17380 before tests.
 * The webServer block below starts only the Vite dev server (:17381).
 * Start the backend manually: cd musicode-server && mvn spring-boot:run
 *
 * WHY NOT START BACKEND HERE: Spring Boot takes ~10s to start and requires
 * Maven + Java. Playwright's webServer is designed for lightweight dev servers.
 * Starting both would be fragile and slow.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Sequential — tests share auth state and DB
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker — avoids race conditions on shared H2 DB
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:17381',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'retain-on-failure' : 'off',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:17381',
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
  },
});
