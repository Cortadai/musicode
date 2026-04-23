---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T01: Extend useScrobble to return status

Add scrobbleStatus state to useScrobble: 'idle' (not yet reached 50%), 'reported' (POST succeeded), 'error' (POST failed). Return status from hook. Update usePlayer to expose it.

## Inputs

- `useScrobble.ts`
- `usePlayer.ts`

## Expected Output

- `useScrobble returns { status }`

## Verification

TypeScript compiles, existing tests pass
