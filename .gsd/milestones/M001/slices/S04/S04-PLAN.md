# S04: Player + Queue — Full Playback Experience

**Goal:** Complete playback: click any track → audio plays in persistent player bar with seek, volume, next/prev, and queue. Playing an album queues all its tracks.
**Demo:** After this: Click any track in the library → audio plays in the persistent player bar. Seek, volume, next/prev, shuffle, and repeat all work. Playing an album queues all its tracks.

## Tasks
- [x] **T01: PlayerContext + usePlayer hook with full queue management and HTMLAudioElement control.** — Create PlayerContext with useReducer for global player state. State: currentTrack, queue, isPlaying, currentTime, duration, volume. Actions: PLAY_TRACK, PLAY_ALBUM, PAUSE, RESUME, NEXT, PREV, SET_TIME, SET_DURATION, SET_VOLUME. Create usePlayer hook that manages an HTMLAudioElement ref, syncs with context, handles ended/timeupdate/loadedmetadata events.

Steps:
1. Create PlayerContext with state type and reducer
2. Create PlayerProvider wrapping the app
3. Create usePlayer hook: play(track), playAlbum(tracks, startIndex), pause, resume, next, prev, seek, setVolume
4. Wire HTMLAudioElement events to dispatch
5. Wrap App with PlayerProvider
  - Estimate: 1h
  - Files: musicode-ui/src/context/PlayerContext.tsx, musicode-ui/src/hooks/usePlayer.ts, musicode-ui/src/App.tsx
  - Verify: Import usePlayer in a test component, call play(track) — audio element plays, state updates.
- [x] **T02: Persistent player bar with play/pause, seek, next/prev, volume — fixed at bottom of UI.** — Create persistent PlayerBar component fixed to bottom of AppShell. Shows: small cover art, track title + artist, play/pause button, next/prev buttons, progress bar with seek, current time / duration, volume slider.

Steps:
1. Create PlayerBar component with all controls
2. Add to AppShell layout (fixed bottom)
3. Progress bar: click to seek, show current position
4. Volume: slider control
5. Style to match dark theme
6. Wire all buttons to usePlayer actions
  - Estimate: 1h
  - Files: musicode-ui/src/components/player/PlayerBar.tsx, musicode-ui/src/components/layout/AppShell.tsx
  - Verify: Player bar visible at bottom when a track is playing. Play/pause, seek, volume all functional.
- [x] **T03: Click-to-play wired in all pages with queue management and playing indicator.** — Wire click-to-play in TrackList and album pages. Clicking a track row plays it. Clicking play on an album page queues all tracks and starts from the selected one. Add visual indicator for currently playing track.

Steps:
1. Add onPlay callback to TrackList
2. Wire TrackList onClick in all pages (TracksPage, AlbumDetailPage, SearchPage)
3. Add 'Play Album' behavior in AlbumDetailPage
4. Highlight currently playing track in TrackList
5. End-to-end test: browse, click, hear audio, seek, next/prev
  - Estimate: 45m
  - Files: musicode-ui/src/components/library/TrackList.tsx, musicode-ui/src/pages/AlbumDetailPage.tsx, musicode-ui/src/pages/TracksPage.tsx, musicode-ui/src/pages/SearchPage.tsx
  - Verify: Click track in Albums detail → audio plays in player bar. Click next → next track in album. Currently playing track highlighted in list.
