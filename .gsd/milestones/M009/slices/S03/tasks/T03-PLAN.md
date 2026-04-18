---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T03: Edge cases, cleanup, and browser verification

1) Logout: audioGraph.stop() must pause and reset both elements. 2) STOP action: same cleanup. 3) Seek near end: if user seeks past the pre-load threshold, trigger prepareNext. 4) Rapid skip: multiple fast next clicks must not leave orphan pre-loads. 5) Browser verification of all scenarios in running app.

## Inputs

- `Dual-element audioGraph from T01`
- `Pre-load/swap logic from T02`

## Expected Output

- `Hardened edge case handling`
- `Browser verification pass`

## Verification

Manual browser test: album gapless transition, skip rapid, repeat-one, repeat-all, queue end stop, logout cuts audio, volume/mute on active element, visualizer stays connected.
