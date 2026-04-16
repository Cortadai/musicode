---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T06: Remove JaCoCo exclusions and restore coverage gate

Drop LastfmService, ListenBrainzService, ScrobbleService from the JaCoCo <excludes> block in pom.xml. Keep LibraryScanService, MetadataService, CoverArtService, AudioStreamService excluded (I/O + file-system heavy, tested separately via integration). Run `mvn clean verify` and confirm the bundle line coverage ≥80% rule still passes. If any uncovered hotspot drops the bundle below threshold, add targeted tests to the prior service's test class — not by re-excluding.

## Inputs

- `musicode-server/pom.xml`
- `musicode-server/target/site/jacoco/index.html`

## Expected Output

- `pom.xml with only I/O-heavy services excluded. `mvn clean verify` exits 0. JaCoCo report shows LastfmService/ListenBrainzService/ScrobbleService with ≥80% line coverage each.`

## Verification

cd musicode-server && mvn clean verify
