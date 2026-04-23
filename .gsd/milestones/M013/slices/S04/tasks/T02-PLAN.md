---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T02: ScrobbleIndicator component in PlayerBar

Small dot/icon next to the transport controls or track info. Uses accent color (indigo-400) when reported, zinc-600 when idle, amber-500 on error. Tooltip shows status text. Only visible when scrobble services are configured (query /scrobble/settings once on mount).

## Inputs

- `useScrobble status`
- `scrobble settings API`

## Expected Output

- `ScrobbleIndicator component wired into PlayerBar`

## Verification

Indicator renders with correct states, tooltip shows status
