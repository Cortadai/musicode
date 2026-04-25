# M016: Waveform Progress Bar

## Vision
Replace the flat progress bar with a SoundCloud-style waveform showing amplitude structure of each track, enabling visual seeking through loud/quiet sections.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | S01 | medium | — | ✅ | After this: `curl /api/waveforms/{trackId}` returns ~200 peak values extracted from a real audio file via ffmpeg |
| S02 | S02 | medium | — | ✅ | After this: user sees waveform in progress bar area, can click to seek, played portion highlighted |
