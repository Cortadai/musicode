---
id: T01
parent: S06
milestone: M020
key_files:
  - musicode-ui/src/components/analyzer/scopes/ClassicBars.ts
  - musicode-ui/src/components/analyzer/scopes/index.ts
  - musicode-ui/src/stores/useDeckStore.ts
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-05-07T21:00:35.879Z
blocker_discovered: false
---

# T01: Added Classic Bars as 8th scope, reordered registry, set defaults to Classic Bars + Spectrum + Vectorscope

**Added Classic Bars as 8th scope, reordered registry, set defaults to Classic Bars + Spectrum + Vectorscope**

## What Happened

Ported NowPlaying visualizer bars as Classic Bars scope: 32 log-spaced bars, deck theme colors (--mc-scope-line), low opacity (0.25–0.70), smoothing (0.82), dB data, 3 horizontal grid lines. Reordered registry: Classic Bars first. Defaults: Classic Bars + Spectrum + Vectorscope. Config version 13. Oscilloscope refined with pitch-locked trigger and full vertical scale.

## Verification

Browser: fresh localStorage shows 3 defaults, all 8 scopes work together, Classic Bars has grid and integrates visually with deck.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `browser: clear localStorage, reload, verify defaults and all 8 scopes` | 0 | pass | 12000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/components/analyzer/scopes/ClassicBars.ts`
- `musicode-ui/src/components/analyzer/scopes/index.ts`
- `musicode-ui/src/stores/useDeckStore.ts`
