# S02: Dark Palettes — Crimson, Emerald, Amber, Cyan

**Goal:** Add 4 dark palettes: Crimson, Emerald, Amber, Cyan — each with tinted backgrounds and matching accent colors
**Demo:** Cycle through all 6 dark palettes on any shell — each has a distinct, cohesive look.

## Must-Haves

- Not provided.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Create Crimson, Emerald, Amber, Cyan palette files** `est:30m`
  Define 4 new PaletteTokens files under themes/palettes/ with tinted dark backgrounds and accent colors for each palette
  - Files: `musicode-ui/src/themes/palettes/crimson.ts`, `musicode-ui/src/themes/palettes/emerald.ts`, `musicode-ui/src/themes/palettes/amber.ts`, `musicode-ui/src/themes/palettes/cyan.ts`
  - Verify: TypeScript compiles, all 4 palettes render correctly in browser

- [x] **T02: Register palettes and verify in browser** `est:15m`
  Add all 4 palettes to the palette registry in index.ts, verify each renders correctly across all shells
  - Files: `musicode-ui/src/themes/index.ts`
  - Verify: User confirms all 4 dark palettes look correct

## Files Likely Touched

- musicode-ui/src/themes/palettes/crimson.ts
- musicode-ui/src/themes/palettes/emerald.ts
- musicode-ui/src/themes/palettes/amber.ts
- musicode-ui/src/themes/palettes/cyan.ts
- musicode-ui/src/themes/index.ts
