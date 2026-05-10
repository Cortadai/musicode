package com.musicode.service;

import com.musicode.model.dto.TrackMetadata;
import org.junit.jupiter.api.Test;

import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.*;

class MetadataServiceTest {

    private final MetadataService metadataService = new MetadataService();

    // Test fixtures in src/test/resources/testdata/ — synthetic audio generated with ffmpeg
    private static final Path TEST_FLAC = Paths.get("src/test/resources/testdata/test-track.flac");
    private static final Path TEST_MP3 = Paths.get("src/test/resources/testdata/test-track.mp3");

    @Test
    void shouldReadMetadataFromFlac() {
        assertTrue(TEST_FLAC.toFile().exists(), "Test FLAC must exist: " + TEST_FLAC);

        TrackMetadata metadata = metadataService.readMetadata(TEST_FLAC);

        assertNotNull(metadata);
        assertEquals("Test Track One", metadata.getTitle());
        assertEquals("Test Artist", metadata.getArtist());
        assertEquals("Test Album", metadata.getAlbum());
        assertEquals(2025, metadata.getYear());
        assertEquals(1, metadata.getTrackNumber());
        assertEquals("Electronic", metadata.getGenre());
        assertTrue(metadata.getDurationSeconds() > 0);
        assertTrue(metadata.getFileSize() > 0);
        assertEquals(44100, metadata.getSampleRate());
        assertNotNull(metadata.getFilePath());
    }

    @Test
    void shouldReadMetadataFromMp3() {
        assertTrue(TEST_MP3.toFile().exists(), "Test MP3 must exist: " + TEST_MP3);

        TrackMetadata metadata = metadataService.readMetadata(TEST_MP3);

        assertNotNull(metadata);
        assertEquals("Test MP3 Track", metadata.getTitle());
        assertEquals("Test MP3 Artist", metadata.getArtist());
        assertEquals("Test MP3 Album", metadata.getAlbum());
        assertTrue(metadata.getDurationSeconds() > 0);
        assertTrue(metadata.getFileSize() > 0);
    }

    @Test
    void shouldReturnNullForNonexistentFile() {
        TrackMetadata metadata = metadataService.readMetadata(Paths.get("nonexistent.flac"));
        assertNull(metadata);
    }

    @Test
    void shouldNeverReturnNullTitle() {
        TrackMetadata metadata = metadataService.readMetadata(TEST_FLAC);
        assertNotNull(metadata);
        assertNotNull(metadata.getTitle());
        assertFalse(metadata.getTitle().isBlank());
    }
}
