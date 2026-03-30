package com.musicode.controller;

import com.musicode.model.dto.SearchResults;
import com.musicode.model.entity.Album;
import com.musicode.model.entity.Artist;
import com.musicode.model.entity.Track;
import com.musicode.repository.AlbumRepository;
import com.musicode.repository.ArtistRepository;
import com.musicode.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final TrackRepository trackRepository;
    private final AlbumRepository albumRepository;
    private final ArtistRepository artistRepository;

    @GetMapping
    public SearchResults search(@RequestParam(name = "q", defaultValue = "") String query) {
        if (query.isBlank()) {
            return SearchResults.builder()
                    .tracks(Collections.emptyList())
                    .albums(Collections.emptyList())
                    .artists(Collections.emptyList())
                    .build();
        }

        List<Track> tracks = trackRepository.findByTitleContainingIgnoreCase(query);
        List<Album> albums = albumRepository.findByTitleContainingIgnoreCase(query);
        List<Artist> artists = artistRepository.findByNameContainingIgnoreCase(query);

        return SearchResults.builder()
                .tracks(tracks)
                .albums(albums)
                .artists(artists)
                .build();
    }
}
