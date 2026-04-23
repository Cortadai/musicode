# S02: Memoización y rendimiento

**Goal:** Reducir re-renders innecesarios en componentes del player y listas de tracks/albums mediante React.memo, useMemo y useCallback. Verificar con React DevTools Profiler.
**Demo:** React DevTools Profiler muestra reducción medible de re-renders en listas de tracks/albums.

## Must-Haves

- React DevTools Profiler muestra reducción medible de re-renders en TrackList y AlbumCard durante reproducción. Player sub-components no re-renderizan cuando sus props no cambian.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Memo player sub-components** `est:15min`
  Wrap TrackInfo, TransportControls, VolumeControl in React.memo. ProgressBar updates every tick so skip it. Ensure PlayerBar passes stable callback refs (already useCallback). Verify with Profiler that TransportControls and VolumeControl stop re-rendering on currentTime ticks.
  - Files: `musicode-ui/src/components/player/TrackInfo.tsx`, `musicode-ui/src/components/player/TransportControls.tsx`, `musicode-ui/src/components/player/VolumeControl.tsx`
  - Verify: Build passes. Profiler shows TransportControls and VolumeControl render count stays flat during playback.

- [x] **T02: Memo AlbumCard and TrackRow** `est:25min`
  Wrap AlbumCard in React.memo. In TrackList, extract individual track rows to a memoized TrackRow component so that only the playing track re-renders when highlight changes, not the entire list. Memoize onPlay callbacks in parent pages (AlbumDetailPage, TracksPage) with useCallback.
  - Files: `musicode-ui/src/components/library/AlbumCard.tsx`, `musicode-ui/src/components/library/TrackList.tsx`, `musicode-ui/src/pages/AlbumDetailPage.tsx`, `musicode-ui/src/pages/TracksPage.tsx`
  - Verify: Build passes. Profiler shows only the active TrackRow re-renders during playback, not sibling rows. AlbumCard grid does not re-render on player state changes.

- [x] **T03: Fix TrackList context subscription granularity** `est:20min`
  TrackList calls usePlayerState() which re-renders on every currentTime tick. Extract the track highlight check (currentTrack?.id, isPlaying) into a narrow selector or a dedicated hook useCurrentTrackId() that only triggers re-render when the playing track ID changes, not on every tick.
  - Files: `musicode-ui/src/hooks/usePlayer.ts`, `musicode-ui/src/context/PlayerContext.tsx`, `musicode-ui/src/components/library/TrackList.tsx`
  - Verify: Build passes. TrackList does not re-render on currentTime changes — only on track change.

- [x] **T04: Browser verification with Profiler** `est:10min`
  Run the app in dev mode with React DevTools Profiler. Record a session: play a track, let it run 10+ seconds, navigate to album list, navigate to track list. Capture re-render counts and verify reductions match success criteria.
  - Verify: Profiler recording shows: (1) TransportControls/VolumeControl render count flat during playback, (2) TrackRow siblings don't re-render, (3) AlbumCard grid stable during playback.

## Files Likely Touched

- musicode-ui/src/components/player/TrackInfo.tsx
- musicode-ui/src/components/player/TransportControls.tsx
- musicode-ui/src/components/player/VolumeControl.tsx
- musicode-ui/src/components/library/AlbumCard.tsx
- musicode-ui/src/components/library/TrackList.tsx
- musicode-ui/src/pages/AlbumDetailPage.tsx
- musicode-ui/src/pages/TracksPage.tsx
- musicode-ui/src/hooks/usePlayer.ts
- musicode-ui/src/context/PlayerContext.tsx
