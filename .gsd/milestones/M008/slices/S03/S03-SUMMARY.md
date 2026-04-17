---
id: S03
parent: M008
milestone: M008
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["musicode-server/src/main/resources/db/migration/V1__baseline.sql", "musicode-server/pom.xml", "musicode-server/src/main/resources/application.yml", "musicode-server/src/test/resources/application-test.yml", "musicode-server/src/main/java/com/musicode/service/TokenEncryptionService.java", "musicode-server/src/main/java/com/musicode/util/EncryptedStringConverter.java", "musicode-server/src/main/java/com/musicode/model/entity/User.java", "musicode-server/src/main/java/com/musicode/config/TokenMigrationRunner.java", "SCROBBLING.md", ".env.example"]
key_decisions:
  - ["D024 honored: V1 baseline derived from real H2 schema dump, not JPA reconstruction.", "baseline-on-migrate=true + baseline-version=0 so existing DBs adopt Flyway without replaying V1.", "ddl-auto flipped from 'update' to 'validate' \u2014 Flyway is the single source of truth for schema evolution.", "Encrypted values carry a 'v1:' version prefix for tolerant read of legacy plaintext and future key/algorithm rotation.", "JPA-instantiated AttributeConverter is wired to Spring via a @PostConstruct Initializer + static volatile field \u2014 avoids polluting entity classes with Spring wiring."]
patterns_established:
  - ["Flyway with baseline-on-migrate=true for adopting migrations on existing databases without replaying baseline.", "Versioned at-rest encryption via JPA AttributeConverter with tolerant read of legacy plaintext.", "ApplicationRunner + raw JDBC for one-shot data re-encryption migrations where JPA read would obscure the on-disk format."]
observability_surfaces:
  - ["Flyway logs each migration applied/skipped at INFO.", "TokenMigrationRunner logs aggregate row counts only (never token content).", "Missing MUSICODE_TOKEN_ENCRYPTION_KEY fails fast at context startup with an actionable message."]
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-16T20:17:12.200Z
blocker_discovered: false
---

# S03: Flyway Migrations + Token Encryption

**Schema now lives in Flyway migrations (ddl-auto:validate) and scrobble tokens are AES-256-GCM encrypted at rest with tolerant read for legacy rows.**

## What Happened

S03 closes the schema-drift and plaintext-token risks flagged in the M008 roadmap.

**T01 — Flyway V1 baseline (D024).** Dumped the live H2 schema with `SCRIPT TO`, sanitized it into a portable CREATE-only SQL, and committed it as `V1__baseline.sql`. Per D024, the baseline is the real schema from previous milestones, not a JPA reconstruction — this guarantees we do not silently drift away from what the production DB actually looks like.

**T02 — Flyway wired + ddl-auto:validate.** Added `flyway-core`, configured `baseline-on-migrate=true` and `baseline-version=0` so existing databases pick up Flyway without replaying V1, and flipped `spring.jpa.hibernate.ddl-auto` from `update` to `validate`. Test profile uses the same migrations — no drift between prod and test.

**T03 — Token encryption plumbing.** Added `TokenEncryptionService` (Spring `Encryptors.delux`, AES-256-GCM + PBKDF2) keyed from `MUSICODE_TOKEN_ENCRYPTION_KEY`. Fails fast at startup if the key is missing outside the test profile. Added an `EncryptedStringConverter` JPA AttributeConverter that prepends a `v1:` version tag on write and tolerantly reads back anything without the prefix — critical for the legacy plaintext already in the DB. The converter is wired via a nested `@Component Initializer` that pushes the Spring-managed service into a static volatile field (Hibernate instantiates converters outside the Spring context).

**T04 — Apply + migrate + document.** Annotated `User.lastfmSessionKey` and `User.listenbrainzToken` with `@Convert`. Added `TokenMigrationRunner` (ApplicationRunner) that scans the `users` table via raw JDBC, finds rows not starting with `v1:`, and re-writes them as encrypted ciphertext. Idempotent by construction. Documented the key in `.env.example` and `SCROBBLING.md` including generation command and a rotation note.

No production behaviour regressions — existing scrobble flow and stats tests continue to pass. Coverage holds at 86% (gate is 80%).

## Verification

`mvn verify` in `musicode-server`: 187 tests / 0 failures / 0 errors / 0 skipped. JaCoCo instruction coverage 86% (gate 80%). App boots against existing `.mv.db` with Flyway logging `Successfully validated`. Starting against empty H2 applies V1 and seeds admin as expected. Wrong/missing encryption key reproduces fail-fast `IllegalStateException` at startup.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

"Key rotation story (re-encrypt v1: rows under a new key and bump the prefix to v2:) is deferred. BSM (Bouncy Castle / HSM-backed) is documented as a future option only."

## Files Created/Modified

- `musicode-server/src/main/resources/db/migration/V1__baseline.sql` — Flyway V1 baseline dumped from live H2 schema per D024.
- `musicode-server/pom.xml` — Added flyway-core dependency.
- `musicode-server/src/main/resources/application.yml` — Flyway config + ddl-auto:validate + musicode.encryption.token-key binding.
- `musicode-server/src/test/resources/application-test.yml` — Test profile Flyway + fixed encryption key for deterministic tests.
- `musicode-server/src/main/java/com/musicode/service/TokenEncryptionService.java` — AES-256-GCM text encryptor with fail-fast key validation.
- `musicode-server/src/main/java/com/musicode/util/EncryptedStringConverter.java` — JPA converter with v1: version prefix and tolerant read.
- `musicode-server/src/main/java/com/musicode/model/entity/User.java` — @Convert applied to lastfmSessionKey and listenbrainzToken.
- `musicode-server/src/main/java/com/musicode/config/TokenMigrationRunner.java` — One-shot idempotent re-encryption runner for legacy plaintext rows.
- `SCROBBLING.md` — Documented MUSICODE_TOKEN_ENCRYPTION_KEY generation, mandatory nature, rotation note.
- `.env.example` — Added MUSICODE_TOKEN_ENCRYPTION_KEY placeholder.
