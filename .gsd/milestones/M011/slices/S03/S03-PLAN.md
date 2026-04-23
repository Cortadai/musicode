# S03: Accesibilidad (ARIA + semántica)

**Goal:** Full keyboard navigation and screen reader support for all player controls, track lists, and popovers.
**Demo:** Navegación completa con teclado. Screen reader anuncia todos los controles del player.

## Must-Haves

- Tab navigates through all player controls in logical order. Arrow keys adjust sliders. Escape closes popovers. Screen reader announces play state, volume level, track position, and toggle states. TrackRow is keyboard-activatable.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Replace div sliders with native range inputs in ProgressBar and VolumeControl** `est:45m`
  ProgressBar and VolumeControl use div+onClick for seek/volume — not focusable, not keyboard accessible. Replace with native <input type='range'> elements with proper ARIA labels (aria-label, aria-valuemin, aria-valuemax, aria-valuenow). Style to match current design using CSS appearance:none + custom track/thumb. Mute button gets aria-label that reflects muted/unmuted state.
  - Files: `musicode-ui/src/components/player/ProgressBar.tsx`, `musicode-ui/src/components/player/VolumeControl.tsx`
  - Verify: Tab focuses both sliders. Arrow keys adjust values. Screen reader announces 'Seek position' and 'Volume' with current values.

- [x] **T02: Add keyboard access and ARIA states to TrackRow and toggle buttons** `est:40m`
  TrackRow: add role='button', tabIndex={0}, onKeyDown for Enter/Space to trigger play. Add aria-label with track title/artist/duration. Mark current track with aria-current='true'. TransportControls: add aria-label to all buttons (Play/Pause reflecting state, Previous, Next). Shuffle gets aria-pressed. Repeat gets aria-label reflecting mode (Off/All/One). Visualizer mode buttons get aria-pressed for active mode.
  - Files: `musicode-ui/src/components/library/TrackList.tsx`, `musicode-ui/src/components/player/TransportControls.tsx`, `musicode-ui/src/components/player/Visualizer.tsx`
  - Verify: Tab reaches TrackRow, Enter plays track. Screen reader announces 'Play track [name] by [artist]'. Shuffle/repeat buttons announce pressed state.

- [x] **T03: Add popover accessibility — ARIA attributes, Escape key, and focus management** `est:45m`
  CrossfadePopover and EqPopover: add aria-haspopup='dialog' and aria-expanded on trigger buttons. Popover containers get role='dialog' and aria-label. Escape key closes popover. Focus moves into popover on open, returns to trigger on close. EQ toggle button gets role='switch' with aria-checked. Range inputs inside popovers get aria-label (e.g. 'Crossfade duration', '60Hz band', '250Hz band'). Preset select gets aria-label.
  - Files: `musicode-ui/src/components/player/CrossfadePopover.tsx`, `musicode-ui/src/components/player/EqPopover.tsx`
  - Verify: Open popover with Enter/Space. Escape closes it. Focus returns to trigger button. Screen reader announces 'Crossfade settings dialog' and 'Equalizer settings dialog'.

- [x] **T04: Add landmark regions, labels, and decorative ARIA to PlayerBar, TrackInfo, and AlbumCard** `est:20m`
  PlayerBar: wrap in role='region' with aria-label='Music player'. TrackInfo: aria-hidden='true' on decorative vinyl animation, aria-label on album link. AlbumCard: ensure alt text and link label are descriptive. Visualizer canvas: aria-label='Audio visualizer'. Hide purely decorative elements from screen reader tree.
  - Files: `musicode-ui/src/components/player/PlayerBar.tsx`, `musicode-ui/src/components/player/TrackInfo.tsx`, `musicode-ui/src/components/library/AlbumCard.tsx`, `musicode-ui/src/components/player/Visualizer.tsx`
  - Verify: Screen reader landmark navigation finds 'Music player' region. Decorative elements not announced. Album links have descriptive labels.

## Files Likely Touched

- musicode-ui/src/components/player/ProgressBar.tsx
- musicode-ui/src/components/player/VolumeControl.tsx
- musicode-ui/src/components/library/TrackList.tsx
- musicode-ui/src/components/player/TransportControls.tsx
- musicode-ui/src/components/player/Visualizer.tsx
- musicode-ui/src/components/player/CrossfadePopover.tsx
- musicode-ui/src/components/player/EqPopover.tsx
- musicode-ui/src/components/player/PlayerBar.tsx
- musicode-ui/src/components/player/TrackInfo.tsx
- musicode-ui/src/components/library/AlbumCard.tsx
