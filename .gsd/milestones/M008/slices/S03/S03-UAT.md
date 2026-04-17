# S03: Flyway Migrations + Token Encryption — UAT

**Milestone:** M008
**Written:** 2026-04-16T20:17:12.200Z

## UAT — S03: Flyway Migrations + Token Encryption

### Scenario 1: Boot against existing H2 with plaintext tokens
- **Given** an existing `musicode.mv.db` from before S03 with at least one user holding a plaintext `lastfm_session_key` or `listenbrainz_token`.
- **When** the app boots with `MUSICODE_TOKEN_ENCRYPTION_KEY` set.
- **Then** Flyway logs `Successfully validated` (no migration applied, baseline already recorded).
- **And** `TokenMigrationRunner` logs `re-encrypted N plaintext scrobble credential(s) at rest` where N matches the plaintext row count.
- **And** a SQL inspection of `users` shows those columns now start with `v1:`.
- **And** the scrobble endpoints still work (decrypt path transparent via JPA).

### Scenario 2: Boot against empty H2
- **Given** no `musicode.mv.db` on disk and `MUSICODE_TOKEN_ENCRYPTION_KEY` set.
- **When** the app boots.
- **Then** Flyway applies `V1__baseline.sql` and records it.
- **And** Hibernate's `ddl-auto: validate` passes (no drift between JPA model and V1 schema).
- **And** `AdminSeeder` creates the default admin as usual.

### Scenario 3: Missing encryption key outside test profile
- **Given** `MUSICODE_TOKEN_ENCRYPTION_KEY` unset and profile is not `test`.
- **When** the app starts.
- **Then** startup aborts with `IllegalStateException: MUSICODE_TOKEN_ENCRYPTION_KEY is required...`.
- **And** no partial context is left running.

### Scenario 4: Second boot after successful migration (idempotency)
- **Given** a DB where all token rows already start with `v1:`.
- **When** the app reboots.
- **Then** `TokenMigrationRunner` logs at DEBUG (`no plaintext rows found`) and performs zero UPDATEs.
- **And** decrypted token values still match the originals.

### Scenario 5: Tolerant read on mixed rows
- **Given** a DB with one plaintext row and one `v1:`-prefixed row in the same column.
- **When** a service reads both users.
- **Then** both return the original cleartext token to the caller via the converter.
- **And** after `TokenMigrationRunner` runs, both rows are `v1:`-prefixed at rest.
