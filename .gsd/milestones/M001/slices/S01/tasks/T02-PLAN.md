---
estimated_steps: 7
estimated_files: 3
skills_used: []
---

# T02: MetadataService — Read FLAC tags with JAudioTagger

Create MetadataService that reads FLAC file metadata using JAudioTagger 3.x. Extract: title, artist, album, year, track number, disc number, duration, genre, bitrate, sample rate, bits per sample, and embedded cover art (as byte array).

Steps:
1. Add jaudiotagger dependency to pom.xml
2. Create MetadataService with a readMetadata(Path filePath) method
3. Return a structured DTO with all extracted fields
4. Handle edge cases: missing tags, missing cover art, corrupted files
5. Write a test with a real FLAC file

## Inputs

- `musicode-server/pom.xml`
- `musicode-server/src/main/java/com/musicode/model/entity/Track.java`

## Expected Output

- `musicode-server/src/main/java/com/musicode/service/MetadataService.java`
- `musicode-server/src/main/java/com/musicode/model/dto/TrackMetadata.java`
- `musicode-server/src/test/java/com/musicode/service/MetadataServiceTest.java`

## Verification

mvn test -pl musicode-server -Dtest=MetadataServiceTest — test passes reading metadata from a real FLAC file
