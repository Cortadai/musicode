---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T04: Coverage gate — verify no regression

Run full test suite with JaCoCo. Verify line/branch coverage meets or exceeds the configured gate. Fix any new gaps if gate fails.

## Inputs

- `pom.xml — JaCoCo plugin configuration and coverage thresholds`

## Expected Output

- `Full build green with coverage gate passing`

## Verification

mvn verify -pl musicode-server — BUILD SUCCESS with JaCoCo gate passed
