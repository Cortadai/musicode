# S01: Backend — ffmpeg peak extraction + cache + endpoint — UAT

**Milestone:** M016
**Written:** 2026-04-25T16:55:16.950Z

## UAT: S01 — Backend waveform endpoint\n\n### Test 1: Waveform generation for new track\n- Play a track that has never been played before\n- GET /api/waveforms/{trackId} should return 200 with peaks array (~200 values)\n- Subsequent requests for same track should be faster (cached)\n\n### Test 2: Missing audio file\n- Request waveform for a track with missing file\n- Should return empty peaks array, not 500\n\n### Test 3: Concurrent requests\n- Request same track waveform from two tabs simultaneously\n- Both should succeed without corruption
