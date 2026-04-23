---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T04: WireMock tests for error classification

Extend LastfmServiceWireMockTest and ListenBrainzServiceWireMockTest with scenarios: 401 → AUTH_ERROR, 500 → SERVER_ERROR, connection timeout → TIMEOUT, missing config → CONFIG_ERROR. Verify ScrobbleResult carries correct errorType.

## Inputs

- `T01 ScrobbleResult`
- `Knowledge entry #5 (WireMock pattern)`
- `Existing WireMock tests`

## Expected Output

- `401/500/timeout/config error scenarios in both test classes`
- `All pass green`

## Verification

mvn test -pl musicode-server — all new WireMock scenarios pass. Each error type tested.
