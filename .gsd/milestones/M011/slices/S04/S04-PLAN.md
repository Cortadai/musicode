# S04: Tests de componentes y hooks

**Goal:** Write Vitest + Testing Library tests for the 6 extracted player sub-components and verify coverage. Update coverage config to include player components.
**Demo:** Vitest + Testing Library ejecutan tests de componentes extraídos y hooks críticos con cobertura >60%.

## Must-Haves

- All 6 player sub-components have test files. `vitest run` passes with 0 failures. Player component coverage included in report.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Tests for ProgressBar, VolumeControl, TransportControls** `est:20min`
  Write tests for the 3 pure presentational components that take props and render UI. No routing or module mocking needed — just render + fireEvent + assertions.
  - Files: `musicode-ui/src/components/player/ProgressBar.test.tsx`, `musicode-ui/src/components/player/VolumeControl.test.tsx`, `musicode-ui/src/components/player/TransportControls.test.tsx`
  - Verify: cd musicode-ui && npx vitest run --reporter=verbose src/components/player/ProgressBar.test.tsx src/components/player/VolumeControl.test.tsx src/components/player/TransportControls.test.tsx

- [x] **T02: Tests for TrackInfo and CrossfadePopover** `est:25min`
  TrackInfo needs react-router MemoryRouter wrapper for Link components. CrossfadePopover has internal open/close state, keyboard interaction (Escape), and focus management — test toggle, slider change, and keyboard dismiss.
  - Files: `musicode-ui/src/components/player/TrackInfo.test.tsx`, `musicode-ui/src/components/player/CrossfadePopover.test.tsx`
  - Verify: cd musicode-ui && npx vitest run --reporter=verbose src/components/player/TrackInfo.test.tsx src/components/player/CrossfadePopover.test.tsx

- [x] **T03: Tests for EqPopover** `est:25min`
  EqPopover depends on eqProcessor (Web Audio) and audioPreferences (localStorage). Mock both modules with vi.mock(). Test toggle, preset change, band slider change, keyboard dismiss.
  - Files: `musicode-ui/src/components/player/EqPopover.test.tsx`
  - Verify: cd musicode-ui && npx vitest run --reporter=verbose src/components/player/EqPopover.test.tsx

- [x] **T04: Update coverage config and run full verification** `est:10min`
  Update vite.config.ts to include src/components/player/** in coverage (currently all components excluded). Run full test suite with coverage to verify green and report.
  - Files: `musicode-ui/vite.config.ts`
  - Verify: cd musicode-ui && npx vitest run --coverage --reporter=verbose

## Files Likely Touched

- musicode-ui/src/components/player/ProgressBar.test.tsx
- musicode-ui/src/components/player/VolumeControl.test.tsx
- musicode-ui/src/components/player/TransportControls.test.tsx
- musicode-ui/src/components/player/TrackInfo.test.tsx
- musicode-ui/src/components/player/CrossfadePopover.test.tsx
- musicode-ui/src/components/player/EqPopover.test.tsx
- musicode-ui/vite.config.ts
