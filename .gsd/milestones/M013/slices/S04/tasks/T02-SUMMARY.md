---
id: T02
parent: S04
milestone: M013
key_files:
  - musicode-ui/src/components/player/ScrobbleIndicator.tsx
  - musicode-ui/src/components/player/PlayerBar.tsx
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-18T19:39:56.732Z
blocker_discovered: false
---

# T02: ScrobbleIndicator component: Radio icon with accent/amber/muted states and tooltip

**ScrobbleIndicator component: Radio icon with accent/amber/muted states and tooltip**

## What Happened

Created ScrobbleIndicator: queries /scrobble/settings on mount, hidden when no services configured. Shows Radio icon in zinc-600 (idle), indigo-400 (reported), amber-500 (error) with descriptive tooltip. Placed in PlayerBar right controls, before crossfade popover.

## Verification

TypeScript clean, 117 tests pass

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | Clean | 5000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/components/player/ScrobbleIndicator.tsx`
- `musicode-ui/src/components/player/PlayerBar.tsx`
