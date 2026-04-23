# S01: Refactor PlayerBar — extraer componentes — UAT

**Milestone:** M011
**Written:** 2026-04-18T16:47:08.131Z

## UAT: S01 — Refactor PlayerBar

### Pre-conditions
- musicode-ui dev server running on localhost:5173
- At least one track in the library

### Test Cases

| # | Action | Expected | Result |
|---|--------|----------|--------|
| 1 | Load app with tracks in library | PlayerBar visible at bottom with track info, controls, progress bar | ✅ Pass |
| 2 | Click play button | Track plays, play icon changes to pause, vinyl disc spins | ✅ Pass |
| 3 | Click next button | Advances to next track, TrackInfo updates | ✅ Pass |
| 4 | Click shuffle toggle | Shuffle icon highlights, playback order randomized | ✅ Pass |
| 5 | Click repeat toggle | Repeat icon highlights/cycles modes | ✅ Pass |
| 6 | Click on progress bar | Playback seeks to clicked position, timestamps update | ✅ Pass |
| 7 | Drag volume slider | Volume changes audibly | ✅ Pass |
| 8 | Click mute button | Audio mutes, icon changes | ✅ Pass |
| 9 | Click crossfade button | Popover opens with 0-12s slider and Gapless toggle | ✅ Pass |
| 10 | Click EQ button | Popover opens with 5 bands (60Hz-14kHz), toggle, presets dropdown | ✅ Pass |
| 11 | Adjust EQ bands | Sliders move, audio EQ changes audibly | ✅ Pass |
| 12 | Select EQ preset (e.g. Flat) | All bands reset to preset values | ✅ Pass |
| 13 | Click visualizer expand | Visualizer expands with bars mode | ✅ Pass |
| 14 | Click visualizer collapse | Visualizer collapses back to PlayerBar | ✅ Pass |

### Verdict: PASS — All 14 test cases verified in browser
