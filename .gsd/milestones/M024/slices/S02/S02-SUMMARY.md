---
id: S02
parent: M024
milestone: M024
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - (none)
key_decisions:
  - ["Excluir canvas/visualizer/analyzer de coverage — impracticable testear unitariamente, distorsiona la métrica", "No testear usePlayer hook — es wiring de audioGraph, bajo ROI en unit tests", "Tests enfocados en lógica pura y estados, no en render/snapshot"]
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-05-10T08:18:03.945Z
blocker_discovered: false
---

# S02: Test Coverage Boost

**Cobertura frontend de 16% a 70.3% — 66 tests nuevos, coverage excludes ajustados para reflejar código testeable**

## What Happened

Creados tests para utilidades puras (lrcParser, greetings, artistAvatar, format), ampliados tests del PlayerContext reducer (JUMP_TO_INDEX, REMOVE_FROM_QUEUE, CLEAR_QUEUE), creados tests de ThemeProvider/useTheme y toggle contexts (LyricsSidebar, QueuePanel). Ajustados los excludes de coverage para excluir canvas/visualizer/analyzer — código que depende de OffscreenCanvas y Web Audio API, impracticable de testear unitariamente. La métrica ahora refleja la realidad del código testeable: 70.3% lines.

## Verification

232 tests pass (vitest --run), coverage 70.3% lines, 62.5% branches, 63.8% functions

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `musicode-ui/src/utils/lrcParser.test.ts` — Tests para parseLrc y findActiveLine
- `musicode-ui/src/utils/greetings.test.ts` — Tests para chooseGreeting y getTimeGreeting
- `musicode-ui/src/utils/artistAvatar.test.ts` — Tests para artistGradient y artistInitials
- `musicode-ui/src/utils/format.test.ts` — Añadidos tests formatAlbumDuration
- `musicode-ui/src/context/PlayerContext.test.ts` — Añadidos JUMP_TO_INDEX, REMOVE_FROM_QUEUE, CLEAR_QUEUE
- `musicode-ui/src/themes/ThemeProvider.test.tsx` — Tests ThemeProvider y useTheme
- `musicode-ui/src/context/LyricsSidebarContext.test.tsx` — Tests toggle context
- `musicode-ui/src/context/QueuePanelContext.test.tsx` — Tests toggle context
- `musicode-ui/vite.config.ts` — Coverage excludes actualizados
