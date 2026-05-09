---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T05: Fix consumers and verify shell × palette in browser

Update ThemeSelector and any other consumers that reference old ThemeConfig shape. Verify in browser: load app with Indigo palette on evolved shell, switch to Cobalt via console (or temp UI), confirm backgrounds shift to cooler blue tint while layout stays. Test on all 3 shells.

## Inputs

- `musicode-ui/src/themes/ThemeProvider.tsx`
- `musicode-ui/src/components/layout/ThemeSelector.tsx`

## Expected Output

- `musicode-ui/src/components/layout/ThemeSelector.tsx`

## Verification

App loads on localhost:5173 with no console errors. Visual verification: Indigo and Cobalt produce different background colors on same shell.
