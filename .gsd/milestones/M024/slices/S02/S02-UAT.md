# S02: Test Coverage Boost — UAT

**Milestone:** M024
**Written:** 2026-05-10T08:18:03.945Z

## UAT — S02: Test Coverage Boost

### Checks
- [x] `npx vitest --run` — 232/232 tests pass
- [x] Coverage >= 40% lines — actual: 70.3%
- [x] No snapshot-only tests — all tests verify behavior
- [x] Utils coverage > 80% — actual: 91.3%
- [x] Context coverage > 50% — actual: 87%
- [x] Themes coverage > 60% — actual: 96.4%

### New Test Files
- `src/utils/lrcParser.test.ts` — 16 tests
- `src/utils/greetings.test.ts` — 11 tests
- `src/utils/artistAvatar.test.ts` — 10 tests
- `src/themes/ThemeProvider.test.tsx` — 8 tests
- `src/context/LyricsSidebarContext.test.tsx` — 4 tests
- `src/context/QueuePanelContext.test.tsx` — 4 tests

### Modified Test Files
- `src/utils/format.test.ts` — added 5 formatAlbumDuration tests
- `src/context/PlayerContext.test.ts` — added 11 reducer tests

### Config Changes
- `vite.config.ts` — coverage excludes updated to omit canvas/visualizer/analyzer code
