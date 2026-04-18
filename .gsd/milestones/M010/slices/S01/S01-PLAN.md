# S01: Crossfade

**Goal:** Restructure audio graph with per-source gain nodes (gainA, gainB → masterGain) and implement crossfade overlap transitions. Gapless swap remains the default when crossfade=0.
**Demo:** User enables crossfade slider (e.g. 5s), plays an album — tracks transition with audible overlap. With slider at 0, gapless swap from M009 works unchanged.

## Must-Haves

- Crossfade audibly smooth at 3-5s. Gapless works at 0s. No regression in volume/mute/play/pause/skip.

## Proof Level

- This slice proves: UAT — human must listen to transitions

## Integration Closure

Produces per-source gain nodes (gainA, gainB) and masterGain in audioGraph.ts. Downstream S02 (EQ) inserts between masterGain and analyserNode. S03 (Visualizer) consumes analyserNode unchanged.

## Verification

- Console logs: crossfade start/end with duration, gain ramp values, swap events. Existing gapless logs preserved.

## Tasks

- [x] **T01: Refactor audioGraph to per-source gain nodes** `est:1h`
  Restructure the audio graph from single-gain to dual-gain topology. Current: sourceA/B → gainNode → analyser → dest. New: sourceA → gainA, sourceB → gainB, both → masterGain → analyser → dest. gainA/gainB start at 1.0 (active) and 0.0 (inactive). masterGain handles user volume (replaces current gainNode). Update setVolume() to target masterGain. Update swap() to set gain values (swap gainA/gainB levels). All existing behavior (play, pause, stop, seek, volume, mute) must work identically.
  - Files: `musicode-ui/src/audio/audioGraph.ts`
  - Verify: npm run build compiles clean. Play a track — volume slider and mute work. Console shows '[audioGraph] Graph initialized: dual-element' log.

- [x] **T02: Implement crossfade overlap logic and preference** `est:2h`
  Add crossfade transition logic to audioGraph.ts: when crossfadeDuration > 0, instead of instant swap, both elements play simultaneously during the crossfade window. Active element's gain ramps from 1→0, next element's gain ramps from 0→1, both using linearRampToValueAtTime. Add crossfadeDuration to AudioPreferences (default 0 = gapless). Add crossfade slider UI to preferences/settings. Modify usePlayer.ts onEnded handler: check crossfade preference, if > 0 call new crossfade method instead of swap(). Pre-load threshold should be max(PRELOAD_THRESHOLD, crossfadeDuration + 1) to ensure next track is loaded before crossfade starts. In timeupdate handler: when remaining <= crossfadeDuration, start the crossfade (don't wait for ended event).
  - Files: `musicode-ui/src/audio/audioGraph.ts`, `musicode-ui/src/audio/audioPreferences.ts`, `musicode-ui/src/hooks/usePlayer.ts`
  - Verify: npm run build compiles clean. Set crossfade to 5s in preferences. Play album — tracks overlap audibly during transition. Set crossfade to 0 — gapless swap works as before.

- [x] **T03: Crossfade UI slider and edge cases** `est:1h30m`
  Add crossfade duration slider (0-12s, step 1s) to the player preferences area. Display '0s = Gapless' label when at 0. Persist via savePreferences. Handle edge cases: manual skip during active crossfade (cancel ramps, reset gains, load new track on active element), repeat-one (no crossfade, restart as before), stop/logout during crossfade (cancel ramps, stop both elements), very short tracks (duration < crossfadeDuration — fall back to gapless swap). Verify all scenarios in browser.
  - Files: `musicode-ui/src/audio/audioGraph.ts`, `musicode-ui/src/hooks/usePlayer.ts`, `musicode-ui/src/components/PlayerBar.tsx`
  - Verify: npm run build compiles clean. Manual browser verification: crossfade slider visible and persists with F5. Skip during crossfade works. Repeat-one ignores crossfade. Logout during crossfade stops cleanly.

## Files Likely Touched

- musicode-ui/src/audio/audioGraph.ts
- musicode-ui/src/audio/audioPreferences.ts
- musicode-ui/src/hooks/usePlayer.ts
- musicode-ui/src/components/PlayerBar.tsx
