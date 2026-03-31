# M008: 

## Vision
Stop, fortify, verify. Address every known gap in testing, data integrity, security, and code structure before adding new features. When this milestone is done, every service has tests, scrobbling is verified against real APIs, the database has migration tooling, and the frontend is structured to scale.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Service Unit Tests + Coverage Restoration | low | — | ⬜ | After this: mvn clean verify passes with scrobble services included in JaCoCo. StatsService, LastfmService (signature), ScrobbleService (retry), ActivityService (broadcast) all have dedicated unit tests. |
| S02 | Scrobble Integration Verification | high | S01 | ⬜ | After this: play a track in Musicode, check Last.fm profile → track appears in recent scrobbles. Check ListenBrainz → listen recorded. |
| S03 | Flyway Migrations + Token Encryption | medium | — | ⬜ | After this: app starts with Flyway managing schema. Existing H2 data survives. Scrobble tokens encrypted at rest in DB. |
| S04 | Frontend Structure + Lazy Loading | low | — | ⬜ | After this: route navigation shows brief loading indicator on first visit. StatsPage and SettingsPage are composed of focused sub-components. Bundle chunks split by route. |
