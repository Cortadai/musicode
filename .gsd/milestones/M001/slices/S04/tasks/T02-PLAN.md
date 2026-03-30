---
estimated_steps: 8
estimated_files: 2
skills_used: []
---

# T02: PlayerBar — persistent playback controls

Create persistent PlayerBar component fixed to bottom of AppShell. Shows: small cover art, track title + artist, play/pause button, next/prev buttons, progress bar with seek, current time / duration, volume slider.

Steps:
1. Create PlayerBar component with all controls
2. Add to AppShell layout (fixed bottom)
3. Progress bar: click to seek, show current position
4. Volume: slider control
5. Style to match dark theme
6. Wire all buttons to usePlayer actions

## Inputs

- `musicode-ui/src/context/PlayerContext.tsx`
- `musicode-ui/src/hooks/usePlayer.ts`

## Expected Output

- `musicode-ui/src/components/player/PlayerBar.tsx`

## Verification

Player bar visible at bottom when a track is playing. Play/pause, seek, volume all functional.
