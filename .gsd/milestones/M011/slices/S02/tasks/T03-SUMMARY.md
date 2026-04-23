---
id: T03
parent: S02
milestone: M011
key_files:
  - musicode-ui/src/context/PlayerContext.tsx
  - musicode-ui/src/components/library/TrackList.tsx
  - musicode-ui/src/pages/AlbumDetailPage.tsx
  - musicode-ui/src/components/player/Visualizer.tsx
key_decisions:
  - Added CurrentTrackContext as a third context rather than using external selector library — keeps zero-dep approach, simple to understand
duration: 
verification_result: passed
completed_at: 2026-04-18T17:03:00.788Z
blocker_discovered: false
---

# T03: Added CurrentTrackContext for narrow subscription — TrackList no longer re-renders on currentTime ticks

**Added CurrentTrackContext for narrow subscription — TrackList no longer re-renders on currentTime ticks**

## What Happened

PlayerStateContext carries all state including currentTime (~4Hz updates). Components like TrackList and Visualizer only need trackId and isPlaying. Added a dedicated CurrentTrackContext with a useMemo'd value that only changes when currentTrack.id or isPlaying changes. Migrated TrackList, AlbumDetailPage, and Visualizer from usePlayerState to useCurrentTrackInfo. This eliminates ~4 re-renders/second for all track list and visualizer components.

## Verification

TypeScript compiles cleanly. Hooks ordering fixed (useMemo/useCallback moved above early returns).

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | pass | 3000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/context/PlayerContext.tsx`
- `musicode-ui/src/components/library/TrackList.tsx`
- `musicode-ui/src/pages/AlbumDetailPage.tsx`
- `musicode-ui/src/components/player/Visualizer.tsx`
