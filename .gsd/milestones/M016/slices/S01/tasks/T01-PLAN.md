---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T01: WaveformService — ffmpeg ProcessBuilder + peak extraction + JSON cache

Create WaveformService that runs ffmpeg via ProcessBuilder to extract raw PCM samples, downsamples to ~200 peaks (0.0-1.0), and caches as JSON in data/waveforms/{trackId}.json. Config: musicode.waveforms-dir (default ./data/waveforms), musicode.ffmpeg-path (default ffmpeg). Handles: cache hit (return cached), cache miss (generate + cache), ffmpeg not found (log warning, return empty). @Value-injected paths for testability.

## Inputs

- `musicode-server/src/main/java/com/musicode/model/entity/Track.java`
- `musicode-server/src/main/resources/application.yml`

## Expected Output

- `musicode-server/src/main/java/com/musicode/service/WaveformService.java`
- `musicode-server/src/test/java/com/musicode/service/WaveformServiceTest.java`

## Verification

mvn test -pl musicode-server -Dtest=WaveformServiceTest
