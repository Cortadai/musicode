---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T02: Fix card visibility on light backgrounds

Replace hardcoded rgba glass values in AlbumCard, ArtistCard, HomePage cards, and StatsPage cards with CSS custom properties from the palette. Add border-subtle token for card definition on light backgrounds.

## Inputs

- `Light palettes from T01`
- `User screenshots showing camouflage problem`

## Expected Output

- `Cards with proper borders/backgrounds on light themes`

## Verification

Cards visible and well-defined on all light palettes, dark palettes unaffected
