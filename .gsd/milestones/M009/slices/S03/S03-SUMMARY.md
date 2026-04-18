---
id: S03
parent: M009
milestone: M009
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["musicode-ui/src/audio/audioGraph.ts", "musicode-ui/src/hooks/usePlayer.ts", "musicode-ui/src/context/PlayerContext.tsx"]
key_decisions:
  - (none)
patterns_established:
  - ["Dual HTMLAudioElement pattern: two elements share a single Web Audio graph, swap active element for gapless transitions", "Pre-load threshold at 3s before track end via timeupdate event", "preloadedRef/preloadingRef pattern to prevent duplicate pre-loads and track swap state"]
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-18T09:48:34.586Z
blocker_discovered: false
---

# S03: Gapless playback

**Near-gapless playback via dual HTMLAudioElement architecture — pre-load next track on inactive element, swap on ended event**

## What Happened

Implemented gapless playback using a dual-element approach: audioGraph.ts now manages two HTMLAudioElements (A and B) with independent MediaElementSourceNodes, both connected to the shared gain→analyser→destination chain. At ~3s before track end, the next track is pre-loaded on the inactive element. On the ended event, the active element swaps and playback continues immediately with near-zero gap. All edge cases handled: manual skip cancels pre-load, repeat-one restarts without swap, repeat-all wraps to queue start with gapless, repeat-off stops at queue end. Logout and stop clean up both elements. Volume, mute, and visualizer work correctly across swaps.

## Verification

User-verified 6 scenarios in browser: (1) gapless album transition — no audible gap, (2) manual skip — pre-load cancelled correctly, (3) repeat-one/all/off — all correct, (4) logout stops audio, (5) volume/mute persists across swaps, (6) visualizer stays connected after swap. Console logs confirm graph init, pre-load, swap, and cleanup.

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

- `musicode-ui/src/audio/audioGraph.ts` — Dual-element architecture with A/B slots, prepareNext, swap, cancelPreload
- `musicode-ui/src/hooks/usePlayer.ts` — Gapless pre-load/swap logic in timeupdate and ended handlers
- `musicode-ui/src/context/PlayerContext.tsx` — Minor adjustments for gapless swap flag in track loading
