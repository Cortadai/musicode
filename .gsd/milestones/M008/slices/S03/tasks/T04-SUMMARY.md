---
id: T04
parent: S03
milestone: M008
key_files:
  - musicode-server/src/main/java/com/musicode/model/entity/User.java
  - musicode-server/src/main/java/com/musicode/config/TokenMigrationRunner.java
  - musicode-server/src/test/java/com/musicode/config/TokenMigrationRunnerTest.java
  - SCROBBLING.md
  - .env.example
key_decisions:
  - Used raw JdbcTemplate (not JPA) in the migration runner so the WHERE filter on the stored (encrypted) column works against the literal bytes — JPA would decrypt on read and break the predicate.
  - Runner is ApplicationRunner rather than @PostConstruct on the service: guarantees it fires after Flyway and the full context is ready.
  - Hardcoded column list as a constant (no reflection / metamodel lookup) — only two columns, explicitness wins.
duration: 
verification_result: passed
completed_at: 2026-04-16T20:16:25.393Z
blocker_discovered: false
---

# T04: Annotated User scrobble tokens with @Convert, added idempotent TokenMigrationRunner, and documented the encryption key.

**Annotated User scrobble tokens with @Convert, added idempotent TokenMigrationRunner, and documented the encryption key.**

## What Happened

Annotated `User.lastfmSessionKey` and `User.listenbrainzToken` with `@Convert(converter = EncryptedStringConverter.class)` so JPA transparently encrypts writes and decrypts reads.

Implemented `TokenMigrationRunner` as an `ApplicationRunner`. At boot it queries the `users` table via raw `JdbcTemplate` for rows in `lastfm_session_key` / `listenbrainz_token` that do **not** start with the `v1:` prefix, encrypts them through `TokenEncryptionService`, and writes the prefixed ciphertext back with a parameterized UPDATE. Column names come from a fixed `List.of(...)` constant — safe to concatenate into SQL. The runner is idempotent: a second boot finds zero legacy rows and exits silently at DEBUG. Logs only aggregate counts — no token material.

Unit test (`TokenMigrationRunnerTest`) uses Mockito to verify: plaintext rows are updated with `v1:`-prefixed ciphertext, already-encrypted rows are skipped, empty result short-circuits without writes.

Updated `.env.example` and `SCROBBLING.md` with `MUSICODE_TOKEN_ENCRYPTION_KEY` — generation command (`openssl rand -hex 32`), mandatory nature outside test profile, and a note that rotation requires re-encrypting all `v1:` rows (future work, BSM called out as an option only).

## Verification

`mvn verify` green: 187 tests / 0 failures / 0 errors / JaCoCo 86% instruction coverage (≥80% gate). New TokenMigrationRunnerTest passes. Integration path covered by existing scrobble flow tests — User entity now round-trips tokens through the converter without regressions.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn -f musicode-server/pom.xml verify` | 0 | pass | 180000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/model/entity/User.java`
- `musicode-server/src/main/java/com/musicode/config/TokenMigrationRunner.java`
- `musicode-server/src/test/java/com/musicode/config/TokenMigrationRunnerTest.java`
- `SCROBBLING.md`
- `.env.example`
