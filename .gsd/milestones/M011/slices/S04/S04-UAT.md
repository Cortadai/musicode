# S04: Tests de componentes y hooks — UAT

**Milestone:** M011
**Written:** 2026-04-18T17:36:50.306Z

## S04 UAT — Component Tests

| # | Test | Expected | Result |
|---|------|----------|--------|
| 1 | `npx vitest run` passes all tests | 0 failures | **PASS** — 109/109 |
| 2 | ProgressBar tests cover rendering, seek, zero-duration, aria | 6 pass | **PASS** |
| 3 | VolumeControl tests cover slider, mute/unmute, aria | 7 pass | **PASS** |
| 4 | TransportControls tests cover buttons, states, callbacks, aria | 9 pass | **PASS** |
| 5 | TrackInfo tests cover rendering, links, cover art, aria | 7 pass | **PASS** |
| 6 | CrossfadePopover tests cover toggle, slider, keyboard, a11y | 9 pass | **PASS** |
| 7 | EqPopover tests cover toggle, bands, presets, keyboard, a11y | 13 pass | **PASS** |
| 8 | audioPreferences tests cover load/save, validation, fallbacks | 18 pass | **PASS** |
| 9 | PlayerContext reducer tests (pre-existing) still pass | 22 pass | **PASS** |
| 10 | Coverage lines ≥ 80% | threshold met | **PASS** — 92% |
| 11 | Coverage branches ≥ 80% | threshold met | **PASS** — 91% |
| 12 | Coverage functions ≥ 50% | threshold met | **PASS** — 87% |
| 13 | All 6 player components at 100% line coverage | 100% each | **PASS** |
| 14 | test-setup.ts configures jest-dom matchers globally | toBeInTheDocument works | **PASS** |
