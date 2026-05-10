package com.musicode.controller;

import com.musicode.service.CoverArtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/covers")
@RequiredArgsConstructor
@Tag(name = "Cover Art", description = "Album cover art images")
public class CoverArtController {

    private final CoverArtService coverArtService;

    @GetMapping("/{albumId}")
    @Operation(summary = "Get album cover art", description = "Returns the cover art JPEG for an album. Cached for 7 days. Returns 404 if no cover art exists.")
    public ResponseEntity<Resource> getCoverArt(@PathVariable Long albumId) {
        Path coverPath = coverArtService.getCoverArtPath(albumId);
        if (coverPath == null) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(coverPath);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic())
                .body(resource);
    }
}
