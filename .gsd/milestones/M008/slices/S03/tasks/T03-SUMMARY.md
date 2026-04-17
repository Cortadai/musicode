---
id: T03
parent: S03
milestone: M008
key_files:
  - musicode-server/src/main/java/com/musicode/service/TokenEncryptionService.java
  - musicode-server/src/main/java/com/musicode/util/EncryptedStringConverter.java
  - musicode-server/src/test/java/com/musicode/service/TokenEncryptionServiceTest.java
  - musicode-server/src/test/java/com/musicode/util/EncryptedStringConverterTest.java
  - musicode-server/src/main/resources/application.yml
  - musicode-server/src/test/resources/application-test.yml
key_decisions:
  - Used Encryptors.delux (text-returning AES-GCM + PBKDF2) instead of Encryptors.stronger (bytes-returning) so converter can stay String->String.
  - Added 'v1:' version prefix on stored ciphertext to enable tolerant read of legacy plaintext and future key rotation.
  - Static volatile encryptionService reference on the converter + @PostConstruct Initializer — Hibernate builds converters outside Spring, and this avoids polluting entity classes with Spring wiring.
duration: 
verification_result: passed
completed_at: 2026-04-16T20:16:08.063Z
blocker_discovered: false
---

# T03: Added AES-256-GCM TokenEncryptionService + v1:-prefixed EncryptedStringConverter with tolerant read for legacy plaintext.

**Added AES-256-GCM TokenEncryptionService + v1:-prefixed EncryptedStringConverter with tolerant read for legacy plaintext.**

## What Happened

Added `TokenEncryptionService` wrapping Spring Security's `Encryptors.delux` (AES-256-GCM + PBKDF2). Key is injected from `musicode.encryption.token-key` (env `MUSICODE_TOKEN_ENCRYPTION_KEY`); constructor throws `IllegalStateException` if the key is blank so the app fails fast outside the test profile. The test profile sets a fixed key via `application-test.yml`.

`EncryptedStringConverter` is a JPA `AttributeConverter<String,String>`. Write path prepends a `v1:` version tag to the ciphertext; read path decrypts only `v1:`-prefixed values and passes anything else through untouched (tolerant read for pre-S03 plaintext). Because Hibernate instantiates converters outside the Spring context, a nested `@Component Initializer` pushes the `TokenEncryptionService` into a static `volatile` field via `@PostConstruct`. Converter throws if used before initialization — prevents silent failures.

Unit tests cover: round-trip, null handling, tolerant read for non-prefixed values, wrong-key decrypt failure, and the "service not initialized" guard on the converter. Added `application.yml` binding for `musicode.encryption.token-key: ${MUSICODE_TOKEN_ENCRYPTION_KEY:}`.

## Verification

`mvn verify` green: 187 tests / 0 failures / 0 errors / JaCoCo 86% instruction coverage (gate 80%). New unit tests (TokenEncryptionServiceTest, EncryptedStringConverterTest) pass. Startup against empty profile without key reproduces fail-fast IllegalStateException as designed.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn -f musicode-server/pom.xml verify` | 0 | pass | 180000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/service/TokenEncryptionService.java`
- `musicode-server/src/main/java/com/musicode/util/EncryptedStringConverter.java`
- `musicode-server/src/test/java/com/musicode/service/TokenEncryptionServiceTest.java`
- `musicode-server/src/test/java/com/musicode/util/EncryptedStringConverterTest.java`
- `musicode-server/src/main/resources/application.yml`
- `musicode-server/src/test/resources/application-test.yml`
