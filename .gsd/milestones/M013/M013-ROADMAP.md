# M013: Visual Experience

## Vision
Immersive Now Playing overlay with dynamic artwork-driven theming, enhanced visualizer integration, and scrobble status feedback. The overlay uses the existing dark theme by default, with optional dynamic color mode that extracts palette from album artwork.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | S01 | medium | — | ✅ | Toggle dynamic color mode in Now Playing area — background shifts to artwork-derived gradient. Toggle off — returns to standard dark theme. |
| S02 | S02 | high | — | ✅ | Click artwork in PlayerBar → overlay slides up with track info, artwork, controls, seek bar, Up Next. Escape or X closes with slide-down. Dynamic color toggle in overlay header. |
| S03 | S03 | medium | — | ✅ | Inside Now Playing overlay, toggle visualizer on — canvas renders full-size behind artwork. Switch between bars/waveform/circular modes. Change track — artwork crossfades smoothly. |
| S04 | S04 | low | — | ✅ | Play a track past 50% — scrobble dot appears in PlayerBar using accent color. Simulate scrobble failure — dot changes to warning color with tooltip showing error. |
