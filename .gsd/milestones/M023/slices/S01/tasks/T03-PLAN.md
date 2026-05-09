---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T03: Update audioPreferences.ts — new EQ schema with migration

Expand EQ preferences to store full EqBand[] (id, type, freq, gain, Q), preamp value, and enabled state. Migrate old format (eqBands: number[5], eqPreset: string) to new format on load. Validate band count, ranges, types.

## Inputs

- `Current audioPreferences.ts`
- `New EqBand interface from eqProcessor.ts`

## Expected Output

- `audioPreferences.ts with migrated EQ schema`

## Verification

Load old-format localStorage → migrates correctly. Save/load round-trip preserves all band properties.
