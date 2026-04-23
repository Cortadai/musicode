---
id: S01
parent: M013
milestone: M013
provides:
  - ["colorExtraction: extractColors(albumId) → ColorPalette", "useDynamicTheme: { enabled, toggle, colors } hook", "CSS variables: --np-color-1, --np-color-2, --np-bg"]
requires:
  []
affects:
  []
key_files:
  - ["musicode-ui/src/audio/colorExtraction.ts", "musicode-ui/src/hooks/useDynamicTheme.ts", "musicode-ui/src/audio/audioPreferences.ts"]
key_decisions:
  - (none)
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-18T19:29:13.506Z
blocker_discovered: false
---

# S01: Color extraction engine with opt-in dynamic theming

**Canvas-based color extraction from album artwork with opt-in CSS variable injection, cached by albumId**

## What Happened

Built the foundation for dynamic theming: a color extraction engine that downscales album artwork to 64x64 canvas, quantizes pixels into frequency buckets, picks top 2 dominant colors, and normalizes brightness to 105-185 range for readability. Results cached in memory by albumId. The useDynamicTheme hook connects extraction to PlayerContext — when enabled, it sets CSS custom properties (--np-color-1, --np-color-2, --np-bg) on document root on track change. Disabled by default; toggle persists via audioPreferences localStorage. Fallback palette uses existing indigo/zinc theme colors.

## Verification

TypeScript clean, 117 tests pass (8 new: 5 colorExtraction + 3 audioPreferences dynamicTheme)

## Requirements Advanced

- R025 — Color extraction engine implemented and ready for consumers (Now Playing overlay in S02/S03)

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

None.
