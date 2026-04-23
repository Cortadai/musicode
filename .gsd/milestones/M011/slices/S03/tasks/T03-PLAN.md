---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T03: Add popover accessibility — ARIA attributes, Escape key, and focus management

CrossfadePopover and EqPopover: add aria-haspopup='dialog' and aria-expanded on trigger buttons. Popover containers get role='dialog' and aria-label. Escape key closes popover. Focus moves into popover on open, returns to trigger on close. EQ toggle button gets role='switch' with aria-checked. Range inputs inside popovers get aria-label (e.g. 'Crossfade duration', '60Hz band', '250Hz band'). Preset select gets aria-label.

## Inputs

- `musicode-ui/src/components/player/CrossfadePopover.tsx`
- `musicode-ui/src/components/player/EqPopover.tsx`

## Expected Output

- `musicode-ui/src/components/player/CrossfadePopover.tsx`
- `musicode-ui/src/components/player/EqPopover.tsx`

## Verification

Open popover with Enter/Space. Escape closes it. Focus returns to trigger button. Screen reader announces 'Crossfade settings dialog' and 'Equalizer settings dialog'.
