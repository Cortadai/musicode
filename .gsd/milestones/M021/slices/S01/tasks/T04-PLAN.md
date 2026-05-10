---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T04: Update ThemeProvider to compose shell × palette

ThemeProvider manages two state axes: shell (ThemeName) and palette (PaletteName). Merges ShellTokens + PaletteTokens into ThemeTokens before applying CSS vars. Dual localStorage keys: musicode-shell and musicode-palette. Backward compat: migrate old musicode-theme key to musicode-shell. Export palette state and setter in ThemeContextValue. Update useTheme hook.

## Inputs

- `musicode-ui/src/themes/ThemeProvider.tsx`
- `musicode-ui/src/themes/useTheme.ts`
- `musicode-ui/src/themes/types.ts`
- `musicode-ui/src/themes/palettes/index.ts`

## Expected Output

- `musicode-ui/src/themes/ThemeProvider.tsx`
- `musicode-ui/src/themes/useTheme.ts`
- `musicode-ui/src/themes/index.ts`

## Verification

TypeScript compiles and dev server loads without console errors: cd musicode-ui && npx tsc --noEmit
