package com.musicode.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicode.model.dto.AddTracksRequest;
import com.musicode.model.dto.CreatePlaylistRequest;
import com.musicode.model.dto.RemoveTracksRequest;
import com.musicode.model.dto.ReorderTracksRequest;
import com.musicode.model.dto.UpdatePlaylistRequest;
import com.musicode.model.entity.*;
import com.musicode.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.musicode.repository.RefreshTokenRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(username = "testuser", roles = "LISTENER")
class PlaylistControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private PlaylistRepository playlistRepository;
    @Autowired private PlaylistTrackRepository playlistTrackRepository;
    @Autowired private TrackRepository trackRepository;
    @Autowired private AlbumRepository albumRepository;
    @Autowired private ArtistRepository artistRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PlaybackEventRepository playbackEventRepository;
    @Autowired private FavoriteRepository favoriteRepository;
    @Autowired private RefreshTokenRepository refreshTokenRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private User testUser;
    private Track track1;
    private Track track2;
    private Track track3;

    @BeforeEach
    void setUp() {
        playlistTrackRepository.deleteAll();
        playlistRepository.deleteAll();
        favoriteRepository.deleteAll();
        playbackEventRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        trackRepository.deleteAll();
        albumRepository.deleteAll();
        artistRepository.deleteAll();
        userRepository.deleteAll();

        testUser = userRepository.save(User.builder()
                .username("testuser")
                .passwordHash(passwordEncoder.encode("pass"))
                .role(Role.LISTENER)
                .build());

        var artist = artistRepository.save(Artist.builder().name("Artist").build());
        var album = albumRepository.save(Album.builder()
                .title("Album")
                .year(2024)
                .artist(artist)
                .hasCoverArt(false)
                .build());

        track1 = trackRepository.save(Track.builder()
                .title("Track One").trackNumber(1).duration(200)
                .filePath("/music/t1.flac").fileSize(1000L)
                .album(album).artist(artist).build());
        track2 = trackRepository.save(Track.builder()
                .title("Track Two").trackNumber(2).duration(180)
                .filePath("/music/t2.flac").fileSize(1000L)
                .album(album).artist(artist).build());
        track3 = trackRepository.save(Track.builder()
                .title("Track Three").trackNumber(3).duration(220)
                .filePath("/music/t3.flac").fileSize(1000L)
                .album(album).artist(artist).build());
    }

    @Test
    void createPlaylist_returnsCreated() throws Exception {
        mockMvc.perform(post("/api/playlists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreatePlaylistRequest("My Playlist"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("My Playlist"))
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.trackCount").value(0));
    }

    @Test
    void createPlaylist_blankName_returns400() throws Exception {
        mockMvc.perform(post("/api/playlists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreatePlaylistRequest("  "))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void listPlaylists_returnsUserPlaylists() throws Exception {
        mockMvc.perform(post("/api/playlists")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new CreatePlaylistRequest("First"))));
        mockMvc.perform(post("/api/playlists")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new CreatePlaylistRequest("Second"))));

        mockMvc.perform(get("/api/playlists"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name").exists());
    }

    @Test
    void getPlaylist_returnsDetailWithTracks() throws Exception {
        var result = mockMvc.perform(post("/api/playlists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreatePlaylistRequest("Detail"))))
                .andReturn();
        var id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(post("/api/playlists/" + id + "/tracks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new AddTracksRequest(List.of(track1.getId(), track2.getId())))));

        mockMvc.perform(get("/api/playlists/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Detail"))
                .andExpect(jsonPath("$.trackCount").value(2))
                .andExpect(jsonPath("$.tracks", hasSize(2)))
                .andExpect(jsonPath("$.tracks[0].title").value("Track One"))
                .andExpect(jsonPath("$.tracks[1].title").value("Track Two"));
    }

    @Test
    void renamePlaylist_updatesName() throws Exception {
        var result = mockMvc.perform(post("/api/playlists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreatePlaylistRequest("Old Name"))))
                .andReturn();
        var id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(put("/api/playlists/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdatePlaylistRequest("New Name"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Name"));
    }

    @Test
    void deletePlaylist_returns204() throws Exception {
        var result = mockMvc.perform(post("/api/playlists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreatePlaylistRequest("To Delete"))))
                .andReturn();
        var id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(delete("/api/playlists/" + id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/playlists/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    void addTracks_skipsDuplicates() throws Exception {
        var result = mockMvc.perform(post("/api/playlists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreatePlaylistRequest("Dupes"))))
                .andReturn();
        var id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(post("/api/playlists/" + id + "/tracks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AddTracksRequest(List.of(track1.getId())))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.added").value(1));

        mockMvc.perform(post("/api/playlists/" + id + "/tracks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AddTracksRequest(List.of(track1.getId(), track2.getId())))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.added").value(1));
    }

    @Test
    void removeTracks_removesAndReindexes() throws Exception {
        var result = mockMvc.perform(post("/api/playlists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreatePlaylistRequest("Remove"))))
                .andReturn();
        var id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(post("/api/playlists/" + id + "/tracks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new AddTracksRequest(List.of(track1.getId(), track2.getId(), track3.getId())))));

        mockMvc.perform(delete("/api/playlists/" + id + "/tracks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new RemoveTracksRequest(List.of(track2.getId())))))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/playlists/" + id + "/tracks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title").value("Track One"))
                .andExpect(jsonPath("$[0].position").value(1))
                .andExpect(jsonPath("$[1].title").value("Track Three"))
                .andExpect(jsonPath("$[1].position").value(2));
    }

    @Test
    void reorderTracks_changesPositions() throws Exception {
        var result = mockMvc.perform(post("/api/playlists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreatePlaylistRequest("Reorder"))))
                .andReturn();
        var id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(post("/api/playlists/" + id + "/tracks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new AddTracksRequest(List.of(track1.getId(), track2.getId(), track3.getId())))));

        mockMvc.perform(put("/api/playlists/" + id + "/tracks/reorder")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ReorderTracksRequest(
                                List.of(track3.getId(), track1.getId(), track2.getId())))))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/playlists/" + id + "/tracks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Track Three"))
                .andExpect(jsonPath("$[1].title").value("Track One"))
                .andExpect(jsonPath("$[2].title").value("Track Two"));
    }

    @Test
    void getPlaylist_otherUser_returns404() throws Exception {
        var otherUser = userRepository.save(User.builder()
                .username("other")
                .passwordHash(passwordEncoder.encode("pass"))
                .role(Role.LISTENER)
                .build());
        var playlist = playlistRepository.save(Playlist.builder()
                .user(otherUser)
                .name("Secret")
                .build());

        mockMvc.perform(get("/api/playlists/" + playlist.getId()))
                .andExpect(status().isNotFound());
    }
}
