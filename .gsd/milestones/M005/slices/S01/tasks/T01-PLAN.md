---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Media Session integration in usePlayer

In usePlayer.ts, add a useEffect that syncs Media Session metadata whenever currentTrack changes: set navigator.mediaSession.metadata with MediaMetadata (title, artist, album, artwork array with cover URL). Add another useEffect that registers action handlers: play → resume, pause → pause, nexttrack → next, previoustrack → prev, seekto → seek. Update playback state (playing/paused/none) when isPlaying changes. Clear metadata on STOP. Guard with 'mediaSession' in navigator check for browsers without support. Use absolute URLs for artwork (window.location.origin + getCoverUrl). Add console.debug for registration.

## Inputs

- `Current usePlayer.ts`
- `getCoverUrl from api/albums.ts`

## Expected Output

- `Updated usePlayer.ts with Media Session integration`

## Verification

npm run build compiles. Manual: play track → media keys work, OS shows now-playing.
