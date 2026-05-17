package com.musicode.controller;

import com.musicode.exception.ResourceNotFoundException;
import com.musicode.model.entity.Album;
import com.musicode.repository.AlbumRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/albums")
@RequiredArgsConstructor
@Tag(name = "Albums", description = "Browse the album library")
public class AlbumController {

    private final AlbumRepository albumRepository;

    @GetMapping
    @Operation(summary = "List albums", description = "Paginated album list sorted by title. Tracks are not included — use the detail endpoint.")
    public Page<Album> getAllAlbums(
            @PageableDefault(size = 30, sort = "title", direction = Sort.Direction.ASC) Pageable pageable) {
        return albumRepository.findVisibleAlbums(pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get album detail", description = "Returns album with its track list loaded via EntityGraph.")
    public Album getAlbum(@PathVariable Long id) {
        return albumRepository.findWithTracksById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Album", id));
    }
}
