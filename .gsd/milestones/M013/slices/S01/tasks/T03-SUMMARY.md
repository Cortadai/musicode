---
id: T03
parent: S01
milestone: M013
key_files:
  - musicode-ui/src/hooks/useDynamicTheme.ts
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-18T19:28:40.072Z
blocker_discovered: false
---

# T03: useDynamicTheme hook: opt-in color extraction with CSS variable injection

**useDynamicTheme hook: opt-in color extraction with CSS variable injection**

## What Happened

Created useDynamicTheme hook that reads dynamicTheme pref from localStorage, subscribes to currentTrack via PlayerContext, extracts colors when enabled and track changes, sets --np-color-1/--np-color-2/--np-bg CSS variables on document root. Toggle persists preference. Clears variables when disabled or on unmount. Uses albumIdRef to skip redundant extractions. Checks cache synchronously before async extraction for instant palette on revisited albums.

## Verification

TypeScript compiles clean. Hook follows established patterns (audioPreferences persistence, PlayerContext subscription).

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | Clean compilation | 5000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/hooks/useDynamicTheme.ts`
