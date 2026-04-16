---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: StatsService unit tests

Unit test StatsService: getSummary, topTracks, topAlbums, topArtists, playsOverTime. Mock PlaybackEventRepository. Cover empty-result branches and date-range aggregation.

## Inputs

- `musicode-server/src/main/java/com/musicode/service/StatsService.java`
- `musicode-server/src/main/java/com/musicode/repository/PlaybackEventRepository.java`

## Expected Output

- `StatsServiceTest.java with ≥6 tests, all green, ≥80% line coverage for StatsService`

## Verification

cd musicode-server && mvn -q -Dtest=StatsServiceTest test
