---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T02: Tests for TrackInfo and CrossfadePopover

TrackInfo needs react-router MemoryRouter wrapper for Link components. CrossfadePopover has internal open/close state, keyboard interaction (Escape), and focus management — test toggle, slider change, and keyboard dismiss.

## Inputs

- `musicode-ui/src/components/player/TrackInfo.tsx`
- `musicode-ui/src/components/player/CrossfadePopover.tsx`

## Expected Output

- `musicode-ui/src/components/player/TrackInfo.test.tsx`
- `musicode-ui/src/components/player/CrossfadePopover.test.tsx`

## Verification

cd musicode-ui && npx vitest run --reporter=verbose src/components/player/TrackInfo.test.tsx src/components/player/CrossfadePopover.test.tsx
