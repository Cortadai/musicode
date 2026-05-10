---
id: T02
parent: S01
milestone: M019
key_files:
  - musicode-ui/src/components/layout/AppShell.tsx
  - musicode-ui/src/components/layout/shells/EvolvedShell.tsx
  - musicode-ui/src/components/layout/shells/NovatouchShell.tsx
  - musicode-ui/src/components/layout/shells/MinimalShell.tsx
key_decisions:
  - Keyboard shortcuts stay in AppShell (shared) rather than duplicated in each shell
  - NovatouchShell and MinimalShell use inline CSS variables (var(--mc-*)) for theme-aware styling rather than hardcoded Tailwind classes
  - Each shell owns its own nav items and logout logic to stay self-contained
duration: 
verification_result: passed
completed_at: 2026-05-03T07:56:25.586Z
blocker_discovered: false
---

# T02: Refactored AppShell into theme-aware shell dispatcher with 3 layout shells (Evolved, Novatouch, Minimal)

**Refactored AppShell into theme-aware shell dispatcher with 3 layout shells (Evolved, Novatouch, Minimal)**

## What Happened

Extracted the current AppShell layout into EvolvedShell (sidebar-expanded + TopBar + Outlet + PlayerBar). Created NovatouchShell with 56px icon-only sidebar using CSS variables from theme tokens, functional NavLinks with active state styling. Created MinimalShell with horizontal nav bar at top, inline search, user info, and text-only nav links. Refactored AppShell to be a dispatcher: reads `theme.layout` from useTheme and delegates to the matching shell via a `shellByLayout` map. Keyboard shortcuts (space, arrows, mute) remain in AppShell shared across all shells. Each shell is self-contained with its own nav items, admin items, and logout handling.

## Verification

TypeScript type-check (tsc --noEmit) passed with zero errors. Vite production build passed in 500ms. Dev server serves the app correctly at localhost:5173.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | pass | 3000ms |
| 2 | `npm run build` | 0 | pass | 500ms |

## Deviations

None — implemented as planned.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/components/layout/AppShell.tsx`
- `musicode-ui/src/components/layout/shells/EvolvedShell.tsx`
- `musicode-ui/src/components/layout/shells/NovatouchShell.tsx`
- `musicode-ui/src/components/layout/shells/MinimalShell.tsx`
