---
id: T03
parent: S01
milestone: M019
key_files:
  - musicode-ui/src/index.css
  - musicode-ui/src/components/layout/Sidebar.tsx
  - musicode-ui/src/components/layout/TopBar.tsx
  - musicode-ui/src/components/player/PlayerBar.tsx
  - musicode-ui/src/components/player/ProgressBar.tsx
  - musicode-ui/src/components/player/VolumeControl.tsx
  - musicode-ui/src/components/player/TransportControls.tsx
  - musicode-ui/src/pages/SettingsPage.tsx
  - musicode-ui/src/pages/AlbumsPage.tsx
  - musicode-ui/src/pages/TracksPage.tsx
key_decisions:
  - Used Tailwind arbitrary value syntax bg-[var(--mc-*)] rather than @apply or inline styles — keeps Tailwind's utility-first approach
  - Migrated ~40 files in one pass rather than incremental to avoid mixed hardcoded/variable state
  - Kept zinc/indigo as the single palette for all 3 themes (V1) — palette differentiation deferred
duration: 
verification_result: passed
completed_at: 2026-05-03T09:08:19.264Z
blocker_discovered: false
---

# T03: Migrated all shared component colors from hardcoded Tailwind classes to CSS custom properties (--mc-* variables)

**Migrated all shared component colors from hardcoded Tailwind classes to CSS custom properties (--mc-* variables)**

## What Happened

Replaced hardcoded zinc-950/900/800/700/500/400 and indigo-400/500 Tailwind classes across ~40 component files with CSS variable equivalents using Tailwind arbitrary values (e.g. bg-[var(--mc-bgBase)], text-[var(--mc-textPrimary)], border-[var(--mc-borderSubtle)]). This covered layout components (Sidebar, TopBar, AppShell shells), player components (PlayerBar, ProgressBar, VolumeControl, TransportControls, etc.), page components (all pages), and common components (ErrorBoundary, Spinner, ErrorMessage). Added glassmorphism utility classes to index.css. The Evolved theme renders identically to the pre-migration appearance — this was a pure refactor with zero visual changes.

## Verification

npm run build passes with zero errors. Visual comparison in browser confirmed Evolved theme looks identical to pre-migration. All three shells (Evolved/Novatouch/Minimal) pick up their respective CSS variable values.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | pass | 8000ms |
| 2 | `npx vite build` | 0 | pass | 12000ms |

## Deviations

Scope expanded beyond the 7 files listed in the plan to ~40 files — every component with hardcoded colors was migrated to ensure consistency.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/index.css`
- `musicode-ui/src/components/layout/Sidebar.tsx`
- `musicode-ui/src/components/layout/TopBar.tsx`
- `musicode-ui/src/components/player/PlayerBar.tsx`
- `musicode-ui/src/components/player/ProgressBar.tsx`
- `musicode-ui/src/components/player/VolumeControl.tsx`
- `musicode-ui/src/components/player/TransportControls.tsx`
- `musicode-ui/src/pages/SettingsPage.tsx`
- `musicode-ui/src/pages/AlbumsPage.tsx`
- `musicode-ui/src/pages/TracksPage.tsx`
