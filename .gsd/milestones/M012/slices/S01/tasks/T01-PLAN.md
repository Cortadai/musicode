---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T01: Extract useScrobble hook

Extract play reporting logic (50% threshold, abort controller, recordPlay call) into useScrobble.ts. Takes trackId, currentTime, duration as inputs. Returns nothing — pure side-effect hook.

## Inputs

- `usePlayer.ts scrobble logic (lines ~85-105)`

## Expected Output

- `useScrobble.ts with isolated play reporting`
- `usePlayer.ts with scrobble logic removed, calling useScrobble instead`

## Verification

vitest --run && manual check: play a track past 50%, verify POST /api/plays fires once
