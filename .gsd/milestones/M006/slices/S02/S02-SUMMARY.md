---
id: S02
parent: M006
milestone: M006
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["musicode-ui/playwright.config.ts", "musicode-ui/e2e/helpers.ts", "musicode-ui/e2e/login.spec.ts", "musicode-ui/e2e/browse.spec.ts", "musicode-ui/e2e/playback.spec.ts", "musicode-ui/e2e/admin.spec.ts"]
key_decisions:
  - ["Chromium-only for now — Firefox/WebKit can be added later", "Sequential workers (1) to avoid H2 race conditions", "Backend must be started manually — Playwright webServer only starts Vite"]
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-17T19:56:00.182Z
blocker_discovered: false
---

# S02: Playwright E2E — Setup + Core Flows

**Playwright E2E test suite with 11 tests covering auth, browse, playback, and admin flows**

## What Happened

Installed Playwright (Chromium-only), configured sequential execution for shared H2 DB. Built reusable login/logout helpers. Wrote 5 spec files: smoke (1), login (3), browse (4), playback (1), admin (2). Tests cover the critical user journeys: authentication, library browsing, audio playback, and admin user management. All tests pass headless in ~30s. Commit d02e5c9.

## Verification

npx playwright test — 11 core tests pass. Full suite 21/21 pass in 30s.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

None.
