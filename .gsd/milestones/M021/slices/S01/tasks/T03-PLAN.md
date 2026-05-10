---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T03: Refactor shell token files to structural-only

Strip all 33 color tokens from evolved.ts, nova.ts, minimal.ts — keep only name, label, layout, and 7 structural tokens (fonts, radii, glassBlur). Update ThemeConfig type reference. Shell files export ShellConfig instead of ThemeConfig.

## Inputs

- `musicode-ui/src/themes/types.ts`
- `musicode-ui/src/themes/tokens/evolved.ts`
- `musicode-ui/src/themes/tokens/nova.ts`
- `musicode-ui/src/themes/tokens/minimal.ts`

## Expected Output

- `musicode-ui/src/themes/tokens/evolved.ts`
- `musicode-ui/src/themes/tokens/nova.ts`
- `musicode-ui/src/themes/tokens/minimal.ts`

## Verification

TypeScript compiles: cd musicode-ui && npx tsc --noEmit
