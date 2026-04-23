---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T03: EQ popover UI in PlayerBar

Add EQ button (SlidersHorizontal icon) next to crossfade button. Popover with: enable/disable toggle, 5 vertical range sliders (labeled 60/230/910/3.6k/14k), preset dropdown, reset button. Active state turns icon indigo. Persist on change via savePreferences. Apply via eqProcessor on mount and on change.

## Inputs

- `PlayerBar.tsx current layout`
- `eqProcessor.ts API`
- `audioPreferences.ts API`

## Expected Output

- `PlayerBar.tsx with EQ popover`

## Verification

Build succeeds. Visual inspection: popover opens, sliders move, preset applies values, toggle enables/disables. Preferences persist across F5.
