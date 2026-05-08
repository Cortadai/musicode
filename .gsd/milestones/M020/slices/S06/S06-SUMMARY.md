---
id: S06
parent: M020
milestone: M020
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["musicode-ui/src/components/analyzer/scopes/ClassicBars.ts", "musicode-ui/src/components/analyzer/scopes/index.ts", "musicode-ui/src/stores/useDeckStore.ts"]
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
completed_at: 2026-05-07T21:01:01.229Z
blocker_discovered: false
---

# S06: Integration Polish + Defaults

**Classic Bars added as 8th scope, registry reordered, defaults set to Classic Bars + Spectrum + Vectorscope**

## What Happened

Added Classic Bars (ported from NowPlaying, adapted to deck theme). Reordered: Classic Bars, Spectrum, Vectorscope, Oscilloscope, Spectrogram, VU, LUFS, Waveform. Defaults: Classic Bars + Spectrum + Vectorscope. Config version 13. Oscilloscope refined with pitch-locked trigger. All 8 scopes work smoothly together.

## Verification

Browser: fresh localStorage shows 3 defaults, all 8 scopes render, Classic Bars integrates visually, smooth across all themes.

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
