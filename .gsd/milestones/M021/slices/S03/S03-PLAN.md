# S03: Light Palettes — Daylight, Sunrise, Frost

**Goal:** Add 3 light palettes (Daylight, Sunrise, Frost) and fix card visibility on light backgrounds
**Demo:** Switch from Indigo dark to Daylight light on evolved shell — full light-mode experience.

## Must-Haves

- Not provided.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Create Daylight, Sunrise, Frost light palette files** `est:30m`
  Define 3 light PaletteTokens with appropriate light backgrounds, dark text, and matching accents. Include light-aware glass tokens.
  - Files: `musicode-ui/src/themes/palettes/daylight.ts`, `musicode-ui/src/themes/palettes/sunrise.ts`, `musicode-ui/src/themes/palettes/frost.ts`
  - Verify: TypeScript compiles, palettes render in browser

- [x] **T02: Fix card visibility on light backgrounds** `est:25m`
  Replace hardcoded rgba glass values in AlbumCard, ArtistCard, HomePage cards, and StatsPage cards with CSS custom properties from the palette. Add border-subtle token for card definition on light backgrounds.
  - Files: `musicode-ui/src/components/library/AlbumCard.tsx`, `musicode-ui/src/components/library/ArtistCard.tsx`, `musicode-ui/src/pages/HomePage.tsx`, `musicode-ui/src/pages/StatsPage.tsx`
  - Verify: Cards visible and well-defined on all light palettes, dark palettes unaffected

## Files Likely Touched

- musicode-ui/src/themes/palettes/daylight.ts
- musicode-ui/src/themes/palettes/sunrise.ts
- musicode-ui/src/themes/palettes/frost.ts
- musicode-ui/src/components/library/AlbumCard.tsx
- musicode-ui/src/components/library/ArtistCard.tsx
- musicode-ui/src/pages/HomePage.tsx
- musicode-ui/src/pages/StatsPage.tsx
