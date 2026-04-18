# S01: Crossfade Transitions — UAT

**Milestone:** M010
**Written:** 2026-04-18T10:49:50.205Z

## UAT — S01: Crossfade Transitions\n\n### Test Cases\n\n| # | Scenario | Steps | Expected | Result |\n|---|----------|-------|----------|--------|\n| 1 | Crossfade slider appears | Click Blend icon in PlayerBar | Popover with 0–12s slider appears | ✅ Pass |\n| 2 | Gapless at 0 | Set slider to 0, play tracks | Tracks transition with no gap, no fade | ✅ Pass |\n| 3 | Crossfade at N seconds | Set slider to 5s, let track end | Old track fades out, new fades in over 5s | ✅ Pass |\n| 4 | Icon state | Set crossfade > 0 | Blend icon turns indigo | ✅ Pass |\n| 5 | Persistence | Set crossfade to 8s, reload page | Value restored to 8s | ✅ Pass |\n| 6 | Skip during crossfade | Press next while crossfade active | Crossfade cancelled, next track plays | ✅ Pass |\n| 7 | Icon alignment | Compare with visualizer toggle | Both icons vertically aligned | ✅ Pass |\n\n### Verified By\nUser manual testing — 2026-04-18"
