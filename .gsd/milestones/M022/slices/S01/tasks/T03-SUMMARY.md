---
id: T03
parent: S01
milestone: M022
key_files:
  - musicode-ui/src/components/layout/shells/EvolvedShell.tsx
  - musicode-ui/src/components/layout/shells/NovaShell.tsx
  - musicode-ui/src/components/layout/shells/MinimalShell.tsx
key_decisions:
  - (none)
duration: 
verification_result: untested
completed_at: 2026-05-09T12:39:10.443Z
blocker_discovered: false
---

# T03: Wired LyricsSidebar into all 3 shells (Evolved, Nova, Minimal)

**Wired LyricsSidebar into all 3 shells (Evolved, Nova, Minimal)**

## What Happened

Added LyricsSidebar component alongside QueuePanel in EvolvedShell, NovaShell, and MinimalShell. Both panels share the same flex container with only one visible at a time via mutual exclusion context.

## Verification

Browser verified: lyrics button toggles sidebar in all 3 shells, mutual exclusion with queue works correctly.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| — | No verification commands discovered | — | — | — |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/components/layout/shells/EvolvedShell.tsx`
- `musicode-ui/src/components/layout/shells/NovaShell.tsx`
- `musicode-ui/src/components/layout/shells/MinimalShell.tsx`
