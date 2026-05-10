package com.musicode.controller;

import com.musicode.exception.ResourceNotFoundException;
import com.musicode.model.dto.ArtistBioDTO;
import com.musicode.model.entity.Artist;
import com.musicode.repository.ArtistRepository;
import com.musicode.service.LastfmService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/artists")
@RequiredArgsConstructor
@Tag(name = "Artists", description = "Browse the artist library")
public class ArtistController {

    private final ArtistRepository artistRepository;
    private final LastfmService lastfmService;

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

    @GetMapping("/{id}/bio")
    @Operation(summary = "Get artist biography", description = "Fetches artist bio from Last.fm. Returns empty fields if not found.")
    public ResponseEntity<ArtistBioDTO> getArtistBio(@PathVariable Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artist", id));

        ArtistBioDTO bio = lastfmService.getArtistInfo(artist.getName());

        CacheControl cache = bio.isEmpty()
                ? CacheControl.maxAge(1, TimeUnit.HOURS)
                : CacheControl.maxAge(7, TimeUnit.DAYS);

        return ResponseEntity.ok().cacheControl(cache).body(bio);
    }
}
