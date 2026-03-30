package com.musicode.controller;

import com.musicode.service.AudioStreamService;
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
public class StreamController {

    private final AudioStreamService audioStreamService;

    @GetMapping("/{trackId}")
    public void streamTrack(
            @PathVariable Long trackId,
            HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        audioStreamService.streamTrack(trackId, request, response);
    }
}
