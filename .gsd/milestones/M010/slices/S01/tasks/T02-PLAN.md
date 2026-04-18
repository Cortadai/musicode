---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T02: Implement crossfade overlap logic and preference

Add crossfade transition logic to audioGraph.ts: when crossfadeDuration > 0, instead of instant swap, both elements play simultaneously during the crossfade window. Active element's gain ramps from 1→0, next element's gain ramps from 0→1, both using linearRampToValueAtTime. Add crossfadeDuration to AudioPreferences (default 0 = gapless). Add crossfade slider UI to preferences/settings. Modify usePlayer.ts onEnded handler: check crossfade preference, if > 0 call new crossfade method instead of swap(). Pre-load threshold should be max(PRELOAD_THRESHOLD, crossfadeDuration + 1) to ensure next track is loaded before crossfade starts. In timeupdate handler: when remaining <= crossfadeDuration, start the crossfade (don't wait for ended event).

## Inputs

- `T01 dual-gain graph topology`
- `audioPreferences.ts with loadPreferences/savePreferences`
- `usePlayer.ts gapless logic`

## Expected Output

- `audioGraph.crossfade(duration) method that ramps gainA/gainB`
- `crossfadeDuration in AudioPreferences (default 0)`
- `usePlayer timeupdate triggers crossfade when remaining <= duration`
- `onEnded skips dispatch when crossfade already handled the transition`

## Verification

npm run build compiles clean. Set crossfade to 5s in preferences. Play album — tracks overlap audibly during transition. Set crossfade to 0 — gapless swap works as before.
