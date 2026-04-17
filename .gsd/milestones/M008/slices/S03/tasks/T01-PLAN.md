---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Flyway V1 baseline from real H2 schema dump (D024)

Dump the current H2 schema using SCRIPT TO, sanitize it into a portable CREATE-only SQL, and commit as src/main/resources/db/migration/V1__baseline.sql. No Flyway wiring yet — this task only produces the baseline artifact and verifies it matches the live DB. Honors D024: never reconstruct from JPA entities.

## Inputs

- `Live musicode.mv.db schema`
- `D024 decision`
- `Current entities under musicode-server/src/main/java/com/musicode/model/entity/`

## Expected Output

- `V1__baseline.sql checked in`
- `Short note (in task summary) of any dump cleanup performed and why`

## Verification

Compare dumped schema against fresh JPA ddl-auto:create output — any divergence documented. V1 applies cleanly on empty H2 and reproduces the known object set (tables, indexes, FKs).
