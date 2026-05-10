package com.musicode.controller;

import com.musicode.exception.ResourceNotFoundException;
import com.musicode.model.entity.Favorite;
import com.musicode.repository.FavoriteRepository;
import com.musicode.repository.TrackRepository;
import com.musicode.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Tag(name = "Favorites", description = "Toggle and list favorite tracks")
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;
    private final TrackRepository trackRepository;
    private final UserRepository userRepository;

    @PutMapping("/{trackId}")
    @Transactional
    @Operation(summary = "Toggle favorite", description = "Add or remove a track from the user's favorites")
    public Map<String, Object> toggle(@PathVariable Long trackId, Principal principal) {
        var user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getName()));
        var existing = favoriteRepository.findByUserAndTrackId(user, trackId);

        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            return Map.of("trackId", trackId, "favorited", false);
        }

        var track = trackRepository.findById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("Track", trackId));

        favoriteRepository.save(Favorite.builder().user(user).track(track).build());
        return Map.of("trackId", trackId, "favorited", true);
    }

    @GetMapping
    @Operation(summary = "List favorites", description = "Paginated list of the user's favorite tracks, newest first")
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            Principal principal) {
        var user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getName()));

        var favorites = favoriteRepository.findByUserOrderByCreatedAtDesc(user, PageRequest.of(page, size));

        var tracks = favorites.getContent().stream()
                .map(f -> {
                    var t = f.getTrack();
                    var m = new LinkedHashMap<String, Object>();
                    m.put("id", t.getId());
                    m.put("title", t.getTitle());
                    m.put("duration", t.getDuration());
                    m.put("trackNumber", t.getTrackNumber());
                    m.put("filePath", t.getFilePath());
                    m.put("bitRate", t.getBitRate());
                    m.put("sampleRate", t.getSampleRate());
                    m.put("bitsPerSample", t.getBitsPerSample());
                    if (t.getAlbum() != null) {
                        m.put("album", Map.of(
                                "id", t.getAlbum().getId(),
                                "title", t.getAlbum().getTitle()));
                    }
                    if (t.getArtist() != null) {
                        m.put("artist", Map.of(
                                "id", t.getArtist().getId(),
                                "name", t.getArtist().getName()));
                    }
                    m.put("favoritedAt", f.getCreatedAt().toString());
                    return m;
                })
                .toList();

        return ResponseEntity.ok(Map.of(
                "content", tracks,
                "totalElements", favorites.getTotalElements(),
                "totalPages", favorites.getTotalPages(),
                "page", page));
    }

    @GetMapping("/ids")
    @Operation(summary = "Favorite IDs", description = "Set of all track IDs the user has favorited")
    public Set<Long> ids(Principal principal) {
        var user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getName()));
        return favoriteRepository.findTrackIdsByUser(user);
    }

    @GetMapping("/count")
    @Operation(summary = "Favorites count")
    public Map<String, Long> count(Principal principal) {
        var user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getName()));
        return Map.of("count", favoriteRepository.countByUser(user));
    }
}
