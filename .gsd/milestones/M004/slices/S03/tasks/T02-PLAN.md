---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T02: console.debug logging + didactic comments

Add console.debug calls to: AuthContext (login success/fail, logout, session restore result), axios interceptor (refresh attempt, refresh success/fail, queue size), usePlayer (track change, playback error, audio source). Add didactic comments to: PlayerContext (why useReducer, why separate state/dispatch contexts, why shuffle preserves current track), usePlayer (why singleton Audio, why Symbol owner pattern, why sync effects), AuthContext (why getMe on mount, why catch-ignore on logout), axios interceptor (why queue, what happens without it, why skip login/refresh). Verify build compiles and tests pass.

## Inputs

- `Current context, hook, and api files`

## Expected Output

- `Updated files with logging and comments`

## Verification

npm run build + npm run test:coverage — all pass
