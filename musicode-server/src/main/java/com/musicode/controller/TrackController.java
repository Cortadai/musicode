package com.musicode.controller;

import com.musicode.exception.ResourceNotFoundException;
import com.musicode.model.entity.Track;
import com.musicode.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
public class TrackController {

    private final TrackRepository trackRepository;

    @GetMapping
    public Page<Track> getAllTracks(
            @PageableDefault(size = 50, sort = "trackNumber", direction = Sort.Direction.ASC) Pageable pageable) {
        return trackRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public Track getTrack(@PathVariable Long id) {
        return trackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Track", id));
    }
}
