---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T03: Tests de ThemeProvider y sistema de temas

Testear ThemeProvider (cambio de shell, cambio de palette, persistencia en localStorage), useTheme hook, y validación de tokens.

## Inputs

- `musicode-ui/src/themes/ThemeProvider.tsx`
- `musicode-ui/src/themes/useTheme.ts`
- `musicode-ui/src/themes/types.ts`
- `musicode-ui/src/themes/index.ts`

## Expected Output

- `ThemeProvider tests nuevos`
- `useTheme tests nuevos`
- `Cobertura themes >60%`

## Verification

vitest --run src/themes/ — todos pasan, cobertura themes >60%
