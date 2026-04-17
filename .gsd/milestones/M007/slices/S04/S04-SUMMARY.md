---
id: S04
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
  - ["SSE with CopyOnWriteArrayList for emitters (Knowledge pattern #8)", "ConcurrentLinkedDeque for bounded recent event buffer"]
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-17T19:35:19.011Z
blocker_discovered: false
---

# S04: Activity Feed (Server-Sent Events)

**Real-time activity feed via SSE with CopyOnWriteArrayList emitter registry and EventSource frontend**

## What Happened

ActivityService uses CopyOnWriteArrayList for read-heavy broadcast, ConcurrentLinkedDeque for last-20-events buffer. ActivityController exposes SSE stream and recent fallback. Frontend ActivityFeed uses EventSource with auto-reconnect. PlayController broadcasts on every recorded play. Commit: a4ab00a.

## Verification

Two browser tabs — play in tab A, activity appears in tab B within seconds via SSE. /api/activity/recent returns buffered events.

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
