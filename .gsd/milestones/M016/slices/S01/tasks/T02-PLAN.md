---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T02: WaveformController + DTO + SecurityConfig wiring + Docker ffmpeg

Create WaveformController with GET /api/waveforms/{trackId} that returns WaveformResponse (peaks array). Wire into SecurityConfig (authenticated). Add ffmpeg to Dockerfile runtime stage. Create WaveformResponse DTO.

## Inputs

- `musicode-server/src/main/java/com/musicode/service/WaveformService.java`
- `musicode-server/src/main/java/com/musicode/config/SecurityConfig.java`

## Expected Output

- `musicode-server/src/main/java/com/musicode/controller/WaveformController.java`
- `musicode-server/src/main/java/com/musicode/model/dto/WaveformResponse.java`
- `musicode-server/src/test/java/com/musicode/controller/WaveformControllerTest.java`

## Verification

mvn test -pl musicode-server -Dtest=WaveformControllerTest
