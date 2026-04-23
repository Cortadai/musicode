---
id: S01
parent: M011
milestone: M011
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["musicode-ui/src/components/player/PlayerBar.tsx", "musicode-ui/src/components/player/TrackInfo.tsx", "musicode-ui/src/components/player/TransportControls.tsx", "musicode-ui/src/components/player/ProgressBar.tsx", "musicode-ui/src/components/player/VolumeControl.tsx", "musicode-ui/src/components/player/CrossfadePopover.tsx", "musicode-ui/src/components/player/EqPopover.tsx"]
key_decisions:
  - ["Split into 6 components rather than 5 — ProgressBar separated from TransportControls for independent reuse", "CrossfadePopover and EqPopover are fully self-contained (own state, own click-outside handling) rather than lifting state to PlayerBar", "Kept visualizer integration in PlayerBar since it's tightly coupled to the layout expand/collapse"]
patterns_established:
  - ["Self-contained popover components with own state and click-outside handling", "PlayerBar as thin layout orchestrator — all logic lives in child components or hooks"]
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-18T16:47:08.131Z
blocker_discovered: false
---

# S01: Refactor PlayerBar — extraer componentes

**PlayerBar refactored from 465 LOC monolith to ~90 LOC orchestrator + 6 focused components**

## What Happened

Extracted 6 components from PlayerBar.tsx: TrackInfo (cover art + vinyl disc + metadata), TransportControls (play/pause/skip/shuffle/repeat), ProgressBar (seek bar + timestamps), VolumeControl (slider + mute), CrossfadePopover (self-contained with slider + gapless toggle), and EqPopover (self-contained with 5-band EQ + presets + toggle). PlayerBar reduced from 465 to ~90 LOC — now a clean layout orchestrator. All 8 player features verified working identically in browser: play/pause, next track, seek, volume, shuffle/repeat, crossfade, EQ, and visualizer.

## Verification

vite build zero errors. Browser smoke test confirmed all 8 features: TrackInfo renders cover+vinyl+metadata, TransportControls toggle all buttons, ProgressBar shows timestamps and advances, VolumeControl slider+mute, CrossfadePopover 0-12s slider+gapless, EqPopover 5 bands (60Hz-14kHz)+presets+toggle, Visualizer expand/collapse with bars mode.

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

- `musicode-ui/src/components/player/PlayerBar.tsx` — Reduced from 465 to ~90 LOC — imports and composes 6 child components
- `musicode-ui/src/components/player/TrackInfo.tsx` — New — cover art, vinyl disc animation, track title, artist link
- `musicode-ui/src/components/player/TransportControls.tsx` — New — play/pause, skip, shuffle, repeat buttons
- `musicode-ui/src/components/player/ProgressBar.tsx` — New — seek bar with current time and duration display
- `musicode-ui/src/components/player/VolumeControl.tsx` — New — volume slider and mute toggle
- `musicode-ui/src/components/player/CrossfadePopover.tsx` — New — self-contained crossfade config with slider and gapless toggle
- `musicode-ui/src/components/player/EqPopover.tsx` — New — self-contained 5-band parametric EQ with presets
