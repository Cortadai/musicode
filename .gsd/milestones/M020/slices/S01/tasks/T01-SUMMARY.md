---
id: T01
parent: S01
milestone: M020
key_files:
  - musicode-ui/src/audio/analyzerDeckDataSource.ts
  - musicode-ui/src/hooks/useFrameScheduler.ts
  - musicode-ui/src/audio/audioGraph.ts
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-05-07T20:58:48.735Z
blocker_discovered: false
---

# T01: Created AnalyzerDeckDataSource wrapping a dedicated 4096-FFT AnalyserNode and useFrameScheduler rAF hook with FPS cap and subscriber pattern

**Created AnalyzerDeckDataSource wrapping a dedicated 4096-FFT AnalyserNode and useFrameScheduler rAF hook with FPS cap and subscriber pattern**

## What Happened

Built the shared audio data abstraction that wraps a second AnalyserNode (FFT 4096) dedicated to the deck, providing getFrequencyData() and getTimeDomainData() as Float32Arrays. Created useFrameScheduler hook: rAF loop gated on playback state from usePlayer, subscriber pattern for multiple scopes sharing one loop. Data flows correctly during playback and zeros when paused.

## Verification

Verified in browser: Float32Array data flows when playing, zeros when paused. Frame scheduler runs at target FPS.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `browser: play track, verify console data flow` | 0 | pass | 5000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/audio/analyzerDeckDataSource.ts`
- `musicode-ui/src/hooks/useFrameScheduler.ts`
- `musicode-ui/src/audio/audioGraph.ts`
