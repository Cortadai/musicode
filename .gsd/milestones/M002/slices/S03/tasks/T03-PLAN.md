---
estimated_steps: 9
estimated_files: 1
skills_used: []
---

# T03: Full test suite verification — both stacks green

Why: Final verification that both test suites run cleanly together and no tests are flaky or dependent on machine state.

Files: none (verification-only task)

Do:
1. Run `cd musicode-server && mvn test` — all tests pass.
2. Run `cd musicode-ui && npm test` — all tests pass.
3. Fix any failures discovered.
4. Verify the existing MetadataServiceTest still passes (it depends on a local FLAC file — if it fails, skip it with @Disabled and a note, since it's machine-dependent).

Verify: `cd musicode-server && mvn test && cd ../musicode-ui && npm test`
Done when: Both `mvn test` and `npm test` exit 0 with all tests green.

## Inputs

- `All test files from T01 and T02`

## Expected Output

- `Both test suites passing with exit code 0`

## Verification

cd musicode-server && mvn test && cd ../musicode-ui && npm test
