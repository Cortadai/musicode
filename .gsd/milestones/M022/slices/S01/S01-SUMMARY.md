---
id: S01
parent: M022
milestone: M022
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["musicode-ui/src/context/LyricsSidebarContext.tsx", "musicode-ui/src/components/player/LyricsSidebar.tsx", "musicode-ui/src/components/player/PlayerBar.tsx", "musicode-ui/src/context/QueuePanelContext.tsx", "musicode-ui/src/components/layout/AppShell.tsx", "musicode-ui/src/components/layout/shells/EvolvedShell.tsx", "musicode-ui/src/components/layout/shells/NovaShell.tsx", "musicode-ui/src/components/layout/shells/MinimalShell.tsx"]
key_decisions:
  - (none)
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-05-09T12:39:22.702Z
blocker_discovered: false
---

# S01: Lyrics Sidebar Panel

**Lyrics sidebar accessible from PlayerBar with mutual exclusion against queue panel, works across all 3 shells**

## What Happened

Built a lyrics sidebar that mirrors the QueuePanel pattern. Created LyricsSidebarContext with isOpen/toggle/close, wired mutual exclusion so opening one closes the other. LyricsSidebar component wraps the existing LyricsPanel in a sidebar aside. Added Mic2 icon button to PlayerBar. Wired into EvolvedShell, NovaShell, and MinimalShell. Font size tuned to text-sm for the sidebar's more compact context.

## Verification

Browser verified in all 3 shells: lyrics button toggles sidebar, mutual exclusion with queue works, synced lyrics scroll correctly in sidebar format.

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
