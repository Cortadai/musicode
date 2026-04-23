---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T02: Extract TransportControls and ProgressBar components

Extract play/pause/skip/shuffle/repeat buttons into TransportControls.tsx. Extract seek bar with time display into ProgressBar.tsx. TransportControls receives player actions as props. ProgressBar receives currentTime, duration, onSeek.

## Inputs

- `PlayerBar.tsx lines 269-327`

## Expected Output

- `TransportControls.tsx ~50 LOC`
- `ProgressBar.tsx ~40 LOC`
- `PlayerBar.tsx reduced by ~60 LOC`

## Verification

tsc --noEmit passes. Transport buttons and progress bar render correctly.
