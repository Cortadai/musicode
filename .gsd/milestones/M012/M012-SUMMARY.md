---
id: M012
title: "Structural Cleanup & CI"
status: complete
completed_at: 2026-04-18T18:47:15.133Z
key_decisions:
  - Kept audio events and play/pause/seek/volume in usePlayer as the irreducible core — only extracted hooks with clear boundaries
  - AlbumsPage stays eager-loaded as the landing page; all other pages lazy
  - GitHub Actions over self-hosted CI (Woodpecker/Jenkins) — lower maintenance for a single developer, 2000 free min/month sufficient
key_files:
  - musicode-ui/src/hooks/usePlayer.ts
  - musicode-ui/src/hooks/useScrobble.ts
  - musicode-ui/src/hooks/useMediaSession.ts
  - musicode-ui/src/hooks/useGapless.ts
  - musicode-ui/src/components/common/ProtectedRoute.tsx
  - musicode-ui/src/App.tsx
  - .github/workflows/ci.yml
lessons_learned:
  - God-hooks are best refactored by identifying data flow boundaries: useScrobble only needs trackId+currentTime+duration, useMediaSession only needs track metadata and callbacks — those clean interfaces were the natural seams
  - React.lazy + Suspense is trivial to add retroactively when routes are already in a single router file — no architectural changes needed
---

# M012: Structural Cleanup & CI

**Decomposed the monolithic usePlayer hook, added role-based route guards with lazy loading, and established GitHub Actions CI pipeline.**

## What Happened

M012 addressed three structural risks identified during the post-M011 gut-check: a god-hook accumulating responsibilities, unprotected admin routes with eager-loaded pages, and zero automated CI.

**S01 — Extract usePlayer into composable hooks:** The 418-LOC `usePlayer.ts` was the most critical file in the frontend — mixing queue management, scrobble reporting, media session sync, and gapless playback logic. Extracted three focused hooks: `useScrobble` (45 LOC, fires POST at 50% threshold), `useMediaSession` (102 LOC, syncs navigator.mediaSession metadata and action handlers), and `useGapless` (155 LOC, dual-element preloading and crossfade transitions). The orchestrator dropped to ~190 LOC of pure wiring. Zero changes to PlayerContext consumers.

**S02 — Lazy routes + role-based guards:** `ProtectedRoute` already had a `requiredRole` prop but it was unused. Wired it to compare against `user.role` from AuthContext. Applied `requiredRole="ADMIN"` to `/settings` and `/users`. Added `React.lazy` code-splitting to all pages except AlbumsPage (the landing page), reducing the initial bundle.

**S03 — GitHub Actions CI:** Added `.github/workflows/ci.yml` with two parallel jobs: backend (Java 21, `mvn -B verify` running 236 tests including WireMock contracts) and frontend (Node 20, `tsc --noEmit` + `vitest --run` + `npm run build`). Triggers on push and pull_request.

## Success Criteria Results



## Definition of Done Results



## Requirement Outcomes



## Deviations

None. All three slices delivered as planned.

## Follow-ups

Lazy loading could be extended to heavy components within pages (e.g., Visualizer, EQ popover) for further bundle reduction. Scrobble status feedback in the UI remains unaddressed (identified in gut-check but out of scope for this milestone).
