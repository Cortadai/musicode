---
id: S03
parent: M020
milestone: M020
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["musicode-ui/src/components/analyzer/scopes/Spectrogram.ts", "musicode-ui/src/components/analyzer/scopes/Waveform.ts"]
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
completed_at: 2026-05-07T21:00:47.707Z
blocker_discovered: false
---

# S03: Spectrogram + Waveform

**Spectrogram with scrolling frequency-time heatmap + Waveform with scrolling amplitude and speed control**

## What Happened

Implemented Spectrogram with scrolling frequency-time heatmap and log scale. Implemented Waveform with scrolling amplitude and configurable speed. Both use OffscreenCanvas caching and theme-aware colors.

## Verification

Browser: Spectrogram scrolls with frequency content, Waveform shows amplitude history with speed control. Both render in all themes.

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
