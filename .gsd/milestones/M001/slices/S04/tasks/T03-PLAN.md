---
estimated_steps: 7
estimated_files: 4
skills_used: []
---

# T03: Wire click-to-play + playing indicator in track lists

Wire click-to-play in TrackList and album pages. Clicking a track row plays it. Clicking play on an album page queues all tracks and starts from the selected one. Add visual indicator for currently playing track.

Steps:
1. Add onPlay callback to TrackList
2. Wire TrackList onClick in all pages (TracksPage, AlbumDetailPage, SearchPage)
3. Add 'Play Album' behavior in AlbumDetailPage
4. Highlight currently playing track in TrackList
5. End-to-end test: browse, click, hear audio, seek, next/prev

## Inputs

- `musicode-ui/src/context/PlayerContext.tsx`

## Expected Output

- `musicode-ui/src/components/library/TrackList.tsx`
- `musicode-ui/src/pages/AlbumDetailPage.tsx`
- `musicode-ui/src/pages/TracksPage.tsx`
- `musicode-ui/src/pages/SearchPage.tsx`

## Verification

Click track in Albums detail → audio plays in player bar. Click next → next track in album. Currently playing track highlighted in list.
