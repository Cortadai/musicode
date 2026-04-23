---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T03: Fix TrackList context subscription granularity

TrackList calls usePlayerState() which re-renders on every currentTime tick. Extract the track highlight check (currentTrack?.id, isPlaying) into a narrow selector or a dedicated hook useCurrentTrackId() that only triggers re-render when the playing track ID changes, not on every tick.

## Inputs

- `PlayerContext architecture (split state/dispatch)`

## Expected Output

- `useCurrentTrackId hook or selector`
- `TrackList using narrow subscription`

## Verification

Build passes. TrackList does not re-render on currentTime changes — only on track change.
