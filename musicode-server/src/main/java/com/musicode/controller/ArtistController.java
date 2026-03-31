package com.musicode.controller;

import com.musicode.exception.ResourceNotFoundException;
import com.musicode.model.entity.Artist;
import com.musicode.repository.ArtistRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/artists")
@RequiredArgsConstructor
@Tag(name = "Artists", description = "Browse the artist library")
public class ArtistController {

    private final ArtistRepository artistRepository;

    @GetMapping
    @Operation(summary = "List artists", description = "Paginated artist list sorted by name. Albums are not included — use the detail endpoint.")
    public Page<Artist> getAllArtists(
            @PageableDefault(size = 30, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        return artistRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get artist detail", description = "Returns artist with albums loaded via EntityGraph.")
    public Artist getArtist(@PathVariable Long id) {
        return artistRepository.findWithAlbumsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artist", id));
    }
}
