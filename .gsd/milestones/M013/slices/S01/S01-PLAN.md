# S01: Color extraction engine with opt-in dynamic theming

**Goal:** Color extraction engine with opt-in dynamic theming — extract dominant colors from album artwork via canvas, persist preference, inject CSS variables when enabled
**Demo:** Toggle dynamic color mode in Now Playing area — background shifts to artwork-derived gradient. Toggle off — returns to standard dark theme.

## Must-Haves

- Color extraction produces 2-3 dominant colors from any album artwork. Dynamic theme toggle persists in localStorage. CSS variables (--np-color-1, --np-color-2, --np-bg) injected on document root when enabled. Default dark theme unchanged when disabled. All existing tests pass.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Color extraction utility** `est:25m`
  Create extractColors module: load album artwork into offscreen canvas (64x64), sample pixels, cluster to 2-3 dominant colors, adjust brightness for contrast. Cache results by albumId. Export async function extractColors(albumId) => Promise<ColorPalette>.
  - Files: `musicode-ui/src/audio/colorExtraction.ts`
  - Verify: Unit tests: known color image produces expected palette, cache hit skips re-extraction, missing image returns fallback colors

- [x] **T02: Add dynamicTheme preference to audioPreferences** `est:5m`
  Add dynamicTheme: boolean field to AudioPreferences interface, defaults to false. Add validation in loadPreferences. Persist via savePreferences.
  - Files: `musicode-ui/src/audio/audioPreferences.ts`, `musicode-ui/src/audio/audioPreferences.test.ts`
  - Verify: Existing audioPreferences tests still pass, new test confirms dynamicTheme round-trips

- [x] **T03: Create useDynamicTheme hook** `est:20m`
  React hook that: reads dynamicTheme pref, when enabled + track changes calls extractColors, sets CSS custom properties (--np-color-1, --np-color-2, --np-bg) on document.documentElement. When disabled, removes variables. Returns { enabled, toggle, colors }.
  - Files: `musicode-ui/src/hooks/useDynamicTheme.ts`
  - Verify: Hook returns correct state, toggling persists preference, CSS variables set/removed on document

- [x] **T04: Write tests for color extraction and hook** `est:15m`
  Vitest tests for extractColors (mock canvas/image) and useDynamicTheme (mock preferences, verify CSS variable injection). Test fallback when image fails to load.
  - Files: `musicode-ui/src/audio/colorExtraction.test.ts`, `musicode-ui/src/hooks/useDynamicTheme.test.ts`
  - Verify: All new tests pass with npx vitest --run

- [x] **T05: Verify build and all tests** `est:5m`
  Run TypeScript check, vitest, and confirm no regressions.
  - Verify: tsc --noEmit clean, vitest --run all green

## Files Likely Touched

- musicode-ui/src/audio/colorExtraction.ts
- musicode-ui/src/audio/audioPreferences.ts
- musicode-ui/src/audio/audioPreferences.test.ts
- musicode-ui/src/hooks/useDynamicTheme.ts
- musicode-ui/src/audio/colorExtraction.test.ts
- musicode-ui/src/hooks/useDynamicTheme.test.ts
