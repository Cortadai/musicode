---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T02: EQ preferences persistence

Add eqEnabled (boolean), eqBands (number[5]), eqPreset (string) to AudioPreferences. Load/save with validation. Default: disabled, all bands 0, preset 'flat'.

## Inputs

- `audioPreferences.ts current shape`

## Expected Output

- `audioPreferences.ts with EQ fields`

## Verification

Build succeeds. localStorage round-trip preserves EQ settings.
