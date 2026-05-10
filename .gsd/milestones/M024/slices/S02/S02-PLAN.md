# S02: Test Coverage Boost

**Goal:** Subir cobertura de tests frontend de ~16% a ≥40% lines, enfocándose en utilidades puras, hooks críticos y contextos con lógica de negocio
**Demo:** Coverage report muestra >= 40% lines con tests significativos (no snapshots vacíos)

## Must-Haves

- Coverage report muestra >= 40% lines con tests significativos (no snapshots vacíos). Todos los tests pasan con vitest --run.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Tests de utilidades puras** `est:20min`
  Añadir tests para lrcParser, greetings, artistAvatar y ampliar format.test.ts. Son funciones puras sin dependencias de DOM — máximo ROI por esfuerzo.
  - Files: `musicode-ui/src/utils/lrcParser.test.ts`, `musicode-ui/src/utils/greetings.test.ts`, `musicode-ui/src/utils/artistAvatar.test.ts`, `musicode-ui/src/utils/format.test.ts`
  - Verify: vitest --run src/utils/ — todos pasan, cobertura de utils >80%

- [x] **T02: Tests de PlayerContext y usePlayer hook** `est:30min`
  Ampliar PlayerContext.test.ts existente con más casos (dispatch actions, estado inicial, reducers). Añadir tests para usePlayer hook mockeando Audio API.
  - Files: `musicode-ui/src/context/PlayerContext.test.ts`, `musicode-ui/src/hooks/usePlayer.test.ts`
  - Verify: vitest --run src/context/PlayerContext src/hooks/usePlayer — todos pasan, cobertura context >50%

- [x] **T03: Tests de ThemeProvider y sistema de temas** `est:25min`
  Testear ThemeProvider (cambio de shell, cambio de palette, persistencia en localStorage), useTheme hook, y validación de tokens.
  - Files: `musicode-ui/src/themes/ThemeProvider.test.tsx`, `musicode-ui/src/themes/useTheme.test.ts`
  - Verify: vitest --run src/themes/ — todos pasan, cobertura themes >60%

- [x] **T04: Tests de componentes player con lógica** `est:25min`
  Tests para ProgressBar (seek, drag, display), VolumeControl, y TransportControls edge cases. Componentes con lógica de interacción testeable.
  - Files: `musicode-ui/src/components/player/ProgressBar.test.tsx`, `musicode-ui/src/components/player/VolumeControl.test.tsx`
  - Verify: vitest --run src/components/player/ — todos pasan, cobertura player >35%

- [x] **T05: Verificación de cobertura global ≥40%** `est:10min`
  Ejecutar suite completa con coverage, verificar que se alcanza el objetivo de 40% lines. Ajustar si falta cobertura en algún área.
  - Verify: vitest --run --coverage muestra ≥40% lines en All files

## Files Likely Touched

- musicode-ui/src/utils/lrcParser.test.ts
- musicode-ui/src/utils/greetings.test.ts
- musicode-ui/src/utils/artistAvatar.test.ts
- musicode-ui/src/utils/format.test.ts
- musicode-ui/src/context/PlayerContext.test.ts
- musicode-ui/src/hooks/usePlayer.test.ts
- musicode-ui/src/themes/ThemeProvider.test.tsx
- musicode-ui/src/themes/useTheme.test.ts
- musicode-ui/src/components/player/ProgressBar.test.tsx
- musicode-ui/src/components/player/VolumeControl.test.tsx
