---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Rewrite eqProcessor.ts — parametric engine core

Replace fixed 5-band peaking engine with variable-band parametric EQ. New EqBand model: id, type, frequency, gain, Q. Support add/remove bands (max 10), filter type mapping, per-band Q, preamp GainNode. Atomic chain rebuild on structural changes, efficient single-band update for parameter tweaks. Pass filter normalization (gain=0 for highpass/lowpass).

## Inputs

- `Current eqProcessor.ts`
- `Astra AudioEngine.ts EQ methods`
- `Astra eq.ts utilities`

## Expected Output

- `Rewritten eqProcessor.ts with EqBand interface, variable band management, preamp support`

## Verification

TypeScript compiles. Unit: import and call init(), addBand(), removeBand(), updateBand(), setPreamp() — no runtime errors.
