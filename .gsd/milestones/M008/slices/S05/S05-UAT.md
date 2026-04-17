# S05: Production Hardening — Actuator, Security Headers, Rate Limiting — UAT

**Milestone:** M008
**Written:** 2026-04-17T19:36:33.041Z

## UAT: S05 — Production Hardening\n\n- [x] GET /actuator/health returns {status: UP}\n- [x] Response headers include Content-Security-Policy\n- [x] Response headers include Strict-Transport-Security\n- [x] Response headers include X-Content-Type-Options: nosniff\n- [x] Response headers include X-Frame-Options: DENY\n- [x] 5 failed logins from same IP → 429 Too Many Requests\n- [x] X-Request-Id header present in responses
