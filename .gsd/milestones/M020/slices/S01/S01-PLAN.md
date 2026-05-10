# S01: Audio Pipeline + Deck Shell + Spectrum Analyzer

**Goal:** Prove the full vertical: shared audio data source → collapsible deck container → Canvas 2D scope rendering with real FFT data. Spectrum Analyzer is the most complex scope and validates the entire pipeline.
**Demo:** User plays a track, toggles the analyzer deck visible via a button, and sees a Spectrum Analyzer rendering real-time FFT data with heatmap coloring. Deck collapses and expands. Flat lines when paused.

## Must-Haves

- Spectrum Analyzer renders at ≥30fps with FFT 4096 during playback. Deck toggle works in all 3 shells. No audio glitches. DataSource API is stable for downstream scopes. Flat lines when paused.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: AnalyzerDeckDataSource + useFrameScheduler** `est:30min`
  Create the shared audio data abstraction that wraps AnalyserNode with configurable FFT size (default 4096), providing getFrequencyData() and getTimeDomainData() as Float32Arrays. Create a second AnalyserNode dedicated to the deck (higher FFT size than the existing 256 one). Build useFrameScheduler hook: rAF loop with FPS cap (default 60), gated on playback state from usePlayer, subscriber pattern for multiple scopes sharing one loop.
  - Files: `musicode-ui/src/audio/analyzerDeckDataSource.ts`, `musicode-ui/src/hooks/useFrameScheduler.ts`, `musicode-ui/src/audio/audioGraph.ts`
  - Verify: Import and call in a test component — verify Float32Array data flows when playing, zeros when paused. Console.log FPS to confirm ~60fps cap.

- [x] **T02: ScopeRenderer types + AnalyzerDeck container component** `est:45min`
  Define ScopeRenderer interface: { id, name, render(ctx, width, height, dataSource), dispose() }. Build AnalyzerDeck React component: collapsible horizontal bar (100px height), renders active scopes as Canvas elements in a CSS flex container with proportional widths. Includes collapse/expand toggle button. Shows flat state when not playing. Zustand store (useDeckStore) for deck state: visible, activeScopes, scopeOrder, scopeProportions — persisted to localStorage.
  - Files: `musicode-ui/src/components/analyzer/types.ts`, `musicode-ui/src/components/analyzer/AnalyzerDeck.tsx`, `musicode-ui/src/components/analyzer/AnalyzerDeck.css`, `musicode-ui/src/stores/useDeckStore.ts`
  - Verify: Render AnalyzerDeck in isolation — verify collapse/expand animation, canvas elements resize on container resize, store persists to localStorage.

- [x] **T03: Spectrum Analyzer scope implementation** `est:60min`
  Port the Spectrum Analyzer renderer from Prism reference. Implements ScopeRenderer interface. Features: logarithmic frequency scale (20Hz-20kHz), FFT 4096, dB range -90 to -10, heatmap fill with 256-entry color LUT, grid overlay with dB and frequency labels, tilt compensation (+3dB/octave default), exponential smoothing (0.85). Static layer caching on offscreen canvas for grid/labels. Theme-aware colors via CSS custom properties.
  - Files: `musicode-ui/src/components/analyzer/scopes/SpectrumAnalyzer.ts`, `musicode-ui/src/components/analyzer/scopes/heatScale.ts`, `musicode-ui/src/components/analyzer/scopes/index.ts`
  - Verify: Play a track with deck open — Spectrum Analyzer shows frequency content with smooth heatmap coloring, grid labels readable, responsive to music dynamics. Flat line when paused. No visible jank.

- [x] **T04: Shell integration + deck toggle** `est:45min`
  Insert AnalyzerDeck between TopBar/header and main content in all 3 shells (NovatouchShell, EvolvedShell, MinimalShell). Add a toggle button (Activity/BarChart3 icon from lucide) in each shell's chrome to show/hide the deck. Wire up the full pipeline: audioGraph creates deck AnalyserNode on init, AnalyzerDeck reads from dataSource, useFrameScheduler drives the render loop, Spectrum Analyzer renders. Add CSS custom properties for deck theming (--mc-deck-bg, --mc-deck-border, --mc-scope-grid, --mc-scope-line) to all 3 theme blocks in index.css.
  - Files: `musicode-ui/src/components/layout/shells/NovatouchShell.tsx`, `musicode-ui/src/components/layout/shells/EvolvedShell.tsx`, `musicode-ui/src/components/layout/shells/MinimalShell.tsx`, `musicode-ui/src/index.css`
  - Verify: In browser: switch between all 3 themes, toggle deck on/off, play a track — Spectrum Analyzer renders correctly in each theme. Deck collapses smoothly. No layout shift in main content area. No audio glitches from adding the second AnalyserNode.

## Files Likely Touched

- musicode-ui/src/audio/analyzerDeckDataSource.ts
- musicode-ui/src/hooks/useFrameScheduler.ts
- musicode-ui/src/audio/audioGraph.ts
- musicode-ui/src/components/analyzer/types.ts
- musicode-ui/src/components/analyzer/AnalyzerDeck.tsx
- musicode-ui/src/components/analyzer/AnalyzerDeck.css
- musicode-ui/src/stores/useDeckStore.ts
- musicode-ui/src/components/analyzer/scopes/SpectrumAnalyzer.ts
- musicode-ui/src/components/analyzer/scopes/heatScale.ts
- musicode-ui/src/components/analyzer/scopes/index.ts
- musicode-ui/src/components/layout/shells/NovatouchShell.tsx
- musicode-ui/src/components/layout/shells/EvolvedShell.tsx
- musicode-ui/src/components/layout/shells/MinimalShell.tsx
- musicode-ui/src/index.css
