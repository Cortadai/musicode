# S03: Flyway Migrations + Token Encryption

**Goal:** Replace ddl-auto:update with Flyway migrations and encrypt scrobble tokens (Last.fm session key, ListenBrainz token) at rest.
**Demo:** 

## Must-Haves

- App boots with Flyway-managed schema on existing H2 data (no data loss, no drift). ddl-auto set to 'validate'. Scrobble tokens stored encrypted (AES-GCM via Spring Security Encryptors.stronger). Plaintext tokens already in DB are re-encrypted on startup. Full test suite green; coverage gate (80%) holds.

## Proof Level

- This slice proves: Startup with real H2 file from previous milestones + `mvn verify` green + manual read of `.mv.db` confirms tokens no longer plaintext.

## Integration Closure

Flyway migrations become the single source of truth for schema evolution. Token encryption is transparent via JPA AttributeConverter — service code does not change.

## Verification

- Flyway logs each migration applied/skipped at INFO. TokenMigrationRunner logs how many rows it re-encrypted (no token content logged). Failures fail-fast at startup.

## Tasks

- [x] **T01: Flyway V1 baseline from real H2 schema dump (D024)** `est:S`
  Dump the current H2 schema using SCRIPT TO, sanitize it into a portable CREATE-only SQL, and commit as src/main/resources/db/migration/V1__baseline.sql. No Flyway wiring yet — this task only produces the baseline artifact and verifies it matches the live DB. Honors D024: never reconstruct from JPA entities.
  - Files: `musicode-server/src/main/resources/db/migration/V1__baseline.sql`
  - Verify: Compare dumped schema against fresh JPA ddl-auto:create output — any divergence documented. V1 applies cleanly on empty H2 and reproduces the known object set (tables, indexes, FKs).

- [x] **T02: Wire Flyway, set ddl-auto:validate, keep tests green** `est:M`
  Add flyway-core dependency. Configure Flyway in application.yml: baseline-on-migrate=true, baseline-version=0, locations=classpath:db/migration. Flip spring.jpa.hibernate.ddl-auto from 'update' to 'validate'. Ensure test profile uses Flyway too (so migrations are the single source of truth). Run full suite.
  - Files: `musicode-server/pom.xml`, `musicode-server/src/main/resources/application.yml`, `musicode-server/src/test/resources/application-test.yml`
  - Verify: `mvn verify` green. App boots against existing .mv.db with `Successfully validated` Flyway log. Starting against empty H2 applies V1 and seeds admin as usual.

- [x] **T03: TokenEncryptionService + EncryptedStringConverter** `est:M`
  Add MUSICODE_TOKEN_ENCRYPTION_KEY env var (fail-fast at startup if missing outside test profile). Implement TokenEncryptionService using Spring Security's Encryptors.stronger (AES-GCM, PBKDF2). Implement EncryptedStringConverter (JPA AttributeConverter<String,String>): on write wraps ciphertext with a 'v1:' prefix; on read, values starting with 'v1:' are decrypted, anything else is returned as-is (tolerant read for pre-migration rows). Unit tests cover: round-trip, plaintext tolerance, null handling, wrong-key failure.
  - Files: `musicode-server/src/main/java/com/musicode/service/TokenEncryptionService.java`, `musicode-server/src/main/java/com/musicode/util/EncryptedStringConverter.java`, `musicode-server/src/main/java/com/musicode/config/SecurityConfig.java`, `musicode-server/src/test/java/com/musicode/service/TokenEncryptionServiceTest.java`, `musicode-server/src/test/java/com/musicode/util/EncryptedStringConverterTest.java`, `musicode-server/src/main/resources/application.yml`
  - Verify: Unit tests green. Manual: encrypt string A, read back → A. Read plaintext 'legacy' through converter → 'legacy'. Service fails fast on missing key in prod profile.

- [x] **T04: Apply encryption to User tokens + migration runner + docs** `est:M`
  Annotate User.lastfmSessionKey and User.listenbrainzToken with @Convert(converter=EncryptedStringConverter.class). Implement TokenMigrationRunner (ApplicationRunner, @Order after Flyway): scans users with plaintext tokens (no 'v1:' prefix via raw JDBC read), re-saves them through JPA so the converter re-encrypts. Idempotent — logs only counts, never token content. Update .env.example and SCROBBLING.md with MUSICODE_TOKEN_ENCRYPTION_KEY (how to generate, why mandatory, rotation note). Note BSM as future option only.
  - Files: `musicode-server/src/main/java/com/musicode/model/entity/User.java`, `musicode-server/src/main/java/com/musicode/config/TokenMigrationRunner.java`, `musicode-server/src/test/java/com/musicode/config/TokenMigrationRunnerTest.java`, `SCROBBLING.md`, `.env.example`
  - Verify: Integration test: seed user with plaintext token → runner executes → DB row starts with 'v1:' → service still reads correct plaintext via JPA. Full `mvn verify` green. Coverage ≥80%.

## Files Likely Touched

- musicode-server/src/main/resources/db/migration/V1__baseline.sql
- musicode-server/pom.xml
- musicode-server/src/main/resources/application.yml
- musicode-server/src/test/resources/application-test.yml
- musicode-server/src/main/java/com/musicode/service/TokenEncryptionService.java
- musicode-server/src/main/java/com/musicode/util/EncryptedStringConverter.java
- musicode-server/src/main/java/com/musicode/config/SecurityConfig.java
- musicode-server/src/test/java/com/musicode/service/TokenEncryptionServiceTest.java
- musicode-server/src/test/java/com/musicode/util/EncryptedStringConverterTest.java
- musicode-server/src/main/java/com/musicode/model/entity/User.java
- musicode-server/src/main/java/com/musicode/config/TokenMigrationRunner.java
- musicode-server/src/test/java/com/musicode/config/TokenMigrationRunnerTest.java
- SCROBBLING.md
- .env.example
