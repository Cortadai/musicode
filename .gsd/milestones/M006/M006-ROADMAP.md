# M006: 

## Vision
Add interactive API documentation via SpringDoc OpenAPI (Swagger UI) and end-to-end browser tests via Playwright. Swagger gives a living, auto-generated API reference that stays in sync with the code. Playwright tests exercise the real app from a browser — login, browse, play, admin flows — catching integration regressions that unit/integration tests miss.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | SpringDoc OpenAPI + Swagger UI | low | — | ⬜ | After this: /swagger-ui.html shows all Musicode REST endpoints grouped by controller, with request/response schemas and try-it-out. /v3/api-docs returns the OpenAPI 3.0 JSON spec. |
| S02 | Playwright E2E — Setup + Core Flows | medium | — | ⬜ | After this: npx playwright test runs headless and verifies login → browse albums → play track → admin user CRUD. Clear pass/fail output. |
| S03 | Playwright Extended Flows + CI Config | low | S02 | ⬜ | After this: E2E suite covers search, settings/library management, error states, and artist/track views. Tests run in CI-ready headless mode with HTML report. |
