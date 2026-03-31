# S01: Service Unit Tests + Coverage Restoration

**Goal:** Write unit tests for all untested services. Remove JaCoCo exclusions for scrobble services. Restore honest coverage metrics.
**Demo:** After this: After this: mvn clean verify passes with scrobble services included in JaCoCo. StatsService, LastfmService (signature), ScrobbleService (retry), ActivityService (broadcast) all have dedicated unit tests.

## Tasks
