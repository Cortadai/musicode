---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T03: REST endpoints y controller

Crear LibraryHealthController con GET /api/library/health/summary (devuelve HealthSummary) y GET /api/library/health/issues?type=X&page=0&size=20 (devuelve Page<HealthIssue>). Protegido con autenticación.

## Inputs

- `LibraryHealthService`
- `Spring Security config (authenticated endpoints)`

## Expected Output

- `GET /api/library/health/summary → HealthSummary JSON`
- `GET /api/library/health/issues?type=...&page=...&size=... → Page<HealthIssue> JSON`

## Verification

Integration test con MockMvc que valida respuestas JSON y paginación
