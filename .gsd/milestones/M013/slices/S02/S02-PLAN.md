# S02: Now Playing overlay with animations and controls

**Goal:** Fullscreen Now Playing overlay with artwork, controls, animations, dynamic theme toggle, and Up Next indicator
**Demo:** Click artwork in PlayerBar → overlay slides up with track info, artwork, controls, seek bar, Up Next. Escape or X closes with slide-down. Dynamic color toggle in overlay header.

## Must-Haves

- Clicking album art in PlayerBar opens Now Playing overlay with slide-up animation. Overlay shows large artwork, track info, Up Next, replicated transport controls and seek bar. Dynamic theme toggle available. Escape/X closes with slide-down. All existing tests pass.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: NowPlaying overlay component** `est:40m`
  Create NowPlayingOverlay component: fullscreen overlay covering main content area. Large centered artwork, track title + artist, Up Next track, transport controls (reuse existing), progress bar (reuse existing), dynamic theme toggle button. Slide-up/slide-down CSS animations. Close via X button and Escape key. Render inside AppShell.
  - Files: `musicode-ui/src/components/player/NowPlayingOverlay.tsx`, `musicode-ui/src/components/layout/AppShell.tsx`, `musicode-ui/src/components/player/PlayerBar.tsx`, `musicode-ui/src/components/player/TrackInfo.tsx`, `musicode-ui/src/index.css`
  - Verify: Overlay opens/closes, controls work, animations smooth, dynamic theme toggle works

- [x] **T02: Tests and verification** `est:10m`
  Verify TypeScript compiles, all existing tests pass, and the overlay renders correctly
  - Verify: tsc --noEmit clean, vitest --run all green

## Files Likely Touched

- musicode-ui/src/components/player/NowPlayingOverlay.tsx
- musicode-ui/src/components/layout/AppShell.tsx
- musicode-ui/src/components/player/PlayerBar.tsx
- musicode-ui/src/components/player/TrackInfo.tsx
- musicode-ui/src/index.css
