---
estimated_steps: 18
estimated_files: 4
skills_used: []
---

# T02: Frontend test setup + PlayerContext reducer and utility tests

Why: No frontend tests exist. PlayerContext reducer is the most complex frontend logic (shuffle, repeat modes, queue management). Utility functions like formatDuration also need coverage.

Files: `musicode-ui/src/context/PlayerContext.test.ts`, `musicode-ui/src/utils/format.test.ts`, `musicode-ui/package.json`, `musicode-ui/vite.config.ts`

Do:
1. Install Vitest and testing-library: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`.
2. Configure Vitest in vite.config.ts (add test config with jsdom environment).
3. Add `"test": "vitest run"` script to package.json.
4. Write `format.test.ts` — test formatDuration with various inputs: 0, 65 (→ '1:05'), null (→ '—'), large values.
5. Write `PlayerContext.test.ts` — extract and test the playerReducer directly:
   - PLAY_TRACK: sets currentTrack, queue, isPlaying
   - PAUSE / RESUME: toggles isPlaying
   - NEXT: advances queue, handles end-of-queue, handles repeat-all wrap, handles repeat-one restart
   - PREV: goes back, handles currentTime > 3s restart, handles repeat-all wrap to end
   - TOGGLE_SHUFFLE: shuffles queue keeping current track first, restores original order on unshuffle
   - TOGGLE_REPEAT: cycles off → all → one → off
   - SET_VOLUME: clamps to 0-1 range
   - STOP: resets to initial state preserving volume

Verify: `cd musicode-ui && npm test`
Done when: All reducer and utility tests pass. `npm test` exits 0.

## Inputs

- `musicode-ui/src/context/PlayerContext.tsx`
- `musicode-ui/src/utils/format.ts`

## Expected Output

- `musicode-ui/src/context/PlayerContext.test.ts`
- `musicode-ui/src/utils/format.test.ts`

## Verification

cd musicode-ui && npm test
