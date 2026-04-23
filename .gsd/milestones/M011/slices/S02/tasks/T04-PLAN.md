---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T04: Browser verification with Profiler

Run the app in dev mode with React DevTools Profiler. Record a session: play a track, let it run 10+ seconds, navigate to album list, navigate to track list. Capture re-render counts and verify reductions match success criteria.

## Inputs

- `Running dev server`
- `React DevTools`

## Expected Output

- `Browser verification pass/fail`

## Verification

Profiler recording shows: (1) TransportControls/VolumeControl render count flat during playback, (2) TrackRow siblings don't re-render, (3) AlbumCard grid stable during playback.
