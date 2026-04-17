---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T02: ScrobbleSettingsResponse unit tests — mask() and from()

Pure unit tests for the DTO. mask(): null → null, short token (<=8 chars) → '****', normal token → first4…last4. from(): user with both tokens → both connected+masked, user with no tokens → both disconnected+null masks, user with blank tokens → disconnected.

## Inputs

- `ScrobbleSettingsResponse.java — mask() static method, from(User) factory`

## Expected Output

- `ScrobbleSettingsResponseTest.java with ~6-8 test methods covering null, blank, short, normal tokens`

## Verification

mvn test -pl musicode-server -Dtest=ScrobbleSettingsResponseTest — all green
