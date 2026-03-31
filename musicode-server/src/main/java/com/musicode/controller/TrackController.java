package com.musicode.controller;

import com.musicode.exception.ResourceNotFoundException;
import com.musicode.model.entity.Track;
import com.musicode.repository.TrackRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
@Tag(name = "Tracks", description = "Browse the track library")
public class TrackController {

    private final TrackRepository trackRepository;

    @GetMapping
    @Operation(summary = "List tracks", description = "Paginated track list sorted by track number.")
    public Page<Track> getAllTracks(
            @PageableDefault(size = 50, sort = "trackNumber", direction = Sort.Direction.ASC) Pageable pageable) {
        return trackRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get track detail", description = "Returns a single track by ID.")
    public Track getTrack(@PathVariable Long id) {
        return trackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Track", id));
    }
}
