---
id: M016
title: "Waveform Progress Bar"
status: complete
completed_at: 2026-04-25T16:55:54.205Z
key_decisions:
  - ffmpeg ProcessBuilder with redirectErrorStream to prevent deadlock
  - 200 peaks default resolution
  - JSON file cache per trackId — no DB dependency
  - 120s axios timeout for first-generation tolerance
  - Toggle button with localStorage preference
key_files:
  - musicode-server/src/main/java/com/musicode/service/WaveformService.java
  - musicode-server/src/main/java/com/musicode/controller/WaveformController.java
  - musicode-ui/src/components/player/WaveformBar.tsx
  - musicode-ui/src/hooks/useWaveform.ts
  - musicode-ui/src/components/player/ProgressBar.tsx
  - musicode-ui/src/components/player/PlayerBar.tsx
lessons_learned:
  - ffmpeg ProcessBuilder must use redirectErrorStream(true) + -v error — stderr buffer fills up and deadlocks the process otherwise
  - First waveform generation can take 10-30s for large files — need generous timeout on frontend, cache makes subsequent requests instant
---

# M016: Waveform Progress Bar

**SoundCloud-style waveform progress bar with ffmpeg peak extraction, canvas rendering, click-to-seek, and toggle to classic flat bar**

## What Happened

M016 replaced the flat progress bar with a waveform visualization. Backend: WaveformService extracts ~200 normalized peaks from audio files via ffmpeg ProcessBuilder, caches as JSON files. WaveformController serves them via authenticated REST endpoint. Fixed a critical ffmpeg stderr deadlock during development. Frontend: WaveformBar canvas component renders bars with played/unplayed highlighting. useWaveform hook fetches and caches peaks. Integrated into both PlayerBar and NowPlayingOverlay with click-to-seek. Added toggle button (Activity icon) to switch between waveform and flat bar, preference persisted in localStorage. 10 backend tests pass. User verified via screenshot.

## Success Criteria Results



## Definition of Done Results



## Requirement Outcomes



## Deviations

Added waveform/flat bar toggle button — not in original scope but user requested it during final integration

## Follow-ups

None.
