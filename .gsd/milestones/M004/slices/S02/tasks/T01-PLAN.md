---
estimated_steps: 1
estimated_files: 12
skills_used: []
---

# T01: @ControllerAdvice + custom exceptions

Create custom exceptions: ResourceNotFoundException (404), ConflictException (409), BadRequestException (400). Create GlobalExceptionHandler (@RestControllerAdvice) handling: ResourceNotFoundException → 404, ConflictException → 409, BadRequestException → 400, MethodArgumentNotValidException → 400 (validation), AuthenticationException → 401, AccessDeniedException → 403, generic Exception → 500. Response format: { error, status, timestamp, path }. Create ErrorResponse record. Remove inline error handling from controllers — throw custom exceptions instead. Remove the inline AuthenticationEntryPoint and AccessDeniedHandler from SecurityConfig — let the @ControllerAdvice handle them (or keep SecurityConfig handlers for pre-controller errors and document why).

## Inputs

- `All controller files`
- `SecurityConfig`

## Expected Output

- `ResourceNotFoundException.java`
- `ConflictException.java`
- `BadRequestException.java`
- `ErrorResponse.java`
- `GlobalExceptionHandler.java`
- `Updated controllers`
- `Updated SecurityConfig`

## Verification

mvn clean verify — all tests pass, coverage ≥80%
