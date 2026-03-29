package com.musicode.controller;

import com.musicode.model.entity.Track;
import com.musicode.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
public class TrackController {

    private final TrackRepository trackRepository;

    @GetMapping
    public List<Track> getAllTracks() {
        return trackRepository.findAll();
    }
}
