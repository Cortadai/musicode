---
id: S01
parent: M016
milestone: M016
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["musicode-server/src/main/java/com/musicode/service/WaveformService.java", "musicode-server/src/main/java/com/musicode/controller/WaveformController.java", "musicode-server/src/main/java/com/musicode/model/dto/WaveformResponse.java"]
key_decisions:
  - ["redirectErrorStream(true) + -v error to prevent ffmpeg deadlock", "200 peaks default — good detail/payload balance", "JSON file cache, no DB dependency"]
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-25T16:55:16.950Z
blocker_discovered: false
---

# S01: Backend — ffmpeg peak extraction + cache + endpoint

**REST endpoint extracts audio peaks via ffmpeg, caches as JSON, serves ~200 normalized values per track**

## What Happened

Built the full backend pipeline: WaveformService runs ffmpeg ProcessBuilder to extract raw PCM, downsamples to 200 peaks, caches as JSON files. WaveformController exposes GET /api/waveforms/{trackId}. Fixed a critical ffmpeg stderr deadlock with redirectErrorStream. 10 tests (unit + controller + integration) all pass. Docker image updated with ffmpeg runtime dependency.

## Verification

mvn test -Dtest=WaveformControllerTest,WaveformServiceTest — 10 tests, 0 failures

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

None.
