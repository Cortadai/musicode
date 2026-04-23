---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T03: Extract VolumeControl, CrossfadePopover, and EqPopover components

Extract volume mute/slider into VolumeControl.tsx. Extract crossfade button+popover+state into CrossfadePopover.tsx (self-contained with own useState/useEffect for click-outside). Extract EQ button+popover+all EQ state management into EqPopover.tsx (self-contained — owns eqEnabled, eqBands, eqPreset state and all handlers).

## Inputs

- `PlayerBar.tsx lines 45-171 (state+handlers)`
- `PlayerBar.tsx lines 330-461 (JSX)`

## Expected Output

- `VolumeControl.tsx ~30 LOC`
- `CrossfadePopover.tsx ~60 LOC`
- `EqPopover.tsx ~120 LOC`
- `PlayerBar.tsx ≤100 LOC`

## Verification

tsc --noEmit passes. EQ popover opens/closes, bands adjust, presets apply. Crossfade slider works. Volume mute/unmute works.
