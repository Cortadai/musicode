package com.musicode.service;

import com.musicode.model.dto.TrackMetadata;
import org.junit.jupiter.api.Test;

import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.*;

class MetadataServiceTest {

    private final MetadataService metadataService = new MetadataService();

    // Path to a real FLAC file for testing
    private static final Path TEST_FLAC = Paths.get(
            "C:/Users/david/Music/After The Neon Fades - Echo Synth",
            "01 - Echo Synth - Rolling Through the Dark (Night Drive Synthwave).flac"
    );

    @Test
    void shouldReadMetadataFromRealFlac() {
        assertTrue(TEST_FLAC.toFile().exists(), "Test FLAC file must exist: " + TEST_FLAC);

        TrackMetadata metadata = metadataService.readMetadata(TEST_FLAC);

        assertNotNull(metadata, "Metadata should not be null");
        assertNotNull(metadata.getTitle(), "Title should be present");
        assertNotNull(metadata.getArtist(), "Artist should be present");
        assertNotNull(metadata.getFilePath(), "File path should be present");
        assertTrue(metadata.getDurationSeconds() > 0, "Duration should be positive");
        assertTrue(metadata.getFileSize() > 0, "File size should be positive");

        System.out.println("=== Metadata ===");
        System.out.println("Title:      " + metadata.getTitle());
        System.out.println("Artist:     " + metadata.getArtist());
        System.out.println("Album:      " + metadata.getAlbum());
        System.out.println("Year:       " + metadata.getYear());
        System.out.println("Track #:    " + metadata.getTrackNumber());
        System.out.println("Disc #:     " + metadata.getDiscNumber());
        System.out.println("Duration:   " + metadata.getDurationSeconds() + "s");
        System.out.println("Genre:      " + metadata.getGenre());
        System.out.println("Bitrate:    " + metadata.getBitRate() + " kbps");
        System.out.println("Sample:     " + metadata.getSampleRate() + " Hz");
        System.out.println("Bits/samp:  " + metadata.getBitsPerSample());
        System.out.println("File size:  " + metadata.getFileSize() + " bytes");
        System.out.println("Cover art:  " + (metadata.getCoverArt() != null ? metadata.getCoverArt().length + " bytes" : "none"));
        System.out.println("Cover MIME: " + metadata.getCoverArtMimeType());
    }

    @Test
    void shouldReturnNullForNonexistentFile() {
        TrackMetadata metadata = metadataService.readMetadata(Paths.get("nonexistent.flac"));
        assertNull(metadata, "Should return null for nonexistent file");
    }

    @Test
    void shouldHandleMissingTitleGracefully() {
        // Even if tags are missing, the filename should be used as fallback
        TrackMetadata metadata = metadataService.readMetadata(TEST_FLAC);
        assertNotNull(metadata);
        assertNotNull(metadata.getTitle(), "Title should never be null (filename fallback)");
        assertFalse(metadata.getTitle().isBlank(), "Title should not be blank");
    }
}
