package com.musicode.controller;

import com.musicode.service.AudioStreamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/stream")
@RequiredArgsConstructor
@Tag(name = "Streaming", description = "Audio file streaming with HTTP Range support")
public class StreamController {

    private final AudioStreamService audioStreamService;

    @GetMapping("/{trackId}")
    @Operation(summary = "Stream audio track", description = "Stream an audio file with HTTP Range support (206 Partial Content). Supports FLAC, MP3, OGG, M4A.")
    public void streamTrack(
            @PathVariable Long trackId,
            HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        audioStreamService.streamTrack(trackId, request, response);
    }
}
