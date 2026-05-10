package com.musicode.controller;

import com.musicode.model.dto.AddTracksRequest;
import com.musicode.model.dto.CreatePlaylistRequest;
import com.musicode.model.dto.RemoveTracksRequest;
import com.musicode.model.dto.ReorderTracksRequest;
import com.musicode.model.dto.UpdatePlaylistRequest;
import com.musicode.model.entity.Playlist;
import com.musicode.model.entity.PlaylistTrack;
import com.musicode.repository.PlaylistTrackRepository;
import com.musicode.service.PlaylistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
@Tag(name = "Playlists", description = "Playlist CRUD and track management")
public class PlaylistController {

    private final PlaylistService playlistService;
    private final PlaylistTrackRepository playlistTrackRepository;

    @GetMapping
    @Operation(summary = "List playlists", description = "All playlists for the authenticated user, newest updated first")
    public List<Map<String, Object>> list(Principal principal) {
        var user = playlistService.resolveUser(principal.getName());
        return playlistService.listPlaylists(user).stream()
                .map(this::toSummary)
                .toList();
    }

    @PostMapping
    @Operation(summary = "Create playlist")
    public ResponseEntity<Map<String, Object>> create(
            @Valid @RequestBody CreatePlaylistRequest request,
            Principal principal) {
        var user = playlistService.resolveUser(principal.getName());
        var playlist = playlistService.createPlaylist(user, request.name());
        return ResponseEntity.status(HttpStatus.CREATED).body(toSummary(playlist));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get playlist detail", description = "Playlist metadata with full track list")
    public Map<String, Object> get(@PathVariable Long id, Principal principal) {
        var user = playlistService.resolveUser(principal.getName());
        var playlist = playlistService.getPlaylist(id, user);
        var tracks = playlistService.getPlaylistTracks(id, user);
        return toDetail(playlist, tracks);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Rename playlist")
    public Map<String, Object> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePlaylistRequest request,
            Principal principal) {
        var user = playlistService.resolveUser(principal.getName());
        var playlist = playlistService.renamePlaylist(id, user, request.name());
        return toSummary(playlist);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete playlist")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Principal principal) {
        var user = playlistService.resolveUser(principal.getName());
        playlistService.deletePlaylist(id, user);
    }

    @GetMapping("/{id}/tracks")
    @Operation(summary = "List playlist tracks", description = "Ordered track list for a playlist")
    public List<Map<String, Object>> listTracks(@PathVariable Long id, Principal principal) {
        var user = playlistService.resolveUser(principal.getName());
        var tracks = playlistService.getPlaylistTracks(id, user);
        return tracks.stream().map(this::toTrackEntry).toList();
    }

    @PostMapping("/{id}/tracks")
    @Operation(summary = "Add tracks to playlist")
    public ResponseEntity<Map<String, Object>> addTracks(
            @PathVariable Long id,
            @Valid @RequestBody AddTracksRequest request,
            Principal principal) {
        var user = playlistService.resolveUser(principal.getName());
        var added = playlistService.addTracks(id, user, request.trackIds());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("added", added.size()));
    }

    @DeleteMapping("/{id}/tracks")
    @Operation(summary = "Remove tracks from playlist")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeTracks(
            @PathVariable Long id,
            @Valid @RequestBody RemoveTracksRequest request,
            Principal principal) {
        var user = playlistService.resolveUser(principal.getName());
        playlistService.removeTracks(id, user, request.trackIds());
    }

    @PutMapping("/{id}/tracks/reorder")
    @Operation(summary = "Reorder tracks", description = "Set full track order — trackIds must include all tracks in playlist")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reorderTracks(
            @PathVariable Long id,
            @Valid @RequestBody ReorderTracksRequest request,
            Principal principal) {
        var user = playlistService.resolveUser(principal.getName());
        playlistService.reorderTracks(id, user, request.trackIds());
    }

    private Map<String, Object> toSummary(Playlist p) {
        var m = new LinkedHashMap<String, Object>();
        m.put("id", p.getId());
        m.put("name", p.getName());
        m.put("trackCount", playlistTrackRepository.countByPlaylistId(p.getId()));
        m.put("createdAt", p.getCreatedAt().toString());
        m.put("updatedAt", p.getUpdatedAt().toString());
        return m;
    }

    private Map<String, Object> toDetail(Playlist p, List<PlaylistTrack> tracks) {
        var m = new LinkedHashMap<String, Object>();
        m.put("id", p.getId());
        m.put("name", p.getName());
        m.put("trackCount", tracks.size());
        m.put("createdAt", p.getCreatedAt().toString());
        m.put("updatedAt", p.getUpdatedAt().toString());
        m.put("tracks", tracks.stream().map(this::toTrackEntry).toList());
        return m;
    }

    private Map<String, Object> toTrackEntry(PlaylistTrack pt) {
        var t = pt.getTrack();
        var m = new LinkedHashMap<String, Object>();
        m.put("id", t.getId());
        m.put("title", t.getTitle());
        m.put("duration", t.getDuration());
        m.put("trackNumber", t.getTrackNumber());
        m.put("filePath", t.getFilePath());
        if (t.getAlbum() != null) {
            m.put("album", Map.of("id", t.getAlbum().getId(), "title", t.getAlbum().getTitle()));
        }
        if (t.getArtist() != null) {
            m.put("artist", Map.of("id", t.getArtist().getId(), "name", t.getArtist().getName()));
        }
        m.put("position", pt.getPosition());
        m.put("addedAt", pt.getAddedAt().toString());
        return m;
    }
}
