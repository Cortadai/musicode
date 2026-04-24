# S02: Now Playing overlay with animations and controls — UAT

**Milestone:** M013
**Written:** 2026-04-18T19:33:30.038Z

## UAT: S02 — Now Playing Overlay\n\n### Preconditions\n- App running, a track is playing\n\n### Test Cases\n\n- [x] **Open overlay**: Click album artwork in PlayerBar → overlay slides up from bottom\n- [x] **Track info displayed**: Title, artist, album name visible\n- [x] **Artwork large**: Album cover displayed at 256px (320px on md+)\n- [x] **Controls work**: Play/pause, next/prev, seek, volume, shuffle, repeat all functional inside overlay\n- [x] **Up Next**: Shows next track in queue (if any)\n- [x] **Dynamic theme toggle**: Palette button toggles dynamic background gradient from artwork colors\n- [x] **Close via ChevronDown**: Top-left button closes overlay with slide-down animation\n- [x] **Close via X**: Top-right X button closes overlay\n- [x] **Close via Escape**: Pressing Escape closes overlay\n- [x] **Track title still links to album**: Track name in PlayerBar still navigates to album page\n- [x] **No regression**: All existing playback, navigation, and controls work normally when overlay is closed
