---
id: T04
parent: S01
milestone: M019
key_files:
  - musicode-ui/src/components/common/ThemeSelector.tsx
  - musicode-ui/src/pages/SettingsPage.tsx
  - musicode-ui/src/components/layout/shells/EvolvedShell.tsx
  - musicode-ui/src/components/layout/shells/NovatouchShell.tsx
  - musicode-ui/src/components/layout/shells/MinimalShell.tsx
  - musicode-ui/src/themes/tokens/novatouch.ts
  - musicode-ui/src/themes/tokens/minimal.ts
key_decisions:
  - Theme selector lives exclusively in Settings page — not in TopBar or sidebar
  - All 3 themes share the same indigo accent palette (no purple/violet differentiation)
  - Novatouch popover approach discarded in favor of Settings-only placement after user testing
duration: 
verification_result: passed
completed_at: 2026-05-03T09:08:39.697Z
blocker_discovered: false
---

# T04: Built ThemeSelector component and wired end-to-end theme switching across all 3 shells, settled in Settings page

**Built ThemeSelector component and wired end-to-end theme switching across all 3 shells, settled in Settings page**

## What Happened

Created ThemeSelector as a segmented control with Evolved/Novatouch/Minimal buttons. Initially placed in TopBar (Evolved), MinimalShell header, and as a popover in NovatouchShell sidebar. After user testing, iterated on placement: unified accent colors to indigo across all themes, repositioned the Novatouch popover. Ultimately moved the theme selector exclusively to the Settings page (Appearance section) per user feedback — this is where music apps typically place theme controls. Removed all inline/popover theme selectors from shells. End-to-end flow works: clicking a theme in Settings updates ThemeContext → CSS variables swap on :root → layout shell switches → choice persists in localStorage across reloads.

## Verification

npm run build passes. Verified in browser: all 3 themes switch correctly from Settings, accent colors are consistent indigo, layout shells swap, localStorage persists choice across reload. User confirmed all themes working correctly.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | pass | 8000ms |
| 2 | `npx vite build` | 0 | pass | 12000ms |

## Deviations

Plan specified TopBar placement. After iterating with user feedback (popover too intrusive in Novatouch, accent colors inconsistent), settled on Settings page as the single location for theme selection.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/components/common/ThemeSelector.tsx`
- `musicode-ui/src/pages/SettingsPage.tsx`
- `musicode-ui/src/components/layout/shells/EvolvedShell.tsx`
- `musicode-ui/src/components/layout/shells/NovatouchShell.tsx`
- `musicode-ui/src/components/layout/shells/MinimalShell.tsx`
- `musicode-ui/src/themes/tokens/novatouch.ts`
- `musicode-ui/src/themes/tokens/minimal.ts`
