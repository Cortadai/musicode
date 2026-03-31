# S01: Java Modern Idioms — UAT

**Milestone:** M004
**Written:** 2026-03-31T10:06:51.712Z

## UAT: S01 \u2014 Java Modern Idioms\n\n### Test 1: Records serialize correctly\n1. POST /api/auth/login with JSON body\n2. **Expected:** Response has correct field names (id, username, role, enabled)\n\n### Test 2: Validation works on Records\n1. POST /api/auth/login with empty username\n2. **Expected:** 400 with validation error\n\n### Test 3: Full test suite\n1. Run `mvn clean verify`\n2. **Expected:** 97 tests pass, JaCoCo \u226580% met
