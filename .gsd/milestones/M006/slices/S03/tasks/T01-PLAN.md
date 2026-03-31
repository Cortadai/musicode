---
estimated_steps: 8
estimated_files: 2
skills_used: []
---

# T01: Search + settings E2E tests

1. Write search.spec.ts:
   - Test search with results: type query, verify results appear for tracks/albums/artists
   - Test search click: click a result, verify navigation to detail page
   - Test empty search: search for nonsense, verify empty state message
2. Write settings.spec.ts:
   - Test view settings: login as admin, navigate to /settings
   - Test library folder management if scan is safe in test context
3. Verify tests pass headless

## Inputs

- `SearchPage, SettingsPage components`

## Expected Output

- `musicode-ui/e2e/search.spec.ts`
- `musicode-ui/e2e/settings.spec.ts`

## Verification

npx playwright test e2e/search.spec.ts e2e/settings.spec.ts passes headless.
