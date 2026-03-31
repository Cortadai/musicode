---
estimated_steps: 1
estimated_files: 6
skills_used: []
---

# T01: DTOs to Records

Convert to Records: LoginRequest (with @NotBlank on components), CreateUserRequest (with @NotBlank/@NotNull), UpdateUserRequest (all nullable fields), TokenPair, UserResponse (with static factory from(User)), SearchResults. Keep as Lombok classes: ScanStatus (mutable, updated during scan), TrackMetadata (builder pattern, mutable). Verify Jackson serialization/deserialization works with Records. Update any code that calls setters on converted DTOs. Run tests after each conversion.

## Inputs

- `Current DTO files`
- `Controller and service code that uses them`

## Expected Output

- `6 DTOs converted to Records`
- `ScanStatus and TrackMetadata unchanged`

## Verification

mvn clean verify — 97 tests pass, coverage ≥80%
