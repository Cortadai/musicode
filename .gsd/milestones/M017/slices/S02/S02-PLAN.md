# S02: PlayerBar Responsive

**Goal:** PlayerBar remains usable and visually clean down to 800px viewport width — no overflow, no clipping, no lost controls.
**Demo:** Reducir ventana a 800px → PlayerBar muestra todos los controles sin overflow. TrackInfo trunca texto largo.

## Must-Haves

- 1. No horizontal overflow at 800px viewport width\n2. TrackInfo truncates gracefully — artwork + title visible, artist may truncate\n3. Transport controls (prev/play/next) always visible and tappable\n4. Volume, scrobble indicator, and auxiliary popovers hide or collapse below breakpoint\n5. ProgressBar remains functional at all supported widths

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: TrackInfo responsive shrink** `est:20min`
  Replace w-60 shrink-0 with min-w-0 flex-shrink and responsive width classes. Ensure artwork stays visible, title truncates with ellipsis, and artist line truncates or hides below a breakpoint.
  - Files: `musicode-ui/src/components/player/TrackInfo.tsx`
  - Verify: Resize to 800px — artwork visible, title truncates, no overflow

- [x] **T02: Right controls responsive collapse** `est:25min`
  Replace w-48 shrink-0 with responsive classes. Hide VolumeControl and auxiliary popovers (CrossfadePopover, EqPopover) below 900px. Keep ScrobbleIndicator visible as it's a small icon. Use Tailwind responsive variants.
  - Files: `musicode-ui/src/components/player/PlayerBar.tsx`, `musicode-ui/src/components/player/VolumeControl.tsx`
  - Verify: Resize to 800px — volume and popovers hidden, scrobble indicator visible, no overflow

- [x] **T03: Center section and ProgressBar flex adaptation** `est:20min`
  Ensure center section (TransportControls + ProgressBar) fills available space properly when siblings shrink. Remove max-w-2xl constraint below a breakpoint so progress bar uses full available width. Reduce gap/padding at smaller viewports.
  - Files: `musicode-ui/src/components/player/PlayerBar.tsx`, `musicode-ui/src/components/player/ProgressBar.tsx`
  - Verify: At 800px — transport controls centered, progress bar fills available space, time labels visible

- [x] **T04: Integration test and edge cases** `est:15min`
  Verify the full PlayerBar at 800px, 900px, 1024px, and 1280px. Check waveform toggle height transition still works. Verify no z-index or overflow issues with sidebar collapse from S01. Fix any visual regressions.
  - Files: `musicode-ui/src/components/player/PlayerBar.tsx`
  - Verify: Visual verification at all four breakpoints — no overflow, no clipping, waveform toggle works

## Files Likely Touched

- musicode-ui/src/components/player/TrackInfo.tsx
- musicode-ui/src/components/player/PlayerBar.tsx
- musicode-ui/src/components/player/VolumeControl.tsx
- musicode-ui/src/components/player/ProgressBar.tsx
