---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T02: Memo AlbumCard and TrackRow

Wrap AlbumCard in React.memo. In TrackList, extract individual track rows to a memoized TrackRow component so that only the playing track re-renders when highlight changes, not the entire list. Memoize onPlay callbacks in parent pages (AlbumDetailPage, TracksPage) with useCallback.

## Inputs

- `TrackList component`
- `AlbumCard component`
- `Parent pages`

## Expected Output

- `Memoized AlbumCard`
- `Extracted memoized TrackRow`
- `Stable callbacks in parent pages`

## Verification

Build passes. Profiler shows only the active TrackRow re-renders during playback, not sibling rows. AlbumCard grid does not re-render on player state changes.
