---
id: T03
parent: S04
milestone: M001
provides: []
requires: []
affects: []
key_files: ["musicode-ui/src/components/library/TrackList.tsx", "musicode-ui/src/pages/AlbumDetailPage.tsx", "musicode-ui/src/pages/TracksPage.tsx", "musicode-ui/src/pages/SearchPage.tsx"]
key_decisions: ["Album detail click queues all album tracks and starts from clicked index", "Track list in Tracks page and Search page queues visible tracks", "Currently playing track highlighted with indigo color and musical note icon"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "Click track 3 in album → plays with highlight. Click Next → track 4 plays, highlight moves. Seek works. All pages wire onPlay correctly."
completed_at: 2026-03-30T09:34:13.330Z
blocker_discovered: false
---

# T03: Click-to-play wired in all pages with queue management and playing indicator.

> Click-to-play wired in all pages with queue management and playing indicator.

## What Happened
---
id: T03
parent: S04
milestone: M001
key_files:
  - musicode-ui/src/components/library/TrackList.tsx
  - musicode-ui/src/pages/AlbumDetailPage.tsx
  - musicode-ui/src/pages/TracksPage.tsx
  - musicode-ui/src/pages/SearchPage.tsx
key_decisions:
  - Album detail click queues all album tracks and starts from clicked index
  - Track list in Tracks page and Search page queues visible tracks
  - Currently playing track highlighted with indigo color and musical note icon
duration: ""
verification_result: passed
completed_at: 2026-03-30T09:34:13.331Z
blocker_discovered: false
---

# T03: Click-to-play wired in all pages with queue management and playing indicator.

**Click-to-play wired in all pages with queue management and playing indicator.**

## What Happened

Wired click-to-play in all pages. TrackList accepts onPlay callback, shows playing indicator (indigo text + ♪ icon). AlbumDetailPage queues all album tracks on click. TracksPage and SearchPage queue visible tracks. Next button advances to next track in queue, highlight follows.

## Verification

Click track 3 in album → plays with highlight. Click Next → track 4 plays, highlight moves. Seek works. All pages wire onPlay correctly.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `click track 3 in album detail` | 0 | ✅ pass — track 3 plays, highlighted in indigo | 2000ms |
| 2 | `click Next button` | 0 | ✅ pass — track 4 plays, highlight moved | 2000ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/components/library/TrackList.tsx`
- `musicode-ui/src/pages/AlbumDetailPage.tsx`
- `musicode-ui/src/pages/TracksPage.tsx`
- `musicode-ui/src/pages/SearchPage.tsx`


## Deviations
None.

## Known Issues
None.
