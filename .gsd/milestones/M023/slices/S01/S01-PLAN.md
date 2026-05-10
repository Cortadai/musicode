# S01: EQ Engine Upgrade

**Goal:** Upgrade EQ engine from fixed 5-band peaking-only to variable-band (5–10) parametric EQ with multiple filter types, adjustable Q, and preamp. Maintain backward compatibility with existing preferences.
**Demo:** Play a track, add/remove bands (up to 10), change filter types and Q via console or test harness — audio effect is audible and glitch-free. Preamp slider attenuates/boosts the signal.

## Must-Haves

- EQ engine supports add/remove bands (5–10), filter types (peaking/lowshelf/highshelf/highpass/lowpass), per-band Q (0.1–18), preamp (-12/+12 dB). Existing presets still work. Audio graph topology updated with preamp node. Preferences schema migrated without data loss. EqPopover adapts to new engine API. Build compiles clean.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [ ] **T01: Rewrite eqProcessor.ts — parametric engine core** `est:45min`
  Replace fixed 5-band peaking engine with variable-band parametric EQ. New EqBand model: id, type, frequency, gain, Q. Support add/remove bands (max 10), filter type mapping, per-band Q, preamp GainNode. Atomic chain rebuild on structural changes, efficient single-band update for parameter tweaks. Pass filter normalization (gain=0 for highpass/lowpass).
  - Files: `musicode-ui/src/audio/eqProcessor.ts`
  - Verify: TypeScript compiles. Unit: import and call init(), addBand(), removeBand(), updateBand(), setPreamp() — no runtime errors.

- [ ] **T02: Update audioGraph.ts — preamp node in signal chain** `est:15min`
  Insert preamp GainNode between masterGain and EQ filter chain. Update init() to create preamp node, wire it into the topology: masterGain → preamp → [EQ filters] → analyser. Expose preamp node to eqProcessor. Update getInsertChainOutput() if needed.
  - Files: `musicode-ui/src/audio/audioGraph.ts`
  - Verify: Build compiles. Audio plays through with EQ enabled and disabled.

- [ ] **T03: Update audioPreferences.ts — new EQ schema with migration** `est:20min`
  Expand EQ preferences to store full EqBand[] (id, type, freq, gain, Q), preamp value, and enabled state. Migrate old format (eqBands: number[5], eqPreset: string) to new format on load. Validate band count, ranges, types.
  - Files: `musicode-ui/src/audio/audioPreferences.ts`
  - Verify: Load old-format localStorage → migrates correctly. Save/load round-trip preserves all band properties.

- [ ] **T04: Adapt EqPopover.tsx to new engine API** `est:20min`
  Update EqPopover to use new eqProcessor API. Keep the existing 5-slider UI for now (S05 will build the full panel), but wire it to the new band model. Preset application uses new applyPreset(). Toggle uses new enable/disable. Band changes call updateBand() with full EqBand object.
  - Files: `musicode-ui/src/components/player/EqPopover.tsx`
  - Verify: Build compiles. EQ popover opens, sliders move, presets apply, toggle works.

## Files Likely Touched

- musicode-ui/src/audio/eqProcessor.ts
- musicode-ui/src/audio/audioGraph.ts
- musicode-ui/src/audio/audioPreferences.ts
- musicode-ui/src/components/player/EqPopover.tsx
