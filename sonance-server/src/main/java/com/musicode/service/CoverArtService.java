package com.musicode.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Service
public class CoverArtService {

    private final Path coversDir;

    public CoverArtService(@Value("${sonance.covers-dir:./data/covers}") String coversDir) {
        this.coversDir = Paths.get(coversDir);
        try {
            Files.createDirectories(this.coversDir);
        } catch (IOException e) {
            log.error("Failed to create covers directory: {}", coversDir, e);
        }
    }

    /**
     * Save cover art bytes to disk as {albumId}.jpg.
     * Returns the relative path, or null if nothing was saved.
     */
    public String saveCoverArt(Long albumId, byte[] imageData) {
        if (imageData == null || imageData.length == 0 || albumId == null) {
            return null;
        }

        Path coverFile = coversDir.resolve(albumId + ".jpg");

        try {
            Files.write(coverFile, imageData);
            log.debug("Saved cover art for album {}: {} bytes", albumId, imageData.length);
            return albumId + ".jpg";
        } catch (IOException e) {
            log.error("Failed to save cover art for album {}: {}", albumId, e.getMessage());
            return null;
        }
    }

    /**
     * Get the cover art file path for an album, or null if not found.
     */
    public Path getCoverArtPath(Long albumId) {
        Path coverFile = coversDir.resolve(albumId + ".jpg");
        return Files.exists(coverFile) ? coverFile : null;
    }

    public boolean deleteCoverArt(Long albumId) {
        Path coverFile = coversDir.resolve(albumId + ".jpg");
        try {
            return Files.deleteIfExists(coverFile);
        } catch (IOException e) {
            log.error("Failed to delete cover art for album {}: {}", albumId, e.getMessage());
            return false;
        }
    }

    public int deleteAllCovers() {
        int deleted = 0;
        try (var stream = Files.list(coversDir)) {
            for (Path file : stream.toList()) {
                if (file.toString().endsWith(".jpg")) {
                    Files.deleteIfExists(file);
                    deleted++;
                }
            }
        } catch (IOException e) {
            log.error("Failed to clean covers directory: {}", e.getMessage());
        }
        return deleted;
    }
}
