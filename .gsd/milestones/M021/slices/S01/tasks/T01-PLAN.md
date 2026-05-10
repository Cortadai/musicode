---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Define ShellTokens, PaletteTokens, and PaletteName types

Split ThemeTokens interface into ShellTokens (fontBody, fontMono, radiusSm-Xl, glassBlur = 7 tokens) and PaletteTokens (33 color tokens). Add PaletteName type union. Update ThemeConfig to reference ShellConfig + palette separately. Keep ThemeTokens as the merged intersection for CSS var application.

## Inputs

- `musicode-ui/src/themes/types.ts`

## Expected Output

- `musicode-ui/src/themes/types.ts`

## Verification

TypeScript compiles with no errors: cd musicode-ui && npx tsc --noEmit
