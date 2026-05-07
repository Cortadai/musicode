---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T04: Shell integration + deck toggle

Insert AnalyzerDeck between TopBar/header and main content in all 3 shells (NovatouchShell, EvolvedShell, MinimalShell). Add a toggle button (Activity/BarChart3 icon from lucide) in each shell's chrome to show/hide the deck. Wire up the full pipeline: audioGraph creates deck AnalyserNode on init, AnalyzerDeck reads from dataSource, useFrameScheduler drives the render loop, Spectrum Analyzer renders. Add CSS custom properties for deck theming (--mc-deck-bg, --mc-deck-border, --mc-scope-grid, --mc-scope-line) to all 3 theme blocks in index.css.

## Inputs

- `T01-T03 outputs`
- `All 3 shell components`
- `index.css theme tokens`

## Expected Output

- `Updated shell components with AnalyzerDeck`
- `Theme CSS tokens for deck`

## Verification

In browser: switch between all 3 themes, toggle deck on/off, play a track — Spectrum Analyzer renders correctly in each theme. Deck collapses smoothly. No layout shift in main content area. No audio glitches from adding the second AnalyserNode.
