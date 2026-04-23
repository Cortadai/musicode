---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T03: Tests for EqPopover

EqPopover depends on eqProcessor (Web Audio) and audioPreferences (localStorage). Mock both modules with vi.mock(). Test toggle, preset change, band slider change, keyboard dismiss.

## Inputs

- `musicode-ui/src/components/player/EqPopover.tsx`
- `musicode-ui/src/audio/eqProcessor.ts`
- `musicode-ui/src/audio/audioPreferences.ts`

## Expected Output

- `musicode-ui/src/components/player/EqPopover.test.tsx`

## Verification

cd musicode-ui && npx vitest run --reporter=verbose src/components/player/EqPopover.test.tsx
