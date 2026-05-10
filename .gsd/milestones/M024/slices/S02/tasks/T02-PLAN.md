---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T02: Tests de PlayerContext y usePlayer hook

Ampliar PlayerContext.test.ts existente con más casos (dispatch actions, estado inicial, reducers). Añadir tests para usePlayer hook mockeando Audio API.

## Inputs

- `musicode-ui/src/context/PlayerContext.tsx`
- `musicode-ui/src/hooks/usePlayer.ts`

## Expected Output

- `PlayerContext tests ampliados`
- `usePlayer tests nuevos`
- `Cobertura context >50%`

## Verification

vitest --run src/context/PlayerContext src/hooks/usePlayer — todos pasan, cobertura context >50%
