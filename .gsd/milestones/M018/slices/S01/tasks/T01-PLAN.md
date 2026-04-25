---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T01: RetroMode shell and entry point

Create the RetroMode component as a full-screen portal (like NowPlayingOverlay but independent). Add a cassette icon button to PlayerBar right controls. Wire up open/close state, ESC key handling, and pass player state (currentTrack, isPlaying, currentTime, duration, seek, pause, resume, next, prev) into the shell. The shell renders a dark background container ready for canvas children.

## Inputs

- `PlayerBar.tsx current button layout`
- `NowPlayingOverlay.tsx portal pattern`
- `usePlayer hook API`

## Expected Output

- `RetroMode.tsx — portal shell component`
- `PlayerBar.tsx — cassette button added to right controls`

## Verification

Button visible in PlayerBar, click opens full-screen dark overlay, ESC closes it, player state accessible inside
