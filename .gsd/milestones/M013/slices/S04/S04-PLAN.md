# S04: Scrobble status indicator

**Goal:** Visual scrobble status indicator in PlayerBar showing whether play was reported for current track
**Demo:** Play a track past 50% — scrobble dot appears in PlayerBar using accent color. Simulate scrobble failure — dot changes to warning color with tooltip showing error.

## Must-Haves

- Small dot indicator in PlayerBar shows scrobble state: accent color when reported, subtle warning on error. Tooltip explains status. useScrobble returns status. All existing tests pass.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Extend useScrobble to return status** `est:10m`
  Add scrobbleStatus state to useScrobble: 'idle' (not yet reached 50%), 'reported' (POST succeeded), 'error' (POST failed). Return status from hook. Update usePlayer to expose it.
  - Files: `musicode-ui/src/hooks/useScrobble.ts`, `musicode-ui/src/hooks/usePlayer.ts`
  - Verify: TypeScript compiles, existing tests pass

- [x] **T02: ScrobbleIndicator component in PlayerBar** `est:15m`
  Small dot/icon next to the transport controls or track info. Uses accent color (indigo-400) when reported, zinc-600 when idle, amber-500 on error. Tooltip shows status text. Only visible when scrobble services are configured (query /scrobble/settings once on mount).
  - Files: `musicode-ui/src/components/player/ScrobbleIndicator.tsx`, `musicode-ui/src/components/player/PlayerBar.tsx`
  - Verify: Indicator renders with correct states, tooltip shows status

- [x] **T03: Verify build and tests** `est:5m`
  Run TypeScript check and all tests.
  - Verify: tsc --noEmit clean, vitest --run all green

## Files Likely Touched

- musicode-ui/src/hooks/useScrobble.ts
- musicode-ui/src/hooks/usePlayer.ts
- musicode-ui/src/components/player/ScrobbleIndicator.tsx
- musicode-ui/src/components/player/PlayerBar.tsx
