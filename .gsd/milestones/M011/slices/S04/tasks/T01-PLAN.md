---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T01: Tests for ProgressBar, VolumeControl, TransportControls

Write tests for the 3 pure presentational components that take props and render UI. No routing or module mocking needed — just render + fireEvent + assertions.

## Inputs

- `musicode-ui/src/components/player/ProgressBar.tsx`
- `musicode-ui/src/components/player/VolumeControl.tsx`
- `musicode-ui/src/components/player/TransportControls.tsx`

## Expected Output

- `musicode-ui/src/components/player/ProgressBar.test.tsx`
- `musicode-ui/src/components/player/VolumeControl.test.tsx`
- `musicode-ui/src/components/player/TransportControls.test.tsx`

## Verification

cd musicode-ui && npx vitest run --reporter=verbose src/components/player/ProgressBar.test.tsx src/components/player/VolumeControl.test.tsx src/components/player/TransportControls.test.tsx
