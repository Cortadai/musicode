---
estimated_steps: 7
estimated_files: 3
skills_used: []
---

# T01: PlayerContext + usePlayer hook with HTMLAudioElement

Create PlayerContext with useReducer for global player state. State: currentTrack, queue, isPlaying, currentTime, duration, volume. Actions: PLAY_TRACK, PLAY_ALBUM, PAUSE, RESUME, NEXT, PREV, SET_TIME, SET_DURATION, SET_VOLUME. Create usePlayer hook that manages an HTMLAudioElement ref, syncs with context, handles ended/timeupdate/loadedmetadata events.

Steps:
1. Create PlayerContext with state type and reducer
2. Create PlayerProvider wrapping the app
3. Create usePlayer hook: play(track), playAlbum(tracks, startIndex), pause, resume, next, prev, seek, setVolume
4. Wire HTMLAudioElement events to dispatch
5. Wrap App with PlayerProvider

## Inputs

- `musicode-ui/src/types/index.ts`

## Expected Output

- `musicode-ui/src/context/PlayerContext.tsx`
- `musicode-ui/src/hooks/usePlayer.ts`

## Verification

Import usePlayer in a test component, call play(track) — audio element plays, state updates.
