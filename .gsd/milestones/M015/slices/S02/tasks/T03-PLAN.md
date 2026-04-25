---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T03: NowPlayingOverlay integration — toggle + split layout

Add lyrics toggle button (microphone icon) to NowPlayingOverlay toolbar. When active: split layout with cover+controls on left (narrower), LyricsPanel on right. When inactive: existing full layout. Persist toggle state in localStorage. Fetch lyrics on track change when panel is visible. Ensure visualizer still renders behind the overlay.

## Inputs

- `LyricsPanel component`
- `useLyrics hook`
- `Existing NowPlayingOverlay structure`

## Expected Output

- `Updated NowPlayingOverlay with lyrics integration`

## Verification

Toggle shows/hides lyrics panel. Split layout renders correctly. Visualizer unaffected. State persists across page refreshes. No regressions in existing NowPlaying UX.
