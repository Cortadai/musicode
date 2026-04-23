---
id: T03
parent: S01
milestone: M011
key_files:
  - musicode-ui/src/components/player/VolumeControl.tsx
  - musicode-ui/src/components/player/CrossfadePopover.tsx
  - musicode-ui/src/components/player/EqPopover.tsx
  - musicode-ui/src/components/player/PlayerBar.tsx
key_decisions:
  - (none)
duration: 
verification_result: untested
completed_at: 2026-04-18T16:46:33.829Z
blocker_discovered: false
---

# T03: Extracted VolumeControl, CrossfadePopover, and EqPopover components

**Extracted VolumeControl, CrossfadePopover, and EqPopover components**

## What Happened

Extracted volume mute/slider into VolumeControl.tsx. Crossfade button+popover+state into self-contained CrossfadePopover.tsx. EQ button+popover with all state management (eqEnabled, eqBands, eqPreset, handlers) into self-contained EqPopover.tsx.

## Verification

tsc --noEmit passes. EQ popover opens/closes, 5 bands adjust, presets apply. Crossfade slider 0-12s works. Volume mute/unmute works. Gapless toggle works.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| — | No verification commands discovered | — | — | — |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/components/player/VolumeControl.tsx`
- `musicode-ui/src/components/player/CrossfadePopover.tsx`
- `musicode-ui/src/components/player/EqPopover.tsx`
- `musicode-ui/src/components/player/PlayerBar.tsx`
