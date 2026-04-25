---
id: T01
parent: S01
milestone: M016
key_files:
  - musicode-server/src/main/java/com/musicode/service/WaveformService.java
  - musicode-server/src/main/resources/application.yml
key_decisions:
  - Used redirectErrorStream(true) + -v error to prevent ffmpeg stderr deadlock
  - 200 peaks as default resolution — good balance of detail vs payload size
  - JSON file cache per trackId — simple, no DB dependency
duration: 
verification_result: passed
completed_at: 2026-04-25T16:54:33.041Z
blocker_discovered: false
---

# T01: WaveformService extracts peaks via ffmpeg ProcessBuilder with JSON file cache

**WaveformService extracts peaks via ffmpeg ProcessBuilder with JSON file cache**

## What Happened

Created WaveformService that runs ffmpeg via ProcessBuilder to extract raw PCM samples from audio files, downsamples to 200 normalized peaks (0.0-1.0), and caches results as JSON in data/waveforms/{trackId}.json. Uses @Value-injected paths for ffmpeg binary and waveforms directory. Handles cache hits, missing files, and ffmpeg errors gracefully. Fixed a critical deadlock bug where ffmpeg stderr buffer filled up and blocked the process — resolved by using redirectErrorStream(true) and -v error flag.

## Verification

mvn test -Dtest=WaveformServiceTest — 7 tests pass

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn test -Dtest=WaveformServiceTest` | 0 | pass | 7000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/service/WaveformService.java`
- `musicode-server/src/main/resources/application.yml`
