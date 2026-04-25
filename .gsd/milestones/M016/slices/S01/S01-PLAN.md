# S01: Backend — ffmpeg peak extraction + cache + endpoint

**Goal:** Extract audio peaks via ffmpeg ProcessBuilder, cache as JSON, expose via REST endpoint
**Demo:** After this: `curl /api/waveforms/{trackId}` returns ~200 peak values extracted from a real audio file via ffmpeg

## Must-Haves

- Waveform endpoint returns valid peak array for any track with an audio file

## Proof Level

- This slice proves: integration

## Integration Closure

Endpoint wired into SecurityConfig, ffmpeg runs against real files

## Verification

- Logs ffmpeg execution time and cache hits/misses per track

## Tasks

- [x] **T01: WaveformService — ffmpeg ProcessBuilder + peak extraction + JSON cache** `est:2h`
  Create WaveformService that runs ffmpeg via ProcessBuilder to extract raw PCM samples, downsamples to ~200 peaks (0.0-1.0), and caches as JSON in data/waveforms/{trackId}.json. Config: musicode.waveforms-dir (default ./data/waveforms), musicode.ffmpeg-path (default ffmpeg). Handles: cache hit (return cached), cache miss (generate + cache), ffmpeg not found (log warning, return empty). @Value-injected paths for testability.
  - Files: `musicode-server/src/main/java/com/musicode/service/WaveformService.java`, `musicode-server/src/main/resources/application.yml`
  - Verify: mvn test -pl musicode-server -Dtest=WaveformServiceTest

- [x] **T02: WaveformController + DTO + SecurityConfig wiring + Docker ffmpeg** `est:1h`
  Create WaveformController with GET /api/waveforms/{trackId} that returns WaveformResponse (peaks array). Wire into SecurityConfig (authenticated). Add ffmpeg to Dockerfile runtime stage. Create WaveformResponse DTO.
  - Files: `musicode-server/src/main/java/com/musicode/controller/WaveformController.java`, `musicode-server/src/main/java/com/musicode/model/dto/WaveformResponse.java`, `musicode-server/src/main/java/com/musicode/config/SecurityConfig.java`, `musicode-server/Dockerfile`
  - Verify: mvn test -pl musicode-server -Dtest=WaveformControllerTest

- [x] **T03: Integration test with real ffmpeg execution** `est:1h`
  Write integration test that runs ffmpeg against a small test audio file (generate a short WAV via code or include a tiny fixture). Verify the full pipeline: ffmpeg runs, peaks extracted, JSON cached, endpoint returns valid data. Skip gracefully if ffmpeg not on PATH (CI-friendly).
  - Files: `musicode-server/src/test/java/com/musicode/service/WaveformServiceIntegrationTest.java`
  - Verify: mvn test -pl musicode-server -Dtest=WaveformServiceIntegrationTest

## Files Likely Touched

- musicode-server/src/main/java/com/musicode/service/WaveformService.java
- musicode-server/src/main/resources/application.yml
- musicode-server/src/main/java/com/musicode/controller/WaveformController.java
- musicode-server/src/main/java/com/musicode/model/dto/WaveformResponse.java
- musicode-server/src/main/java/com/musicode/config/SecurityConfig.java
- musicode-server/Dockerfile
- musicode-server/src/test/java/com/musicode/service/WaveformServiceIntegrationTest.java
