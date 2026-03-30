---
estimated_steps: 7
estimated_files: 3
skills_used: []
---

# T01: Multi-format scanner + cover art path normalization

Extend the scanner file filter from FLAC-only to all supported formats. Normalize cover art paths to use the covers directory consistently. Fix the ScanStatus DTO to report the status fields the frontend expects.

Steps:
1. Change isFlacFile to isAudioFile — accept .flac, .mp3, .ogg, .m4a, .wav
2. Rename countFlacFiles to countAudioFiles
3. Normalize cover art path in CoverArtService — always store relative path pattern
4. Update ScanStatus DTO to match frontend interface (scanning boolean, filesFound, etc)
5. Test with running server

## Inputs

- `musicode-server/src/main/java/com/musicode/service/MetadataService.java`

## Expected Output

- `musicode-server/src/main/java/com/musicode/service/LibraryScanService.java`
- `musicode-server/src/main/java/com/musicode/service/CoverArtService.java`
- `musicode-server/src/main/java/com/musicode/model/dto/ScanStatus.java`

## Verification

Start server, scan folder with FLACs, verify scan completes and tracks have normalized cover art paths. API returns correct data.
