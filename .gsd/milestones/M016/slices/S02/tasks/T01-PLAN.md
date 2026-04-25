---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T01: WaveformBar canvas component + API hook

Create WaveformBar React component using HTML5 Canvas. Renders ~200 bars: played portion in accent color, unplayed in muted color. Supports click-to-seek and drag-to-seek. Create useWaveform hook that fetches GET /api/waveforms/{trackId} and caches in state. Returns peaks array + loading state.

## Inputs

- `musicode-frontend/src/api/lyrics.ts`

## Expected Output

- `musicode-frontend/src/components/WaveformBar.tsx`
- `musicode-frontend/src/api/waveforms.ts`
- `musicode-frontend/src/hooks/useWaveform.ts`

## Verification

npx tsc --noEmit
