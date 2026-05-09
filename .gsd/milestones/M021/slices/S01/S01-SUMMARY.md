---
id: S01
parent: M021
milestone: M021
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["musicode-ui/src/themes/types.ts", "musicode-ui/src/themes/palettes/indigo.ts", "musicode-ui/src/themes/palettes/cobalt.ts", "musicode-ui/src/themes/tokens/evolved.ts", "musicode-ui/src/themes/tokens/nova.ts", "musicode-ui/src/themes/tokens/minimal.ts", "musicode-ui/src/themes/ThemeProvider.tsx", "musicode-ui/src/themes/index.ts"]
key_decisions:
  - (none)
patterns_established:
  - ["Shell tokens export ShellTokens type (structural only), palette tokens export PaletteTokens type (colors only)", "ThemeProvider composes shell × palette at runtime via CSS custom properties", "Palette selected via localStorage key 'musicode-palette' with fallback to 'indigo'"]
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-05-09T09:05:07.169Z
blocker_discovered: false
---

# S01: Token Architecture — Split Shell vs Palette

**Split monolithic theme tokens into orthogonal Shell (layout) × Palette (colors) axes**

## What Happened

Refactored the theme system from 3 monolithic theme files (each containing both layout and color tokens) into a two-axis architecture. Shell tokens (evolved, nova, minimal) now contain only structural properties (layout, radius, spacing, typography, glass structure). Palette tokens (indigo, cobalt) contain only colors (backgrounds, surfaces, borders, text, accents). ThemeProvider composes them at runtime, enabling any shell × palette combination. This is the foundation for S02–S04.

## Verification

User confirmed both Indigo and Cobalt palettes apply correctly across all 3 shells. TypeScript compiles clean.

## Requirements Advanced

None.

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
