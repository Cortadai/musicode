---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T03: Crossfade UI slider and edge cases

Add crossfade duration slider (0-12s, step 1s) to the player preferences area. Display '0s = Gapless' label when at 0. Persist via savePreferences. Handle edge cases: manual skip during active crossfade (cancel ramps, reset gains, load new track on active element), repeat-one (no crossfade, restart as before), stop/logout during crossfade (cancel ramps, stop both elements), very short tracks (duration < crossfadeDuration — fall back to gapless swap). Verify all scenarios in browser.

## Inputs

- `T02 crossfade logic`
- `PlayerBar.tsx current layout`

## Expected Output

- `Crossfade slider in player UI`
- `Edge case handling: skip, repeat-one, stop, short tracks`
- `All scenarios verified in browser`

## Verification

npm run build compiles clean. Manual browser verification: crossfade slider visible and persists with F5. Skip during crossfade works. Repeat-one ignores crossfade. Logout during crossfade stops cleanly.
