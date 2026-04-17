---
id: T02
parent: S03
milestone: M008
key_files:
  - musicode-server/pom.xml
  - musicode-server/src/main/resources/application.yml
  - musicode-server/src/test/resources/application-test.yml
key_decisions:
  - Flyway H2 support stays in flyway-core (no separate flyway-database-h2 needed for current versions)
  - ddl-auto:validate on both prod and test profiles so any JPA/schema drift fails fast in CI
duration: 
verification_result: passed
completed_at: 2026-04-16T20:05:17.984Z
blocker_discovered: false
---

# T02: Flyway wired as single source of truth; ddl-auto flipped to validate in prod + test profiles

**Flyway wired as single source of truth; ddl-auto flipped to validate in prod + test profiles**

## What Happened

Added `org.flywaydb:flyway-core` to pom.xml (H2 dialect support lives in flyway-core itself, not a split module). Configured Flyway in `application.yml` (spring.flyway: enabled=true, locations=classpath:db/migration, baseline-on-migrate=true, baseline-version=0, validate-on-migrate=true) and mirrored the config in `application-test.yml` so the test profile migrates from the same V1 baseline. Flipped `spring.jpa.hibernate.ddl-auto` from `update` to `validate` in both profiles — migrations are now the only path to schema change. Existing `.mv.db` files get `baseline-on-migrate` treatment so the first boot marks V1 as applied without re-running DDL. Full Maven verify went green with 187 tests and JaCoCo coverage above 80%.

## Verification

mvn verify completed clean: 187 tests / 0 failures / 0 errors / 0 skipped; packaged jar produced; JaCoCo bundle coverage 86% instruction / &gt;80% line (gate held); no java.exe zombies after shutdown.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn verify` | 0 | pass | 0ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/pom.xml`
- `musicode-server/src/main/resources/application.yml`
- `musicode-server/src/test/resources/application-test.yml`
