---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T03: Spectrum Analyzer scope implementation

Port the Spectrum Analyzer renderer from Prism reference. Implements ScopeRenderer interface. Features: logarithmic frequency scale (20Hz-20kHz), FFT 4096, dB range -90 to -10, heatmap fill with 256-entry color LUT, grid overlay with dB and frequency labels, tilt compensation (+3dB/octave default), exponential smoothing (0.85). Static layer caching on offscreen canvas for grid/labels. Theme-aware colors via CSS custom properties.

## Inputs

- `T01 AnalyzerDeckDataSource`
- `T02 ScopeRenderer interface`
- `reference/prism/src/renderer/visualizers/SpectrumAnalyzer.ts`
- `reference/prism/src/renderer/visualizers/heatScale.ts`

## Expected Output

- `SpectrumAnalyzer.ts implementing ScopeRenderer`
- `heatScale.ts utility`

## Verification

Play a track with deck open — Spectrum Analyzer shows frequency content with smooth heatmap coloring, grid labels readable, responsive to music dynamics. Flat line when paused. No visible jank.
