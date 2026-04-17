---
id: T01
parent: S03
milestone: M008
key_files:
  - musicode-server/src/main/resources/db/migration/V1__baseline.sql
key_decisions:
  - Honored D024 — baseline is the real on-disk schema, not a JPA reconstruction. Constraint and index names are preserved so Flyway's baseline-on-migrate won't drift against the existing .mv.db.
  - Dropped environment-specific lines (CREATE USER hash, SET DB_CLOSE_DELAY) and restore-time flags (NOCHECK) — these belong to a dump, not a migration.
duration: 
verification_result: passed
completed_at: 2026-04-16T19:46:52.365Z
blocker_discovered: false
---

# T01: Flyway V1 baseline created from real H2 dump; DDL matches live DB byte-for-byte.

**Flyway V1 baseline created from real H2 dump; DDL matches live DB byte-for-byte.**

## What Happened

Stopped the running Spring Boot server to release the H2 file lock (taskkill on PID 30124 — wmic isn't installed, tasklist/taskkill substituted). Exported the live schema + data with `org.h2.tools.Script` against `jdbc:h2:file:./data/musicode-db;IFEXISTS=TRUE` into `/tmp/h2dump/full-dump.sql` (129 lines, 7 tables, 1 user, 17 tracks, 8 refresh tokens, etc.). Sanitized it down to a schema-only artifact at `src/main/resources/db/migration/V1__baseline.sql`.

Cleanup applied to the raw dump (documented in-file):

1. Removed `CREATE USER "SA" SALT ... HASH ... ADMIN` — environment-specific credential, not schema. H2 creates SA automatically when the JDBC user matches.
2. Removed `SET DB_CLOSE_DELAY -1` — session-level knob, already set via JDBC URL in application.yml.
3. Removed all `INSERT` statements and `-- N +/- SELECT COUNT(*)` comments — this is a baseline for schema, not data. Existing rows stay in place because Flyway will use `baseline-on-migrate=true` in T02.
4. Changed `CREATE CACHED TABLE` to `CREATE TABLE` — `CACHED` is a legacy H2 storage hint (tables are CACHED by default in 2.x). Keeping it portable for any future H2 / alternative engine.
5. Stripped `NOCHECK` from foreign keys — NOCHECK is a restore-time flag used by SCRIPT TO to skip validation during reload; real migrations need validation ON.

Kept as-is (important for Flyway validation against existing DBs): the H2-generated constraint names (`CONSTRAINT_7`, `CONSTRAINT_F`, `UKR43AF9AP4EDM43MMTQ01ODDJ6`, etc.), the two explicit indexes on PLAYBACK_EVENTS, the identity-column `RESTART WITH N` values, and `NULLS DISTINCT`/`NULLS FIRST` clauses. These match the live `.mv.db` exactly — which is the whole point of D024.

## Verification

Applied V1 to a fresh H2 via `org.h2.tools.RunScript` (exit 0), then re-dumped the resulting DB with `org.h2.tools.Script` and diffed against the live dump. After stripping runtime-only lines (CREATE USER, SET DB_CLOSE_DELAY, INSERTs, row-count comments) and normalizing whitespace, the two DDL statement sets are identical: 28 statements on each side, `diff` exits 0.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `java -cp h2-2.3.232.jar org.h2.tools.RunScript -url jdbc:h2:file:/tmp/v1test -user sa -script V1__baseline.sql` | 0 | pass | 1800ms |
| 2 | `diff <(normalize live-dump) <(normalize v1-applied) # DDL-only, whitespace-normalized` | 0 | pass | 50ms |

## Deviations

None.

## Known Issues

Server was stopped to release the H2 file lock; not restarted yet (T02 will wire Flyway and we'll start fresh). The `data/musicode-db.mv.db` file is intact and untouched by this task.

## Files Created/Modified

- `musicode-server/src/main/resources/db/migration/V1__baseline.sql`
