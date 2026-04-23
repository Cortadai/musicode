---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T02: Visualizer mode persistence in localStorage

Add visualizerMode field to AudioPreferences. Validate on load, default to 'bars'. Persist on mode change.

## Inputs

- `audioPreferences module`

## Expected Output

- `visualizerMode persisted in localStorage`

## Verification

Build succeeds. Mode survives F5.
