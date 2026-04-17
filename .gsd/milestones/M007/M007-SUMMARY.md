---
id: M007
title: "Listening Intelligence — Playback Tracking, Stats, Scrobbling, Activity Feed"
status: complete
completed_at: 2026-04-17T19:37:23.878Z
key_decisions:
  - 50% duration threshold for play reporting (not 30s like Spotify)
  - Principal-based auth over @AuthenticationPrincipal String
  - @Value-injected API URLs for external services
  - Dual testing: Mockito + WireMock for third-party services
  - CopyOnWriteArrayList for SSE emitter registry (read-heavy pattern)
  - ALBUM_ARTIST tag for album grouping to prevent fragmentation
key_files:
  - (none)
lessons_learned:
  - @AuthenticationPrincipal String returns null with @WithMockUser — use Principal instead
  - PlaybackEvent FK requires cleanup order in test setUp
  - ALBUM_ARTIST vs track artist grouping prevents compilation album fragmentation
---

# M007: Listening Intelligence — Playback Tracking, Stats, Scrobbling, Activity Feed

**Full listening intelligence pipeline: play tracking at 50% threshold, stats dashboard with Recharts, Last.fm/ListenBrainz scrobbling, and real-time SSE activity feed**

## What Happened

M007 transformed Musicode from a passive player into an active listening companion. S01 built the PlaybackEvent entity and stats aggregation API with period filtering. S02 added Recharts-based stats dashboard. S03 integrated Last.fm (MD5 signature auth) and ListenBrainz (Bearer token) scrobbling with async fire-and-forget orchestration and exponential backoff retry. S04 added real-time activity feed via SSE with CopyOnWriteArrayList emitter management. PlayController serves as the integration hub — recording plays, triggering scrobbles, and broadcasting activity events in a single non-blocking flow.

## Success Criteria Results



## Definition of Done Results



## Requirement Outcomes



## Deviations

None.

## Follow-ups

None.
