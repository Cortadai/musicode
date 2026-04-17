---
id: S03
parent: M007
milestone: M007
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - (none)
key_decisions:
  - (none)
patterns_established:
  - ["Async scrobbling with fire-and-forget (Knowledge pattern #7)", "@Value-injected API URLs for test overridability (Knowledge rule #4)", "Mockito + WireMock dual testing layer (Knowledge rule #5)"]
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-17T19:34:57.762Z
blocker_discovered: false
---

# S03: Scrobbling — Last.fm & ListenBrainz

**Full scrobbling pipeline: Last.fm + ListenBrainz services, async orchestration, settings UI**

## What Happened

Implemented LastfmService (MD5 signature, track.scrobble, auth.getMobileSession) and ListenBrainzService (submit-listens with Bearer token). Both use @Value-injected URLs for test overridability. ScrobbleService orchestrates async with exponential backoff retry. Settings UI allows connect/disconnect for both providers. Mockito unit tests + WireMock contract tests validate wire format. Commit: 8927e40.

## Verification

mvn clean verify passes. WireMock contract tests validate request format. Settings UI connect/disconnect works. Play → scrobble log entry appears.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

None.
