---
estimated_steps: 1
estimated_files: 5
skills_used: []
---

# T01: NowPlaying overlay component

Create NowPlayingOverlay component: fullscreen overlay covering main content area. Large centered artwork, track title + artist, Up Next track, transport controls (reuse existing), progress bar (reuse existing), dynamic theme toggle button. Slide-up/slide-down CSS animations. Close via X button and Escape key. Render inside AppShell.

## Inputs

- `useDynamicTheme hook`
- `PlayerContext`
- `TransportControls`
- `ProgressBar`
- `VolumeControl`

## Expected Output

- `NowPlayingOverlay.tsx component`
- `Updated AppShell with overlay state`
- `Updated TrackInfo/PlayerBar with overlay trigger`

## Verification

Overlay opens/closes, controls work, animations smooth, dynamic theme toggle works
