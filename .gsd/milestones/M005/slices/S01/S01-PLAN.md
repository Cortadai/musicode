# S01: Media Session API

**Goal:** Integrate Media Session API so OS media controls and keyboard media keys work with the player
**Demo:** After this: After this: keyboard media keys (play/pause/next/prev) control Musicode. OS shows now-playing notification with track title, artist, and cover art.

## Tasks
- [x] **T01: Media Session API integrated — OS media keys, now-playing metadata, seek bar, all browser-compatible.** — In usePlayer.ts, add a useEffect that syncs Media Session metadata whenever currentTrack changes: set navigator.mediaSession.metadata with MediaMetadata (title, artist, album, artwork array with cover URL). Add another useEffect that registers action handlers: play → resume, pause → pause, nexttrack → next, previoustrack → prev, seekto → seek. Update playback state (playing/paused/none) when isPlaying changes. Clear metadata on STOP. Guard with 'mediaSession' in navigator check for browsers without support. Use absolute URLs for artwork (window.location.origin + getCoverUrl). Add console.debug for registration.
  - Estimate: 20min
  - Files: musicode-ui/src/hooks/usePlayer.ts
  - Verify: npm run build compiles. Manual: play track → media keys work, OS shows now-playing.
