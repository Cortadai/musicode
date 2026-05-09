---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T04: Adapt EqPopover.tsx to new engine API

Update EqPopover to use new eqProcessor API. Keep the existing 5-slider UI for now (S05 will build the full panel), but wire it to the new band model. Preset application uses new applyPreset(). Toggle uses new enable/disable. Band changes call updateBand() with full EqBand object.

## Inputs

- `Updated eqProcessor.ts API`
- `Updated audioPreferences.ts`

## Expected Output

- `EqPopover.tsx adapted to new engine, visually unchanged`

## Verification

Build compiles. EQ popover opens, sliders move, presets apply, toggle works.
