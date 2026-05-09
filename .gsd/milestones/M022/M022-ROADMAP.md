# M022: Lyrics Sidebar & Album Detail Enrichment

## Vision
Expose lyrics from the normal UI via a right sidebar panel (same pattern as QueuePanel), and enrich the album detail page with audio quality summary, artist bio from Last.fm, and related albums from local DB.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | S01 | low | — | ✅ | Click lyrics button in PlayerBar → right sidebar opens with synced lyrics for current track. Click queue button → lyrics closes, queue opens. Works in all 3 shells. |
| S02 | S02 | medium | — | ✅ | Open any album detail page → header shows audio quality badges. If Last.fm has artist data, bio excerpt appears. Other albums by same artist shown in horizontal scroll. |
