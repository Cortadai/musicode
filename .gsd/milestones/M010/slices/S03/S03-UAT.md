# S03: Visualizer expandible con 3 modos — UAT

**Milestone:** M010
**Written:** 2026-04-18T11:42:00.549Z

## UAT: S03 — Visualizer expandible con 3 modos\n\n### Test Cases\n\n- [x] **Expand/collapse** — Click visualizer toggle, panel expands with smooth CSS animation. Click again, collapses.\n- [x] **Bars mode** — Frequency spectrum renders with indigo gradient bars.\n- [x] **Waveform mode** — Time-domain wave with glow effect, smooth movement (not too fast).\n- [x] **Circular mode** — 64 radial bars from center, indigo color gradient.\n- [x] **Mode switching** — All 3 mode buttons work, switch instantly.\n- [x] **Mode persistence** — Selected mode survives F5 page refresh.\n- [x] **Fade-out on pause** — Pause playback, visualizer fades smoothly to black.\n- [x] **Fade-out on stop** — Stop playback, same smooth fade.\n- [x] **No regression** — Crossfade (S01) and EQ (S02) still work with visualizer active.\n\n### Result: PASS
