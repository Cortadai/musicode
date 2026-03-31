---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T03: User CRUD + role enforcement tests

Write UserControllerTest: ADMIN can list users, ADMIN can create user, ADMIN can update user, ADMIN can delete user, ADMIN cannot delete self, create with duplicate username returns 409, create with blank fields returns 400, password never in response. LISTENER gets 403 on all user CRUD. Write role enforcement tests: LISTENER gets 403 on POST/DELETE library folders, LISTENER gets 403 on POST scan, LISTENER can GET folders and scan status, LISTENER can browse tracks/albums/artists/search. Verify all existing tests still pass. Coverage ≥80%.

## Inputs

- `UserController from T01`
- `SecurityConfig from T02`
- `AuthControllerTest patterns from S02`

## Expected Output

- `UserControllerTest.java`
- `Updated tests green`

## Verification

mvn clean verify — all tests pass, coverage ≥80%
