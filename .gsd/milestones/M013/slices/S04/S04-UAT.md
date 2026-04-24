# S04: Scrobble status indicator — UAT

**Milestone:** M013
**Written:** 2026-04-18T19:40:18.228Z

## UAT: S04 — Scrobble Status Indicator\n\n### Preconditions\n- App running, at least one scrobble service (Last.fm or ListenBrainz) configured in Settings\n\n### Test Cases\n\n- [x] **Hidden when not configured**: If no scrobble services connected, no indicator visible\n- [x] **Idle state**: When track starts playing, indicator shows muted (zinc-600) Radio icon\n- [x] **Reported state**: After reaching 50% of track duration, indicator turns indigo-400\n- [x] **Error state**: If play recording fails (e.g. network error), indicator turns amber-500\n- [x] **Tooltip**: Hovering indicator shows status text explaining current state\n- [x] **Reset on track change**: When switching tracks, indicator resets to idle\n- [x] **No regression**: All playback, queue, and controls work normally
