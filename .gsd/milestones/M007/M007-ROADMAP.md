# M007: 

## Vision
Know what you listen to. Track every play, surface listening patterns through dashboards, share activity with your users, and optionally scrobble to Last.fm and ListenBrainz. Turns Musicode from a passive player into an active listening companion.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Playback Tracking + Stats API | medium | — | ⬜ | After this: play several tracks in the browser, then curl /api/stats/summary shows play count and listening time. curl /api/stats/top-artists returns ranked list. |
| S02 | Stats Dashboard UI | low | S01 | ⬜ | After this: click Stats in sidebar → see your top artists chart, plays-per-day graph, and total listening time. Change period to month → data updates. |
| S03 | Scrobbling — Last.fm & ListenBrainz | high | S01 | ⬜ | After this: configure Last.fm in settings, play a track, check Last.fm profile → track appears in recent listens. |
| S04 | Activity Feed (Server-Sent Events) | medium | S01 | ⬜ | After this: open two browser tabs with different users. Play a track in tab A → tab B shows 'User X listened to Track Y' within seconds. |
