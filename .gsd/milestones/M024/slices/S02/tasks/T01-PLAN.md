---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T01: Tests de utilidades puras

Añadir tests para lrcParser, greetings, artistAvatar y ampliar format.test.ts. Son funciones puras sin dependencias de DOM — máximo ROI por esfuerzo.

## Inputs

- `musicode-ui/src/utils/lrcParser.ts`
- `musicode-ui/src/utils/greetings.ts`
- `musicode-ui/src/utils/artistAvatar.ts`
- `musicode-ui/src/utils/format.ts`

## Expected Output

- `4 archivos de test nuevos/ampliados`
- `Cobertura utils >80%`

## Verification

vitest --run src/utils/ — todos pasan, cobertura de utils >80%
