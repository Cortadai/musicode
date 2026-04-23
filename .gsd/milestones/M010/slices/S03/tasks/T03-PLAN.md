---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T03: Smooth fade-out on pause/stop

Add decay tracking — when audio stops, overlay semi-transparent black layers each frame until canvas is clear. Reset waveform smoothing buffer on full decay. Works for all 3 modes.

## Inputs

- `analyserNode state (paused = zero data)`

## Expected Output

- `Smooth fade-out animation on pause/stop`

## Verification

Build succeeds. Pause or stop playback — visualizer fades out smoothly instead of freezing.
