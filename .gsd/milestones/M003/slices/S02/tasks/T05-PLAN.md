---
estimated_steps: 1
estimated_files: 8
skills_used: []
---

# T05: Adapt existing tests + write auth tests

Update all 6 existing controller tests to work with security: add @WithMockUser or inject auth cookies via test helper. Write AuthControllerTest: login success returns 200 + sets cookies, login bad credentials returns 401, access protected endpoint without token returns 401, access with valid token returns 200, refresh with valid token rotates and returns new cookies, refresh with revoked token returns 401, logout clears cookies and revokes token, /api/auth/me returns current user. Write JwtServiceTest: generate/validate/extract/expiry. Coverage ≥80% maintained. All tests green.

## Inputs

- `All controller test files`
- `SecurityConfig`
- `AuthController`

## Expected Output

- `Updated 6 controller tests with security`
- `AuthControllerTest.java`
- `JwtServiceTest.java`

## Verification

mvn clean verify — all tests pass, coverage ≥80%
