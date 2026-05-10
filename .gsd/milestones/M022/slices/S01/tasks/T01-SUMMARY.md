---
id: T01
parent: S01
milestone: M022
key_files:
  - musicode-ui/src/context/LyricsSidebarContext.tsx
  - musicode-ui/src/context/QueuePanelContext.tsx
  - musicode-ui/src/components/layout/AppShell.tsx
key_decisions:
  - (none)
duration: 
verification_result: untested
completed_at: 2026-05-09T12:39:04.696Z
blocker_discovered: false
---

# T01: Created LyricsSidebarContext with mutual exclusion against QueuePanel

**Created LyricsSidebarContext with mutual exclusion against QueuePanel**

## What Happened

Created LyricsSidebarContext.tsx mirroring QueuePanelContext pattern with isOpen/toggle/close. Updated QueuePanelContext to expose close(). Both contexts wired into AppShell via nested providers. Mutual exclusion: opening lyrics closes queue and vice versa.

## Verification

TypeScript compiles, both contexts export correctly, mutual exclusion logic verified in browser.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| — | No verification commands discovered | — | — | — |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/context/LyricsSidebarContext.tsx`
- `musicode-ui/src/context/QueuePanelContext.tsx`
- `musicode-ui/src/components/layout/AppShell.tsx`
