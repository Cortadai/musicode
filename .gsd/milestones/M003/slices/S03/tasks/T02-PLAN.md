---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T02: Role-based endpoint security in SecurityFilterChain

Update SecurityFilterChain in SecurityConfig with role-based rules: /api/users/** requires ROLE_ADMIN. /api/library/folders/** (POST, DELETE) requires ROLE_ADMIN. /api/library/scan requires ROLE_ADMIN. /api/library/cleanup requires ROLE_ADMIN. /api/library/folders GET and /api/library/scan/status GET open to any authenticated user (listeners need to see folder list and scan status). /api/tracks/**, /api/albums/**, /api/artists/**, /api/stream/**, /api/covers/**, /api/search/** open to any authenticated user. Add AccessDeniedHandler returning 403 JSON instead of Spring's default HTML.

## Inputs

- `Current SecurityConfig from S02`

## Expected Output

- `Updated SecurityConfig.java`

## Verification

mvn compile — compiles cleanly
