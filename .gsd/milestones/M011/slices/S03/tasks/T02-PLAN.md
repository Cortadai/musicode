---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T02: Add keyboard access and ARIA states to TrackRow and toggle buttons

TrackRow: add role='button', tabIndex={0}, onKeyDown for Enter/Space to trigger play. Add aria-label with track title/artist/duration. Mark current track with aria-current='true'. TransportControls: add aria-label to all buttons (Play/Pause reflecting state, Previous, Next). Shuffle gets aria-pressed. Repeat gets aria-label reflecting mode (Off/All/One). Visualizer mode buttons get aria-pressed for active mode.

## Inputs

- `musicode-ui/src/components/library/TrackList.tsx`
- `musicode-ui/src/components/player/TransportControls.tsx`
- `musicode-ui/src/components/player/Visualizer.tsx`

## Expected Output

- `musicode-ui/src/components/library/TrackList.tsx`
- `musicode-ui/src/components/player/TransportControls.tsx`
- `musicode-ui/src/components/player/Visualizer.tsx`

## Verification

Tab reaches TrackRow, Enter plays track. Screen reader announces 'Play track [name] by [artist]'. Shuffle/repeat buttons announce pressed state.
