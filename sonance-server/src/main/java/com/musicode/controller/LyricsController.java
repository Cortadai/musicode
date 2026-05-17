package com.musicode.controller;

import com.musicode.model.dto.LyricsResponse;
import com.musicode.service.LyricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/lyrics")
@RequiredArgsConstructor
public class LyricsController {

    private final LyricsService lyricsService;

    @GetMapping("/{trackId}")
    public ResponseEntity<LyricsResponse> getLyrics(@PathVariable Long trackId) {
        return ResponseEntity.ok(lyricsService.getLyrics(trackId));
    }

    @PostMapping("/{trackId}/retry")
    public ResponseEntity<LyricsResponse> retryLyrics(@PathVariable Long trackId) {
        return ResponseEntity.ok(lyricsService.retryLyrics(trackId));
    }

    @PutMapping("/{trackId}/offset")
    public ResponseEntity<Void> updateOffset(@PathVariable Long trackId, @RequestBody Map<String, Integer> body) {
        int offsetMs = body.getOrDefault("offsetMs", 0);
        lyricsService.updateOffset(trackId, offsetMs);
        return ResponseEntity.ok().build();
    }
}
