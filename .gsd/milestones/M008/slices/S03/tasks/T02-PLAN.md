---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T02: Wire Flyway, set ddl-auto:validate, keep tests green

Add flyway-core dependency. Configure Flyway in application.yml: baseline-on-migrate=true, baseline-version=0, locations=classpath:db/migration. Flip spring.jpa.hibernate.ddl-auto from 'update' to 'validate'. Ensure test profile uses Flyway too (so migrations are the single source of truth). Run full suite.

## Inputs

- `V1__baseline.sql from T01`

## Expected Output

- `Flyway on classpath`
- `ddl-auto=validate in prod + test profiles`
- `All 187 tests pass`

## Verification

`mvn verify` green. App boots against existing .mv.db with `Successfully validated` Flyway log. Starting against empty H2 applies V1 and seeds admin as usual.
