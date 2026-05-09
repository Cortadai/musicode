# S04: Palette Selector UI + Persistence

**Goal:** Add a Palette Selector UI in Settings alongside the existing Shell selector, with visual swatches and proper persistence
**Demo:** Open Settings, pick a shell, pick a palette — both persist independently after page reload.

## Must-Haves

- User can select any of the 9 palettes from Settings UI, selection persists across reloads, current palette is visually indicated

## Proof Level

- This slice proves: integration

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Build PaletteSelector component with color swatches** `est:30m`
  Create a PaletteSelector component that shows all 9 palettes as selectable swatches grouped by dark/light. Each swatch shows the palette's accent color and label. Uses useTheme().setPalette() for selection. Active palette highlighted.
  - Files: `musicode-ui/src/components/layout/PaletteSelector.tsx`
  - Verify: Component renders all 9 palettes, clicking one changes the palette, active state visible

- [x] **T02: Integrate PaletteSelector into SettingsPage** `est:10m`
  Add PaletteSelector to the Appearance section of SettingsPage below the existing ThemeSelector. Label it clearly.
  - Files: `musicode-ui/src/pages/SettingsPage.tsx`
  - Verify: Settings page shows both Shell and Palette selectors, palette changes persist on reload

- [x] **T03: Verify full matrix in browser** `est:15m`
  Test multiple shell × palette combinations in the running app. Verify persistence, visual correctness, and no regressions.
  - Verify: At least 3 shell × palette combos tested, persistence confirmed, no visual regressions

## Files Likely Touched

- musicode-ui/src/components/layout/PaletteSelector.tsx
- musicode-ui/src/pages/SettingsPage.tsx
