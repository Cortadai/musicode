# S03: Visualizer in overlay + track transition animations — UAT

**Milestone:** M013
**Written:** 2026-04-18T19:36:36.393Z

## UAT: S03 — Visualizer in Overlay + Track Transitions\n\n### Preconditions\n- App running, track playing, Now Playing overlay open\n\n### Test Cases\n\n- [x] **Visualizer toggle**: BarChart3 button in overlay top bar toggles visualizer on/off\n- [x] **Visualizer renders behind artwork**: Canvas extends beyond artwork boundaries as a halo\n- [x] **Mode switching**: All 3 modes (bars, waveform, circular) work in overlay\n- [x] **Canvas fills container**: Visualizer canvas resizes properly when window resizes\n- [x] **Artwork crossfade**: When track changes, old artwork fades out while new fades in (0.5s)\n- [x] **No flash on same-album tracks**: Tracks from same album don't cause visible flicker\n- [x] **PlayerBar visualizer unaffected**: Original PlayerBar visualizer still works independently\n- [x] **No regression**: All existing 117 tests pass
