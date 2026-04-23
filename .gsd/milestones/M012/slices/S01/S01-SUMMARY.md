---
id: S01
parent: M012
milestone: M012
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["musicode-ui/src/hooks/usePlayer.ts", "musicode-ui/src/hooks/useScrobble.ts", "musicode-ui/src/hooks/useMediaSession.ts", "musicode-ui/src/hooks/useGapless.ts"]
key_decisions:
  - ["isOwner changed from useRef to useState so child hooks re-render when ownership is claimed", "Scrobble reporting driven by React state (currentTime/duration) rather than audioGraph callback — simpler, same behavior", "useGapless owns all audioGraph event wiring since preload/crossfade decisions happen inside onTimeUpdate"]
patterns_established:
  - ["Composable hook extraction: parent hook claims ownership via useState, passes isOwner to child hooks that need owner-gated behavior"]
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-18T18:28:36.799Z
blocker_discovered: false
---

# S01: Extract usePlayer into composable hooks

**Split usePlayer.ts (418 LOC) into 4 focused hooks: usePlayer orchestrator (190), useScrobble (45), useMediaSession (102), useGapless (155)**

## What Happened

Extracted three self-contained concerns from usePlayer.ts into dedicated hooks:

1. **useScrobble** (45 LOC) — play reporting at 50% threshold with AbortController cleanup. Pure side-effect hook, no return value.

2. **useMediaSession** (102 LOC) — all navigator.mediaSession logic: metadata sync on track change, playback state sync, action handler registration (owner-gated), and position state updates for OS seek bars.

3. **useGapless** (155 LOC) — the most complex extraction. Owns audioGraph event wiring (onTimeUpdate, onLoadedMetadata, onEnded), gapless preload triggering, crossfade triggering, and the swap-on-ended logic. Maintains its own refs for queue/index/repeatMode/currentTrack to avoid stale closures. Returns setCrossfadeDuration/getCrossfadeDuration.

**usePlayer** (190 LOC) is now a thin orchestrator: claims ownership, composes the 3 hooks, syncs volume/source/play-pause to audioGraph, and exposes the unchanged public API.

Key decision: changed ownership tracking from useRef to useState. The original ref worked because ownership claim and event wiring happened in the same useEffect. After extraction, child hooks receive isOwner as a prop — a ref mutation wouldn't trigger re-render, so useGapless would never see isOwner=true. useState fixes this cleanly.

Zero consumer changes — all 5 files importing usePlayer (AppShell, PlayerBar, SearchPage, AlbumDetailPage, TracksPage) work unchanged.

## Verification

vitest --run: 109/109 tests pass. tsc --noEmit: zero errors. usePlayer.ts: 190 LOC (down from 418, 55% reduction). No import changes in any consumer.

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

usePlayer.ts is 190 LOC vs target 150. The 40 LOC over target is the public API surface (10 useCallback wrappers) which cannot be extracted without changing the hook contract.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

None.
