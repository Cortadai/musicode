---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T01: Create audioPreferences module and wire to PlayerContext

Create musicode-ui/src/audio/audioPreferences.ts — a small module that reads/writes volume, shuffle, and repeatMode to localStorage under a 'musicode-prefs' key. Read on app init to hydrate initialState in PlayerContext. Write on every SET_VOLUME, TOGGLE_SHUFFLE, TOGGLE_REPEAT action via a middleware-style effect in the reducer or a useEffect in PlayerProvider. Handle invalid/missing values gracefully: parse errors reset to defaults (volume 0.8, shuffle false, repeatMode 'off').

## Inputs

- `PlayerContext initialState and reducer`
- `localStorage API`

## Expected Output

- `audioPreferences.ts with load/save functions`
- `PlayerContext reads initial state from localStorage`
- `SET_VOLUME, TOGGLE_SHUFFLE, TOGGLE_REPEAT trigger save`

## Verification

TypeScript compiles. Change volume to 0.3, shuffle on, repeat all → reload page → values restored. Clear localStorage → reload → defaults applied, no console errors.
