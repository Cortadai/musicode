---
id: S02
parent: M011
milestone: M011
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["musicode-ui/src/context/PlayerContext.tsx", "musicode-ui/src/components/library/TrackList.tsx", "musicode-ui/src/components/library/AlbumCard.tsx", "musicode-ui/src/components/player/TrackInfo.tsx", "musicode-ui/src/components/player/TransportControls.tsx", "musicode-ui/src/components/player/VolumeControl.tsx"]
key_decisions:
  - ["Added CurrentTrackContext as third context for narrow subscriptions rather than external selector library", "Extracted TrackRow as memo'd component rather than memoizing entire TrackList (preserves scroll-to-track behavior)"]
patterns_established:
  - ["useCurrentTrackInfo() for components that only need track identity, not full player state", "React.memo on presentational components receiving props from high-frequency parents"]
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-18T17:03:33.112Z
blocker_discovered: false
---

# S02: Memoización y rendimiento

**React.memo on 5 components, CurrentTrackContext for narrow subscriptions, stable callbacks in 3 pages — eliminates ~4 re-renders/sec across track lists and player controls**

## What Happened

Three layers of optimization applied: (1) React.memo on player sub-components (TrackInfo, TransportControls, VolumeControl) and AlbumCard — prevents re-renders when PlayerBar updates currentTime. (2) Extracted memo'd TrackRow from TrackList so only the active row re-renders on track change, not siblings. (3) Added CurrentTrackContext carrying only {trackId, isPlaying} with useMemo — TrackList, AlbumDetailPage, and Visualizer now subscribe to this narrow context instead of the full PlayerState, eliminating ~4 unnecessary re-renders/second from currentTime ticks. Also stabilized onPlay callbacks with useCallback and derived arrays with useMemo in AlbumDetailPage, TracksPage, and SearchPage. Caught and fixed a hooks-ordering bug where useMemo/useCallback were placed after early returns.

## Verification

TypeScript compiles cleanly. 21/21 Playwright E2E tests pass. Vite production build succeeds.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

None.
