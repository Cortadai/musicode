package com.musicode.controller;

import com.musicode.exception.ResourceNotFoundException;
import com.musicode.model.entity.Artist;
import com.musicode.repository.ArtistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/artists")
@RequiredArgsConstructor
public class ArtistController {

    private final ArtistRepository artistRepository;

    @GetMapping
    public Page<Artist> getAllArtists(
            @PageableDefault(size = 30, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        return artistRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public Artist getArtist(@PathVariable Long id) {
        return artistRepository.findWithAlbumsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artist", id));
    }
}
