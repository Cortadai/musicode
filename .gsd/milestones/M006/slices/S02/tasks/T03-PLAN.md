---
estimated_steps: 11
estimated_files: 2
skills_used: []
---

# T03: Browse + playback E2E tests

1. Write browse.spec.ts:
   - Test albums page: login, verify album cards render with cover art
   - Test album detail: click album, verify track list appears
   - Test artist page: navigate to artists, verify artist list
   - Test artist detail: click artist, verify albums shown
2. Write playback.spec.ts:
   - Test play track: login, navigate to album, click first track
   - Verify player bar appears with track title
   - Verify audio element currentTime advances (> 0 after short wait)
   - Test pause: click pause, verify currentTime stops advancing
3. Verify all tests pass headless

## Inputs

- `Page component structure, PlayerBar, AlbumCard`

## Expected Output

- `musicode-ui/e2e/browse.spec.ts`
- `musicode-ui/e2e/playback.spec.ts`

## Verification

npx playwright test e2e/browse.spec.ts e2e/playback.spec.ts passes headless.
