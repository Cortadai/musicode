---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T01: EQ processor module + audioGraph wiring

Create eqProcessor.ts with 5 BiquadFilterNodes (peaking, 60/230/910/3600/14000 Hz, Q=1.4). Insert between masterGain and analyserNode during init. Expose setGain(band, dB), setEnabled(bool), getState(), applyPreset(name). When disabled, all gains set to 0 dB (passthrough, no rewiring).

## Inputs

- `audioGraph.ts topology`
- `Web Audio BiquadFilterNode API`

## Expected Output

- `eqProcessor.ts module`
- `audioGraph.ts modified init() to call eqProcessor.init()`

## Verification

Build succeeds. Console log confirms EQ chain inserted on init.
