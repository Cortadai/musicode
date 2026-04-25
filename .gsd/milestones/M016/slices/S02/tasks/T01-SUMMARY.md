---
id: T01
parent: S02
milestone: M016
key_files:
  - musicode-ui/src/components/player/WaveformBar.tsx
  - musicode-ui/src/hooks/useWaveform.ts
  - musicode-ui/src/api/waveforms.ts
key_decisions:
  - 120s axios timeout for waveform endpoint — first generation via ffmpeg can take 10-30s for large files
  - Canvas-based rendering for performance with 200 bars
duration: 
verification_result: passed
completed_at: 2026-04-25T16:54:54.674Z
blocker_discovered: false
---

# T01: WaveformBar canvas component + useWaveform API hook with caching

**WaveformBar canvas component + useWaveform API hook with caching**

## What Happened

Created WaveformBar React component using HTML5 Canvas that renders ~200 bars with played portion in white and unplayed in gray. Supports click-to-seek. Created useWaveform hook that fetches peaks from /api/waveforms/{trackId} with 120s timeout (first generation is slow) and caches in React state. Created waveforms.ts API module.

## Verification

npx tsc --noEmit passes, visual verification in browser

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | pass | 3000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/components/player/WaveformBar.tsx`
- `musicode-ui/src/hooks/useWaveform.ts`
- `musicode-ui/src/api/waveforms.ts`
