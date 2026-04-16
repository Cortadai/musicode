---
id: T06
parent: S01
milestone: M008
key_files:
  - musicode-server/pom.xml
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-16T18:03:08.765Z
blocker_discovered: false
---

# T06: Removed scrobble-service JaCoCo excludes; bundle coverage at 87.10% with gate passing

**Removed scrobble-service JaCoCo excludes; bundle coverage at 87.10% with gate passing**

## What Happened

Dropped LastfmService, ListenBrainzService, and ScrobbleService from the JaCoCo `<excludes>` block in pom.xml. LibraryScanService, MetadataService, CoverArtService, AudioStreamService stay excluded (I/O-heavy, integration-tested) and MusicodeApplication stays excluded (Spring bootstrap). Ran `mvn clean verify`: 168 tests pass, "All coverage checks have been met", bundle line coverage 87.10% (covered=621/713, missed=92), well above the 80% threshold. Coverage reports in target/site/jacoco/ now reflect the actual scrobble-path instead of hiding it.

## Verification

`mvn clean verify` → BUILD SUCCESS, 168 tests pass, JaCoCo check passes at 87.10% bundle line coverage.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn clean verify` | 0 | pass | 180000ms |
| 2 | `awk -F, ... jacoco.csv` | 0 | pass | 50ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/pom.xml`
