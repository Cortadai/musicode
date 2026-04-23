---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T04: Build verification and browser smoke test

Run tsc and vite build to confirm zero errors. Start dev server and verify in browser: play/pause, seek, volume, shuffle, repeat, crossfade slider, EQ bands+presets+toggle, visualizer 3 modes. Confirm no regressions.

## Inputs

- `All extracted components`

## Expected Output

- `Clean build`
- `All features verified in browser`

## Verification

vite build succeeds. All 8 player features work in browser.
