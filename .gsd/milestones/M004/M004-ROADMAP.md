# M004: 

## Vision
Elevate Musicode's code quality with Java modern idioms, centralized error handling, structured logging, and didactic comments — without changing any behavior.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Java Modern Idioms | low | — | ✅ | After this: all DTOs are Java Records, code uses var and Optional fluent where appropriate, all tests pass identically. |
| S02 | Backend Error Handling, Logging & Comments | low | S01 | ✅ | After this: all controller error handling centralized in @ControllerAdvice. Custom exceptions replace inline ResponseEntity.badRequest(). Structured logging with MDC request IDs. Didactic comments in security layer. |
| S03 | Frontend Error Handling, Logging & Comments | low | — | ⬜ | After this: React app has ErrorBoundary catching runtime crashes. ErrorMessage component with retry. API errors extracted consistently. console.debug in auth and player flows. Didactic comments in key files. |
