---
estimated_steps: 1
estimated_files: 5
skills_used: []
---

# T04: Apply encryption to User tokens + migration runner + docs

Annotate User.lastfmSessionKey and User.listenbrainzToken with @Convert(converter=EncryptedStringConverter.class). Implement TokenMigrationRunner (ApplicationRunner, @Order after Flyway): scans users with plaintext tokens (no 'v1:' prefix via raw JDBC read), re-saves them through JPA so the converter re-encrypts. Idempotent — logs only counts, never token content. Update .env.example and SCROBBLING.md with MUSICODE_TOKEN_ENCRYPTION_KEY (how to generate, why mandatory, rotation note). Note BSM as future option only.

## Inputs

- `EncryptedStringConverter from T03`
- `Existing User entity`

## Expected Output

- `Tokens encrypted at rest`
- `One-shot migration for legacy rows`
- `Docs updated`

## Verification

Integration test: seed user with plaintext token → runner executes → DB row starts with 'v1:' → service still reads correct plaintext via JPA. Full `mvn verify` green. Coverage ≥80%.
