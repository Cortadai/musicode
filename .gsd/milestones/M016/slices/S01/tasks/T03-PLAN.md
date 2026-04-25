---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T03: Integration test with real ffmpeg execution

Write integration test that runs ffmpeg against a small test audio file (generate a short WAV via code or include a tiny fixture). Verify the full pipeline: ffmpeg runs, peaks extracted, JSON cached, endpoint returns valid data. Skip gracefully if ffmpeg not on PATH (CI-friendly).

## Inputs

- `musicode-server/src/main/java/com/musicode/service/WaveformService.java`

## Expected Output

- `musicode-server/src/test/java/com/musicode/service/WaveformServiceIntegrationTest.java`

## Verification

mvn test -pl musicode-server -Dtest=WaveformServiceIntegrationTest
