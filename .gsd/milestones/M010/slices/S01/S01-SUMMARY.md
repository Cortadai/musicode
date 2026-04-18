---
id: S01
parent: M010
milestone: M010
provides:
  - ["dual-source-audio-graph", "crossfade-transitions", "per-source-gain-nodes"]
requires:
  []
affects:
  []
key_files:
  - (none)
key_decisions:
  - ["Web Audio linearRampToValueAtTime for sample-accurate crossfade", "Immediate activeSlot flip at crossfade start prevents stale callback state", "isCrossfading() guard in usePlayer prevents track-load from cancelling crossfade"]
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-18T10:49:50.205Z
blocker_discovered: false
---

# S01: Crossfade Transitions

**Dual-source audio graph with Web Audio gain ramps enables smooth crossfade transitions between tracks**

## What Happened

Refactored audioGraph.ts from single-source to dual-slot architecture (sourceA/sourceB → gainA/gainB → masterGain → analyser → destination). Implemented crossfade using linearRampToValueAtTime for sample-accurate gain transitions. Added crossfadeDuration preference with localStorage persistence. UI slider (0–12s) in PlayerBar popover with Blend icon. Fixed critical bug where track-load effect cancelled active crossfade — added isCrossfading() guard and immediate activeSlot flip. Edge cases handled: skip during crossfade, repeat-one bypass, short track guard, stop/logout cleanup.

## Verification

Build passes (npm run build). User-verified UAT: crossfade produces audible gradual fade between tracks, slider persists preference, icon reflects state, alignment matches other controls.

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

- `musicode-ui/src/audio/audioGraph.ts` — Dual-source architecture with per-source gain nodes, crossfade logic, isCrossfading guard
- `musicode-ui/src/audio/audioPreferences.ts` — Added crossfadeDuration preference (default 0)
- `musicode-ui/src/hooks/usePlayer.ts` — Crossfade trigger in timeupdate, isCrossfading guard in track-load effect
- `musicode-ui/src/components/player/PlayerBar.tsx` — Crossfade popover UI with range slider and Blend icon
- `musicode-ui/src/components/library/TrackList.tsx` — Removed unused useCallback import
