---
id: T01
parent: S03
milestone: M020
key_files:
  - musicode-ui/src/components/analyzer/scopes/Spectrogram.ts
  - musicode-ui/src/components/analyzer/scopes/Waveform.ts
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-05-07T21:00:23.357Z
blocker_discovered: false
---

# T01: Spectrogram with scrolling frequency-time heatmap + Waveform with scrolling amplitude and speed control

**Spectrogram with scrolling frequency-time heatmap + Waveform with scrolling amplitude and speed control**

## What Happened

Implemented Spectrogram with scrolling frequency-time heatmap using log scale and theme-colored gradient. Implemented Waveform with scrolling amplitude over time and configurable speed (×0.5/×1/×1.5). Both use OffscreenCanvas grid caching and theme-aware colors.

## Verification

Browser: Spectrogram scrolls with frequency content, Waveform shows amplitude history, speed control works. Both render in all themes.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `browser: play tracks, verify spectrogram and waveform scrolling` | 0 | pass | 8000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/components/analyzer/scopes/Spectrogram.ts`
- `musicode-ui/src/components/analyzer/scopes/Waveform.ts`
