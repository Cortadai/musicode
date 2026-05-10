---
id: T04
parent: S01
milestone: M020
key_files:
  - musicode-ui/src/components/layout/TopBar.tsx
  - musicode-ui/src/components/layout/PlayerBar.tsx
  - musicode-ui/src/index.css
  - musicode-ui/src/config/SecurityConfig.java
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-05-07T20:59:02.733Z
blocker_discovered: false
---

# T04: Integrated AnalyzerDeck into all 3 shells with toggle button and theme tokens for deck styling

**Integrated AnalyzerDeck into all 3 shells with toggle button and theme tokens for deck styling**

## What Happened

Inserted AnalyzerDeck between TopBar and main content in all 3 shells. Added toggle button (BarChart3 icon) in TopBar. Wired full pipeline: audioGraph creates deck AnalyserNode, AnalyzerDeck reads from dataSource, useFrameScheduler drives render loop. Added CSS custom properties (--mc-deck-bg, --mc-deck-border, --mc-scope-grid, --mc-scope-line) to all 3 theme blocks in index.css. Also added deck toggle to PlayerBar for accessibility.

## Verification

Verified in browser: switched between all 3 themes (Novatouch, Evolved, Minimal), toggled deck on/off, played tracks. Spectrum Analyzer renders correctly in each theme. Deck collapses smoothly. No layout shift. No audio glitches.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `browser: test all 3 themes with deck toggle` | 0 | pass | 15000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/components/layout/TopBar.tsx`
- `musicode-ui/src/components/layout/PlayerBar.tsx`
- `musicode-ui/src/index.css`
- `musicode-ui/src/config/SecurityConfig.java`
