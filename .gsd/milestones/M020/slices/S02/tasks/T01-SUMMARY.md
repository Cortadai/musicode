---
id: T01
parent: S02
milestone: M020
key_files:
  - musicode-ui/src/components/analyzer/scopes/Oscilloscope.ts
  - musicode-ui/src/components/analyzer/scopes/Vectorscope.ts
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-05-07T21:00:20.064Z
blocker_discovered: false
---

# T01: Oscilloscope with autocorrelation pitch-locked trigger + Vectorscope with Lissajous stereo correlation

**Oscilloscope with autocorrelation pitch-locked trigger + Vectorscope with Lissajous stereo correlation**

## What Happened

Implemented Oscilloscope with autocorrelation-based pitch detection, period-locked trigger for stable waveform, configurable speed (×0.5/×1/×1.5), full vertical scale. Implemented Vectorscope showing stereo L/R correlation in Lissajous mode. Both use theme-aware colors and OffscreenCanvas grid caching. Multiple iterations: zero-crossing trigger → pitch-locked trigger inspired by Astra reference, update rate tuned for fluidity.

## Verification

Browser: Oscilloscope stable triggered waveform, speed control works. Vectorscope shows stereo correlation. Both render in all 3 themes.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `browser: play tracks, verify oscilloscope stability and vectorscope correlation` | 0 | pass | 10000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/components/analyzer/scopes/Oscilloscope.ts`
- `musicode-ui/src/components/analyzer/scopes/Vectorscope.ts`
