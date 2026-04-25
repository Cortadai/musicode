---
id: T02
parent: S02
milestone: M017
key_files:
  - musicode-ui/src/components/player/PlayerBar.tsx
  - musicode-ui/src/components/player/TransportControls.tsx
  - musicode-ui/src/components/player/TrackInfo.tsx
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-25T19:17:45.486Z
blocker_discovered: false
---

# T02: Right controls hide auxiliary popovers and artwork below 768px

**Right controls hide auxiliary popovers and artwork below 768px**

## What Happened

Added `hidden md:flex` to shuffle, repeat, waveform toggle, crossfade/EQ popovers, and visualizer toggle. Volume stays visible at all sizes. TrackInfo artwork hidden below md. Right section uses `w-48 min-w-[120px] shrink` instead of fixed width.

## Verification

Visual verification — below 768px only transport controls, track text, and volume visible. No overflow.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `tsc -b --noEmit` | 0 | pass | 5000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/components/player/PlayerBar.tsx`
- `musicode-ui/src/components/player/TransportControls.tsx`
- `musicode-ui/src/components/player/TrackInfo.tsx`
