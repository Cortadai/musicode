---
id: T02
parent: S01
milestone: M004
provides: []
requires: []
affects: []
key_files: ["musicode-server/src/main/java/com/musicode/util/TokenHashUtil.java", "musicode-server/src/main/java/com/musicode/service/AuthService.java", "musicode-server/src/main/java/com/musicode/service/RefreshTokenService.java"]
key_decisions: ["Extracted TokenHashUtil as static utility — eliminates SHA-256 hashing duplication", "var used throughout RefreshTokenService for local variables", "Codebase was already using var and Optional fluent — minimal changes needed"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "mvn clean verify — 97 tests pass, coverage ≥80%."
completed_at: 2026-03-31T10:06:25.971Z
blocker_discovered: false
---

# T02: TokenHashUtil extracted from duplicated code, var applied consistently — 97 tests pass.

> TokenHashUtil extracted from duplicated code, var applied consistently — 97 tests pass.

## What Happened
---
id: T02
parent: S01
milestone: M004
key_files:
  - musicode-server/src/main/java/com/musicode/util/TokenHashUtil.java
  - musicode-server/src/main/java/com/musicode/service/AuthService.java
  - musicode-server/src/main/java/com/musicode/service/RefreshTokenService.java
key_decisions:
  - Extracted TokenHashUtil as static utility — eliminates SHA-256 hashing duplication
  - var used throughout RefreshTokenService for local variables
  - Codebase was already using var and Optional fluent — minimal changes needed
duration: ""
verification_result: passed
completed_at: 2026-03-31T10:06:25.971Z
blocker_discovered: false
---

# T02: TokenHashUtil extracted from duplicated code, var applied consistently — 97 tests pass.

**TokenHashUtil extracted from duplicated code, var applied consistently — 97 tests pass.**

## What Happened

Extracted duplicate hashToken methods from AuthService and RefreshTokenService into TokenHashUtil static utility. Applied var consistently in RefreshTokenService. Codebase was already using var and Optional fluent patterns from M003 — minimal additional changes needed.

## Verification

mvn clean verify — 97 tests pass, coverage ≥80%.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn clean verify` | 0 | ✅ pass | 21300ms |


## Deviations

Extracted TokenHashUtil to eliminate code duplication between AuthService and RefreshTokenService — not originally planned but a clear improvement found during the pass.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/util/TokenHashUtil.java`
- `musicode-server/src/main/java/com/musicode/service/AuthService.java`
- `musicode-server/src/main/java/com/musicode/service/RefreshTokenService.java`


## Deviations
Extracted TokenHashUtil to eliminate code duplication between AuthService and RefreshTokenService — not originally planned but a clear improvement found during the pass.

## Known Issues
None.
