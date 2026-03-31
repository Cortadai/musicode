---
estimated_steps: 11
estimated_files: 4
skills_used: []
---

# T03: CI config + documentation + final verification

1. Update playwright.config.ts for CI:
   - retries: 2 in CI, 0 in local
   - reporter: html + list
   - screenshot: only-on-failure
   - trace: retain-on-failure
2. Add .gitignore entries for test-results/, playwright-report/
3. Update musicode-ui/README.md with E2E test instructions
4. Update root README.md with E2E section
5. Run full suite: npx playwright test — all pass
6. Run existing tests: npm run test:coverage, verify no regressions
7. Commit all

## Inputs

- `Existing playwright.config.ts`

## Expected Output

- `Updated playwright.config.ts`
- `Updated READMEs`
- `Updated .gitignore`

## Verification

npx playwright test passes headless. npm run test:coverage passes. git diff shows no unexpected changes.
