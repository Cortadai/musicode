# S02: Ecualizador 5 bandas

**Goal:** 5-band parametric EQ using BiquadFilterNodes inserted into the audio graph. Enable/disable toggle, per-band gain sliders (-12 to +12 dB), presets (Flat, Bass Boost, Treble Boost, Vocal, Rock). Preferences persist in localStorage. All opt-in, flat by default.
**Demo:** User enables EQ, adjusts bass slider up — audio sounds bassier. Disables EQ — audio returns to flat. Preferences survive F5.

## Must-Haves

- User enables EQ, adjusts bass slider up — audio sounds bassier. Disables EQ — audio returns to flat. Preferences survive F5. Presets apply correct band values.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: EQ processor module + audioGraph wiring** `est:30m`
  Create eqProcessor.ts with 5 BiquadFilterNodes (peaking, 60/230/910/3600/14000 Hz, Q=1.4). Insert between masterGain and analyserNode during init. Expose setGain(band, dB), setEnabled(bool), getState(), applyPreset(name). When disabled, all gains set to 0 dB (passthrough, no rewiring).
  - Files: `musicode-ui/src/audio/eqProcessor.ts`, `musicode-ui/src/audio/audioGraph.ts`
  - Verify: Build succeeds. Console log confirms EQ chain inserted on init.

- [x] **T02: EQ preferences persistence** `est:15m`
  Add eqEnabled (boolean), eqBands (number[5]), eqPreset (string) to AudioPreferences. Load/save with validation. Default: disabled, all bands 0, preset 'flat'.
  - Files: `musicode-ui/src/audio/audioPreferences.ts`
  - Verify: Build succeeds. localStorage round-trip preserves EQ settings.

- [x] **T03: EQ popover UI in PlayerBar** `est:45m`
  Add EQ button (SlidersHorizontal icon) next to crossfade button. Popover with: enable/disable toggle, 5 vertical range sliders (labeled 60/230/910/3.6k/14k), preset dropdown, reset button. Active state turns icon indigo. Persist on change via savePreferences. Apply via eqProcessor on mount and on change.
  - Files: `musicode-ui/src/components/player/PlayerBar.tsx`
  - Verify: Build succeeds. Visual inspection: popover opens, sliders move, preset applies values, toggle enables/disables. Preferences persist across F5.

## Files Likely Touched

- musicode-ui/src/audio/eqProcessor.ts
- musicode-ui/src/audio/audioGraph.ts
- musicode-ui/src/audio/audioPreferences.ts
- musicode-ui/src/components/player/PlayerBar.tsx
