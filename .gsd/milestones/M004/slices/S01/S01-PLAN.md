# S01: Java Modern Idioms

**Goal:** Modernize Java code — DTOs to Records where appropriate, var, Optional fluent patterns
**Demo:** After this: After this: all DTOs are Java Records, code uses var and Optional fluent where appropriate, all tests pass identically.

## Tasks
- [x] **T01: 6 DTOs converted to Java Records — all 97 tests pass with Record accessors.** — Convert to Records: LoginRequest (with @NotBlank on components), CreateUserRequest (with @NotBlank/@NotNull), UpdateUserRequest (all nullable fields), TokenPair, UserResponse (with static factory from(User)), SearchResults. Keep as Lombok classes: ScanStatus (mutable, updated during scan), TrackMetadata (builder pattern, mutable). Verify Jackson serialization/deserialization works with Records. Update any code that calls setters on converted DTOs. Run tests after each conversion.
  - Estimate: 20min
  - Files: musicode-server/src/main/java/com/musicode/model/dto/LoginRequest.java, musicode-server/src/main/java/com/musicode/model/dto/CreateUserRequest.java, musicode-server/src/main/java/com/musicode/model/dto/UpdateUserRequest.java, musicode-server/src/main/java/com/musicode/model/dto/TokenPair.java, musicode-server/src/main/java/com/musicode/model/dto/UserResponse.java, musicode-server/src/main/java/com/musicode/model/dto/SearchResults.java
  - Verify: mvn clean verify — 97 tests pass, coverage ≥80%
- [x] **T02: TokenHashUtil extracted from duplicated code, var applied consistently — 97 tests pass.** — Scan codebase for: explicit types where var improves readability (e.g. var user = userRepository.findByUsername(...)), if(optional.isPresent()) patterns replaceable with map/orElse/ifPresent, any other Java 21 opportunities. Apply conservatively — only where it genuinely improves readability.
  - Estimate: 15min
  - Files: musicode-server/src/main/java/com/musicode/service/AuthService.java, musicode-server/src/main/java/com/musicode/service/RefreshTokenService.java, musicode-server/src/main/java/com/musicode/controller/UserController.java, musicode-server/src/main/java/com/musicode/controller/AuthController.java, musicode-server/src/main/java/com/musicode/controller/LibraryController.java
  - Verify: mvn clean verify — 97 tests pass, coverage ≥80%
