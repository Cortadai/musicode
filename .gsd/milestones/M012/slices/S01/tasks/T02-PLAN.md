---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T02: Extract useMediaSession hook

Extract Media Session API logic (metadata sync, action handlers, position state) into useMediaSession.ts. Takes track, isPlaying, duration, currentTime, and callbacks (onPlay, onPause, onNext, onPrev, onSeek).

## Inputs

- `usePlayer.ts media session logic (lines ~200-270)`

## Expected Output

- `useMediaSession.ts with all navigator.mediaSession logic`
- `usePlayer.ts with media session code removed, calling useMediaSession`

## Verification

vitest --run && manual check: media session metadata updates on track change, OS controls work
