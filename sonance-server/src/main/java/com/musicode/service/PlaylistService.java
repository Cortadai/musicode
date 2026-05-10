package com.musicode.service;

import com.musicode.exception.BadRequestException;
import com.musicode.exception.ResourceNotFoundException;
import com.musicode.model.entity.Playlist;
import com.musicode.model.entity.PlaylistTrack;
import com.musicode.model.entity.User;
import com.musicode.repository.PlaylistRepository;
import com.musicode.repository.PlaylistTrackRepository;
import com.musicode.repository.TrackRepository;
import com.musicode.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final PlaylistTrackRepository playlistTrackRepository;
    private final TrackRepository trackRepository;
    private final UserRepository userRepository;

    public User resolveUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", username));
    }

    public List<Playlist> listPlaylists(User user) {
        return playlistRepository.findByUserOrderByUpdatedAtDesc(user);
    }

    @Transactional
    public Playlist createPlaylist(User user, String name) {
        var playlist = Playlist.builder()
                .user(user)
                .name(name.trim())
                .build();
        return playlistRepository.save(playlist);
    }

    public Playlist getPlaylist(Long id, User user) {
        return playlistRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist", id));
    }

    @Transactional
    public Playlist renamePlaylist(Long id, User user, String name) {
        var playlist = getPlaylist(id, user);
        playlist.setName(name.trim());
        playlist.setUpdatedAt(Instant.now());
        return playlistRepository.save(playlist);
    }

    @Transactional
    public void deletePlaylist(Long id, User user) {
        var playlist = getPlaylist(id, user);
        playlistRepository.delete(playlist);
    }

    public List<PlaylistTrack> getPlaylistTracks(Long playlistId, User user) {
        getPlaylist(playlistId, user);
        return playlistTrackRepository.findByPlaylistIdOrderByPositionAsc(playlistId);
    }

    @Transactional
    public List<PlaylistTrack> addTracks(Long playlistId, User user, List<Long> trackIds) {
        var playlist = getPlaylist(playlistId, user);
        int maxPos = playlistTrackRepository.findMaxPositionByPlaylistId(playlistId);

        var newTracks = new java.util.ArrayList<PlaylistTrack>();
        for (Long trackId : trackIds) {
            if (playlistTrackRepository.existsByPlaylistIdAndTrackId(playlistId, trackId)) {
                continue;
            }
            var track = trackRepository.findById(trackId)
                    .orElseThrow(() -> new ResourceNotFoundException("Track", trackId));
            maxPos++;
            var pt = PlaylistTrack.builder()
                    .playlist(playlist)
                    .track(track)
                    .position(maxPos)
                    .build();
            newTracks.add(playlistTrackRepository.save(pt));
        }

        playlist.setUpdatedAt(Instant.now());
        playlistRepository.save(playlist);
        return newTracks;
    }

    @Transactional
    public void removeTracks(Long playlistId, User user, List<Long> trackIds) {
        var playlist = getPlaylist(playlistId, user);
        playlistTrackRepository.deleteByPlaylistIdAndTrackIdIn(playlistId, trackIds);

        var remaining = playlistTrackRepository.findByPlaylistIdOrderByPositionAsc(playlistId);
        for (int i = 0; i < remaining.size(); i++) {
            remaining.get(i).setPosition(i + 1);
        }
        playlistTrackRepository.saveAll(remaining);

        playlist.setUpdatedAt(Instant.now());
        playlistRepository.save(playlist);
    }

    @Transactional
    public void reorderTracks(Long playlistId, User user, List<Long> orderedTrackIds) {
        var playlist = getPlaylist(playlistId, user);
        var existing = playlistTrackRepository.findByPlaylistIdOrderByPositionAsc(playlistId);

        if (orderedTrackIds.size() != existing.size()) {
            throw new BadRequestException("Track list size mismatch — must include all tracks in the playlist");
        }

        var byTrackId = new java.util.HashMap<Long, PlaylistTrack>();
        for (var pt : existing) {
            byTrackId.put(pt.getTrack().getId(), pt);
        }

        for (int i = 0; i < orderedTrackIds.size(); i++) {
            var pt = byTrackId.get(orderedTrackIds.get(i));
            if (pt == null) {
                throw new BadRequestException("Track " + orderedTrackIds.get(i) + " is not in this playlist");
            }
            pt.setPosition(i + 1);
        }
        playlistTrackRepository.saveAll(existing);

        playlist.setUpdatedAt(Instant.now());
        playlistRepository.save(playlist);
    }
}
