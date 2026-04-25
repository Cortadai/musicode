---
id: T03
parent: S01
milestone: M016
key_files:
  - musicode-server/src/test/java/com/musicode/service/WaveformServiceIntegrationTest.java
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-25T16:54:44.677Z
blocker_discovered: false
---

# T03: Integration test with real ffmpeg execution against generated WAV fixture

**Integration test with real ffmpeg execution against generated WAV fixture**

## What Happened

Created WaveformServiceIntegrationTest that generates a short WAV file programmatically and runs the full pipeline: ffmpeg extraction, peak normalization, JSON caching. Skips gracefully if ffmpeg is not on PATH (CI-friendly with @DisabledIf).

## Verification

mvn test -Dtest=WaveformServiceIntegrationTest — passes when ffmpeg available, skips cleanly otherwise

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn test -Dtest=WaveformServiceIntegrationTest` | 0 | pass | 5000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/test/java/com/musicode/service/WaveformServiceIntegrationTest.java`
