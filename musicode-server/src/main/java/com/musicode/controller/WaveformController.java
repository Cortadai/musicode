package com.musicode.controller;

import com.musicode.model.dto.WaveformResponse;
import com.musicode.service.WaveformService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/waveforms")
@RequiredArgsConstructor
public class WaveformController {

    private final WaveformService waveformService;

    @GetMapping("/{trackId}")
    public ResponseEntity<WaveformResponse> getWaveform(@PathVariable Long trackId) {
        return waveformService.getWaveform(trackId)
                .map(peaks -> ResponseEntity.ok(WaveformResponse.builder()
                        .trackId(trackId)
                        .peaks(peaks)
                        .build()))
                .orElse(ResponseEntity.notFound().build());
    }
}
