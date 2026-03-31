package com.musicode.controller;

import com.musicode.exception.ResourceNotFoundException;
import com.musicode.model.entity.Album;
import com.musicode.repository.AlbumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/albums")
@RequiredArgsConstructor
public class AlbumController {

    private final AlbumRepository albumRepository;

    @GetMapping
    public Page<Album> getAllAlbums(
            @PageableDefault(size = 30, sort = "title", direction = Sort.Direction.ASC) Pageable pageable) {
        return albumRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public Album getAlbum(@PathVariable Long id) {
        return albumRepository.findWithTracksById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Album", id));
    }
}
