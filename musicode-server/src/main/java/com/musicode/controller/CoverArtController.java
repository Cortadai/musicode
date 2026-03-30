package com.musicode.controller;

import com.musicode.service.CoverArtService;
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
public class CoverArtController {

    private final CoverArtService coverArtService;

    @GetMapping("/{albumId}")
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
