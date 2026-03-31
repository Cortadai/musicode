---
estimated_steps: 6
estimated_files: 2
skills_used: []
---

# T02: Frontend — report play at 50% duration

1. In usePlayer.ts, add a ref to track whether current track has been reported
2. In the timeupdate handler, check if currentTime > duration * 0.5
3. If threshold crossed and not yet reported, POST /api/plays/{trackId} with listenDurationSec
4. Reset the reported flag when track changes
5. Add the API function in a new api/plays.ts file
6. Verify: play a track past 50%, check network tab for POST request

## Inputs

- `usePlayer.ts hook`
- `axios client`

## Expected Output

- `Updated usePlayer.ts`
- `plays.ts API module`

## Verification

Play a track past 50% in the browser. Network tab shows POST /api/plays/{trackId} with 201 response.
