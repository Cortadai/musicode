---
id: M013
title: "Visual Experience"
status: complete
completed_at: 2026-04-24T14:51:50.801Z
key_decisions:
  - Canvas-based color extraction with 64x64 downscale and frequency-bucket quantization
  - createPortal to document.body for overlay to escape PlayerBar CSS transform stacking context
  - Visualizer consumes dynamicColors from useDynamicTheme when active, falls back to indigo
  - ScrobbleIndicator only renders when Last.fm or ListenBrainz is configured
key_files:
  - musicode-ui/src/components/player/NowPlayingOverlay.tsx
  - musicode-ui/src/components/player/Visualizer.tsx
  - musicode-ui/src/audio/colorExtraction.ts
  - musicode-ui/src/hooks/useDynamicTheme.ts
  - musicode-ui/src/components/player/ScrobbleIndicator.tsx
  - musicode-ui/src/hooks/useScrobble.ts
lessons_learned:
  - Portal rendering needed for fullscreen overlays when parent has CSS transform
  - Visualizer color integration should consume the shared theme hook rather than maintaining a separate palette
---

# M013: Visual Experience

**Immersive Now Playing overlay with artwork-driven dynamic theming, full-size visualizer with mode switching, and scrobble status indicator.**

## What Happened

M013 delivered four slices building the visual experience layer. S01 built the color extraction engine — canvas-based dominant color extraction from album artwork with opt-in CSS variable injection, cached by albumId. S02 created the fullscreen Now Playing overlay — fixed-position panel with slide-up animation, large artwork, full transport controls, seek/volume bars, dynamic theme toggle, and Up Next indicator. S03 integrated the visualizer into the overlay — full-size canvas rendering behind artwork with bars/waveform/circular mode switching and smooth artwork crossfade on track change. The visualizer consumes dynamic theme colors when active. S04 added the scrobble status indicator — Radio icon in PlayerBar showing idle/reported/error states with accent color and tooltip, only visible when scrobbling is configured. Validation passed after connecting Visualizer to the dynamic color extraction engine (S01→S03 integration) and completing all UAT checklists.

## Success Criteria Results

All 4 slices delivered and verified. TypeScript clean, 117 frontend tests pass, production build succeeds. Manual UAT completed for all slices.

## Definition of Done Results



## Requirement Outcomes

R024 validated — fullscreen Now Playing overlay with all planned features. R025 validated — color extraction engine with dynamic theming. R026 validated — circular/radial visualization with mode switching in overlay context.

## Deviations

None.

## Follow-ups

None.
