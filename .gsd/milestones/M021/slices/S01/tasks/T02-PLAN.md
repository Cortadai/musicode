---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T02: Create Indigo and Cobalt palette files

Create palettes/ directory with indigo.ts (color tokens from evolved) and cobalt.ts (color tokens from nova). Create palettes/index.ts exporting palette registry. Indigo is the default palette.

## Inputs

- `musicode-ui/src/themes/types.ts`
- `musicode-ui/src/themes/tokens/evolved.ts`
- `musicode-ui/src/themes/tokens/nova.ts`

## Expected Output

- `musicode-ui/src/themes/palettes/indigo.ts`
- `musicode-ui/src/themes/palettes/cobalt.ts`
- `musicode-ui/src/themes/palettes/index.ts`

## Verification

TypeScript compiles: cd musicode-ui && npx tsc --noEmit
