---
estimated_steps: 5
estimated_files: 2
skills_used: []
---

# T03: Verify integration + run all tests

1. Start Spring Boot and verify /swagger-ui.html loads
2. Verify /v3/api-docs returns valid OpenAPI 3.0 JSON with all paths
3. Verify try-it-out works for an authenticated endpoint (login first, then call /api/users)
4. Run mvn clean verify — all 98+ tests pass, coverage ≥80%
5. Commit

## Inputs

- `Running Spring Boot server`

## Expected Output

- `Verified Swagger UI integration`
- `All tests passing`

## Verification

mvn clean verify exits 0. /swagger-ui.html shows all endpoints. /v3/api-docs returns valid JSON.
