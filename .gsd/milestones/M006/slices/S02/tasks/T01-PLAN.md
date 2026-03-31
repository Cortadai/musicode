---
estimated_steps: 6
estimated_files: 3
skills_used: []
---

# T01: Install Playwright + project config

1. cd musicode-ui && npm init playwright@latest (Chromium only for now)
2. Configure playwright.config.ts: baseURL http://localhost:5173, webServer for Vite dev, timeout, retries
3. Configure webServer to start Vite dev server automatically
4. Add test:e2e script to package.json
5. Write a smoke test (navigate to /, expect redirect to /login)
6. Run npx playwright test to verify setup

## Inputs

- `musicode-ui/package.json`
- `musicode-ui/vite.config.ts`

## Expected Output

- `musicode-ui/playwright.config.ts`
- `musicode-ui/e2e/ directory`
- `package.json with test:e2e script`
- `Smoke test passing`

## Verification

npx playwright test e2e/smoke.spec.ts passes headless.
