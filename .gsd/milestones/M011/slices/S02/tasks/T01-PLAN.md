---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T01: Memo player sub-components

Wrap TrackInfo, TransportControls, VolumeControl in React.memo. ProgressBar updates every tick so skip it. Ensure PlayerBar passes stable callback refs (already useCallback). Verify with Profiler that TransportControls and VolumeControl stop re-rendering on currentTime ticks.

## Inputs

- `Current player components from S01 refactor`

## Expected Output

- `Three components wrapped in React.memo`

## Verification

Build passes. Profiler shows TransportControls and VolumeControl render count stays flat during playback.
