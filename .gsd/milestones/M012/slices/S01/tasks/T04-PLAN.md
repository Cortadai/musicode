---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T04: Final verification and cleanup

Run full test suite, verify usePlayer.ts is ≤150 LOC, verify all consumers still work without changes. Clean up any dead imports or unused refs.

## Inputs

- `All 3 extracted hooks integrated`

## Expected Output

- `Clean usePlayer.ts orchestrator`
- `All tests green`
- `No consumer changes needed`

## Verification

vitest --run && wc -l usePlayer.ts ≤150 && no import changes in consumers
