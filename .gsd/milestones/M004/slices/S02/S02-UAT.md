# S02: Backend Error Handling, Logging & Comments — UAT

**Milestone:** M004
**Written:** 2026-03-31T10:16:49.231Z

## UAT: S02 — Backend Error Handling, Logging & Comments\n\n### Test 1: Consistent error format\n1. GET /api/albums/99999\n2. **Expected:** 404 with {status: 404, error: \"Album not found with id: 99999\", path: \"/api/albums/99999\", timestamp: \"...\"}\n\n### Test 2: Request ID in logs\n1. Make any API request\n2. Check server logs\n3. **Expected:** Each log line includes [requestId] field\n\n### Test 3: Full test suite\n1. Run `mvn clean verify`\n2. **Expected:** 97 tests pass, JaCoCo ≥80% met
