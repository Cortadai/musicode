# S01: SpringDoc OpenAPI + Swagger UI — UAT

**Milestone:** M006
**Written:** 2026-04-17T19:55:02.980Z

## UAT — S01: SpringDoc OpenAPI + Swagger UI

| # | Scenario | Expected | Result |
|---|----------|----------|--------|
| 1 | GET /swagger-ui/index.html | Returns 200, renders Swagger UI | ✅ Pass |
| 2 | GET /v3/api-docs | Returns OpenAPI 3.1.0 JSON | ✅ Pass — 31 paths |
| 3 | All controllers visible | 13 controllers with @Tag descriptions | ✅ Pass — 50 annotations |
| 4 | Cookie auth configured | Try-it-out sends cookies | ✅ Pass |
| 5 | No auth required for Swagger | /swagger-ui/** permitted in SecurityConfig | ✅ Pass |
