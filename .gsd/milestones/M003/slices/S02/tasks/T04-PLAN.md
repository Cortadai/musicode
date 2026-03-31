---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T04: AuthController — login/refresh/logout endpoints

Create AuthController: POST /api/auth/login (LoginRequest: username, password) → authenticates, generates tokens, sets cookies, returns user info (id, username, role — NOT password). POST /api/auth/refresh → reads refresh_token cookie, validates/rotates, sets new cookies, returns updated user info. POST /api/auth/logout → reads refresh_token cookie, revokes in DB, clears cookies. GET /api/auth/me → returns current user info from SecurityContextHolder. Create LoginRequest DTO and UserResponse DTO.

## Inputs

- `AuthService from T02`
- `CookieUtil from T03`

## Expected Output

- `AuthController.java`
- `LoginRequest.java`
- `UserResponse.java`

## Verification

mvn compile — compiles cleanly
