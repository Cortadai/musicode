package com.musicode.controller;

import com.musicode.model.dto.SearchResults;
import com.musicode.model.entity.Album;
import com.musicode.model.entity.Artist;
import com.musicode.model.entity.Track;
import com.musicode.repository.AlbumRepository;
import com.musicode.repository.ArtistRepository;
import com.musicode.repository.TrackRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Tag(name = "Search", description = "Combined search across tracks, albums, and artists")
public class SearchController {

    private final TrackRepository trackRepository;
    private final AlbumRepository albumRepository;
    private final ArtistRepository artistRepository;

    @GetMapping
    @Operation(summary = "Search library", description = "Case-insensitive search across track titles, album titles, and artist names. Returns all matches (not paginated).")
    public SearchResults search(
            @Parameter(description = "Search query", example = "midnight")
            @RequestParam(name = "q", defaultValue = "") String query) {
        if (query.isBlank()) {
            return new SearchResults(List.of(), List.of(), List.of());
        }

        List<Track> tracks = trackRepository.findByTitleContainingIgnoreCase(query);
        List<Album> albums = albumRepository.findByTitleContainingIgnoreCase(query);
        List<Artist> artists = artistRepository.findByNameContainingIgnoreCase(query);

        return new SearchResults(tracks, albums, artists);
    }
}
