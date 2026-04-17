---
estimated_steps: 1
estimated_files: 6
skills_used: []
---

# T03: TokenEncryptionService + EncryptedStringConverter

Add MUSICODE_TOKEN_ENCRYPTION_KEY env var (fail-fast at startup if missing outside test profile). Implement TokenEncryptionService using Spring Security's Encryptors.stronger (AES-GCM, PBKDF2). Implement EncryptedStringConverter (JPA AttributeConverter<String,String>): on write wraps ciphertext with a 'v1:' prefix; on read, values starting with 'v1:' are decrypted, anything else is returned as-is (tolerant read for pre-migration rows). Unit tests cover: round-trip, plaintext tolerance, null handling, wrong-key failure.

## Inputs

- `Spring Security Crypto module (already transitive via spring-security-core)`

## Expected Output

- `TokenEncryptionService bean`
- `EncryptedStringConverter ready to annotate on entity fields`
- `Config gate for missing env var`

## Verification

Unit tests green. Manual: encrypt string A, read back → A. Read plaintext 'legacy' through converter → 'legacy'. Service fails fast on missing key in prod profile.
