# S01: User Model & Foundation — UAT

**Milestone:** M003
**Written:** 2026-03-31T07:43:52.775Z

## UAT: S01 — User Model & Foundation\n\n### Test 1: Admin seed on fresh database\n1. Delete H2 database file\n2. Start Spring Boot\n3. Check H2 console: `SELECT * FROM USERS`\n4. **Expected:** One row — username='admin', role='ADMIN', enabled=true, passwordHash starts with '$2a$'\n\n### Test 2: Admin seed idempotency\n1. Stop and restart Spring Boot\n2. Check H2 console: `SELECT COUNT(*) FROM USERS WHERE role='ADMIN'`\n3. **Expected:** Still 1 — no duplicate admin created\n\n### Test 3: Existing endpoints still work\n1. GET http://localhost:8080/api/tracks\n2. GET http://localhost:8080/api/albums\n3. **Expected:** Both return 200 with data — no auth required (permit-all chain active)\n\n### Test 4: Test suite\n1. Run `mvn clean verify`\n2. **Expected:** 56 tests pass, 0 failures, JaCoCo coverage met
