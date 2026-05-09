# S01: Token Architecture — Split Shell vs Palette

**Goal:** Split monolithic theme tokens into Shell (layout/structure) + Palette (colors) axes. ThemeProvider composes both at runtime. Users can toggle between Indigo and Cobalt palettes on any shell — backgrounds and accents change, layout stays fixed.
**Demo:** Toggle between Indigo and Cobalt palettes on evolved shell — backgrounds and accents change, layout stays fixed.

## Must-Haves

- 1. ShellTokens (7: fonts, radii, glassBlur) and PaletteTokens (33: all colors) are separate types. 2. Indigo and Cobalt palette files exist with correct color values. 3. Shell files contain only structural tokens. 4. ThemeProvider composes shell+palette and applies merged CSS vars. 5. Switching palette changes colors without affecting layout. 6. Both preferences persist independently in localStorage.

## Proof Level

- This slice proves: integration — real runtime in browser

## Integration Closure

Upstream: existing ThemeTokens, ThemeProvider, shell token files. New wiring: ThemeProvider composes ShellConfig + PaletteConfig into merged tokens. After this slice: palette selector UI not yet built (S04), but palette can be toggled programmatically or via temporary dev toggle.

## Verification

- Not provided.

## Tasks

- [x] **T01: Define ShellTokens, PaletteTokens, and PaletteName types** `est:20m`
  Split ThemeTokens interface into ShellTokens (fontBody, fontMono, radiusSm-Xl, glassBlur = 7 tokens) and PaletteTokens (33 color tokens). Add PaletteName type union. Update ThemeConfig to reference ShellConfig + palette separately. Keep ThemeTokens as the merged intersection for CSS var application.
  - Files: `musicode-ui/src/themes/types.ts`
  - Verify: TypeScript compiles with no errors: cd musicode-ui && npx tsc --noEmit

- [x] **T02: Create Indigo and Cobalt palette files** `est:25m`
  Create palettes/ directory with indigo.ts (color tokens from evolved) and cobalt.ts (color tokens from nova). Create palettes/index.ts exporting palette registry. Indigo is the default palette.
  - Files: `musicode-ui/src/themes/palettes/indigo.ts`, `musicode-ui/src/themes/palettes/cobalt.ts`, `musicode-ui/src/themes/palettes/index.ts`
  - Verify: TypeScript compiles: cd musicode-ui && npx tsc --noEmit

- [x] **T03: Refactor shell token files to structural-only** `est:20m`
  Strip all 33 color tokens from evolved.ts, nova.ts, minimal.ts — keep only name, label, layout, and 7 structural tokens (fonts, radii, glassBlur). Update ThemeConfig type reference. Shell files export ShellConfig instead of ThemeConfig.
  - Files: `musicode-ui/src/themes/tokens/evolved.ts`, `musicode-ui/src/themes/tokens/nova.ts`, `musicode-ui/src/themes/tokens/minimal.ts`
  - Verify: TypeScript compiles: cd musicode-ui && npx tsc --noEmit

- [x] **T04: Update ThemeProvider to compose shell × palette** `est:30m`
  ThemeProvider manages two state axes: shell (ThemeName) and palette (PaletteName). Merges ShellTokens + PaletteTokens into ThemeTokens before applying CSS vars. Dual localStorage keys: musicode-shell and musicode-palette. Backward compat: migrate old musicode-theme key to musicode-shell. Export palette state and setter in ThemeContextValue. Update useTheme hook.
  - Files: `musicode-ui/src/themes/ThemeProvider.tsx`, `musicode-ui/src/themes/useTheme.ts`, `musicode-ui/src/themes/index.ts`
  - Verify: TypeScript compiles and dev server loads without console errors: cd musicode-ui && npx tsc --noEmit

- [x] **T05: Fix consumers and verify shell × palette in browser** `est:30m`
  Update ThemeSelector and any other consumers that reference old ThemeConfig shape. Verify in browser: load app with Indigo palette on evolved shell, switch to Cobalt via console (or temp UI), confirm backgrounds shift to cooler blue tint while layout stays. Test on all 3 shells.
  - Files: `musicode-ui/src/components/layout/ThemeSelector.tsx`, `musicode-ui/src/pages/SettingsPage.tsx`
  - Verify: App loads on localhost:5173 with no console errors. Visual verification: Indigo and Cobalt produce different background colors on same shell.

## Files Likely Touched

- musicode-ui/src/themes/types.ts
- musicode-ui/src/themes/palettes/indigo.ts
- musicode-ui/src/themes/palettes/cobalt.ts
- musicode-ui/src/themes/palettes/index.ts
- musicode-ui/src/themes/tokens/evolved.ts
- musicode-ui/src/themes/tokens/nova.ts
- musicode-ui/src/themes/tokens/minimal.ts
- musicode-ui/src/themes/ThemeProvider.tsx
- musicode-ui/src/themes/useTheme.ts
- musicode-ui/src/themes/index.ts
- musicode-ui/src/components/layout/ThemeSelector.tsx
- musicode-ui/src/pages/SettingsPage.tsx
