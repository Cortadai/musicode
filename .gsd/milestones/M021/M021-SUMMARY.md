---
id: M021
title: "Shell × Palette — Orthogonal Theme System"
status: complete
completed_at: 2026-05-09T09:46:28.071Z
key_decisions:
  - Orthogonal shell × palette architecture via CSS custom properties
  - 9 palettes: 6 dark + 3 light
  - Renamed Cobalt→Indigo, Indigo→Zinc for semantic accuracy
  - Added swatch field to PaletteConfig for selector differentiation
  - Zinc as default palette
  - Deck handle uses palette-specific token with hardcoded value for Indigo
key_files:
  - musicode-ui/src/themes/types.ts
  - musicode-ui/src/themes/index.ts
  - musicode-ui/src/themes/ThemeProvider.tsx
  - musicode-ui/src/components/layout/PaletteSelector.tsx
  - musicode-ui/src/pages/SettingsPage.tsx
  - musicode-ui/src/themes/palettes/
  - musicode-ui/src/components/analyzer/AnalyzerDeck.css
lessons_learned:
  - CSS custom properties make orthogonal theming straightforward — palette sets variables, shell sets layout, no coupling needed
  - Custom swatch field useful when palette accent color alone doesn't differentiate in a selector UI
---

# M021: Shell × Palette — Orthogonal Theme System

**Separated monolithic themes into independent shell (layout) and palette (color) axes, enabling 27 combinations with a visual palette selector**

## What Happened

Transformed the 3-theme monolithic system into a 2-axis orthogonal architecture: 3 shells (evolved, nova, minimal) × 9 palettes (6 dark: zinc, indigo, crimson, emerald, amber, cyan + 3 light: daylight, dawn, dusk). Each palette defines a complete color set (backgrounds, accents, borders, status colors) applied via CSS custom properties. Built PaletteSelector component with visual swatches in Settings. Added themed play button and analyzer deck handle. Renamed Cobalt→Indigo and Indigo→Zinc for semantic clarity. Set Zinc as default palette.

## Success Criteria Results



## Definition of Done Results



## Requirement Outcomes



## Deviations

None.

## Follow-ups

Potential future work: more palettes (seasonal, high-contrast accessibility), palette import/export, user-created custom palettes
