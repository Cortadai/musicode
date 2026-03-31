---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T01: UserController CRUD endpoints

Create UserController with endpoints: GET /api/users (list all), GET /api/users/{id} (detail), POST /api/users (create with username/password/role), PUT /api/users/{id} (update username/role/enabled, optional password change), DELETE /api/users/{id} (delete). Create CreateUserRequest DTO (username, password, role) and UpdateUserRequest DTO (username, role, enabled, password optional). Validation: username required, unique check, password required on create, role must be valid. Never return passwordHash in responses — use UserResponse from S02. Admin cannot delete themselves.

## Inputs

- `UserRepository from S01`
- `UserResponse from S02`
- `PasswordEncoder from S01`

## Expected Output

- `UserController.java`
- `CreateUserRequest.java`
- `UpdateUserRequest.java`

## Verification

mvn compile — compiles cleanly
