---
estimated_steps: 1
estimated_files: 5
skills_used: []
---

# T02: var + Optional fluent + modern idioms

Scan codebase for: explicit types where var improves readability (e.g. var user = userRepository.findByUsername(...)), if(optional.isPresent()) patterns replaceable with map/orElse/ifPresent, any other Java 21 opportunities. Apply conservatively — only where it genuinely improves readability.

## Inputs

- `All service and controller files`

## Expected Output

- `Updated service and controller files with modern idioms`

## Verification

mvn clean verify — 97 tests pass, coverage ≥80%
