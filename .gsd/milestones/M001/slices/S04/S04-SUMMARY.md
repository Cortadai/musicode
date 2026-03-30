---
id: S04
parent: M001
milestone: M001
provides:
  - Global player state (PlayerContext)
  - usePlayer hook for audio control
  - Persistent PlayerBar component
  - Click-to-play in all track lists
  - Queue management (album, track list)
requires:
  - slice: S03
    provides: React app shell and library pages
  - slice: S01
    provides: Audio streaming with HTTP Range
affects:
  - S05
key_files:
  - musicode-ui/src/context/PlayerContext.tsx
  - musicode-ui/src/hooks/usePlayer.ts
  - musicode-ui/src/components/player/PlayerBar.tsx
key_decisions:
  - useReducer for player state
  - new Audio() singleton managed by usePlayer hook
  - Album click queues all tracks
patterns_established:
  - PlayerContext with useReducer for global audio state
  - usePlayer hook encapsulates HTMLAudioElement lifecycle
  - TrackList onPlay callback pattern for click-to-play
observability_surfaces:
  - Console errors for playback failures
drill_down_paths:
  - .gsd/milestones/M001/slices/S04/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S04/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S04/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-30T09:34:42.166Z
blocker_discovered: false
---

# S04: Player + Queue — Full Playback Experience

**Full playback: click track → plays in player bar with seek, next/prev, volume, queue, and playing indicator.**

## What Happened

Built the complete playback experience across 3 tasks. T01 created PlayerContext with useReducer and usePlayer hook managing an HTMLAudioElement. T02 built the persistent PlayerBar with cover art, track info, play/pause/prev/next controls, click-to-seek progress bar, and volume slider. T03 wired click-to-play in all pages — album detail queues all tracks, tracks/search pages queue visible results, and currently playing track is highlighted in indigo with a musical note icon. Verified end-to-end: click track → audio plays → player bar appears → seek works → next advances queue → highlight follows.

## Verification

End-to-end verified: click track 3 in album → plays with highlight → player bar appears with cover art, title, progress (0:09/4:53) → seek to 0:53 works → next advances to track 4 with updated highlight and player bar.

## Requirements Advanced

- R004 — Full playback with seek, queue, and controls

## Requirements Validated

- R004 — Click track in album → audio plays with seek, next/prev navigates queue, volume works

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

No shuffle or repeat yet. No keyboard shortcuts.

## Follow-ups

None.

## Files Created/Modified

- `musicode-ui/src/context/PlayerContext.tsx` — Player state management with useReducer
- `musicode-ui/src/hooks/usePlayer.ts` — HTMLAudioElement control + actions
- `musicode-ui/src/components/player/PlayerBar.tsx` — Persistent playback controls bar
- `musicode-ui/src/components/layout/AppShell.tsx` — Added PlayerBar to layout
- `musicode-ui/src/App.tsx` — Wrapped with PlayerProvider
- `musicode-ui/src/components/library/TrackList.tsx` — Added onPlay + playing indicator
- `musicode-ui/src/pages/AlbumDetailPage.tsx` — Wired playAlbum on track click
- `musicode-ui/src/pages/TracksPage.tsx` — Wired playTrack with queue
- `musicode-ui/src/pages/SearchPage.tsx` — Wired playTrack with queue
