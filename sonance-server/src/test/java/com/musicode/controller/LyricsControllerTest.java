package com.musicode.controller;

import com.musicode.model.entity.*;
import com.musicode.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LyricsControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private TrackRepository trackRepository;
    @Autowired private ArtistRepository artistRepository;
    @Autowired private AlbumRepository albumRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PlaybackEventRepository playbackEventRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private Long testTrackId;

    @BeforeEach
    void setUp() {
        playbackEventRepository.deleteAll();

        if (userRepository.findByUsername("testuser").isEmpty()) {
            userRepository.save(User.builder()
                    .username("testuser")
                    .passwordHash(passwordEncoder.encode("pass"))
                    .role(Role.LISTENER)
                    .build());
        }

        if (trackRepository.count() == 0) {
            var artist = artistRepository.save(Artist.builder().name("Test Artist").build());
            var album = albumRepository.save(Album.builder().title("Test Album").artist(artist).build());
            var track = trackRepository.save(Track.builder()
                    .title("Test Track")
                    .filePath("/test/lyrics-track.flac")
                    .artist(artist)
                    .album(album)
                    .duration(240)
                    .build());
            testTrackId = track.getId();
        } else {
            testTrackId = trackRepository.findAll().get(0).getId();
        }
    }

    @Test
    @WithMockUser(username = "testuser")
    void getLyrics_returnsLyricsResponse() throws Exception {
        mockMvc.perform(get("/api/lyrics/" + testTrackId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.trackId").value(testTrackId))
                .andExpect(jsonPath("$.status").isString());
    }

    @Test
    @WithMockUser(username = "testuser")
    void getLyrics_invalidTrack_returns404() throws Exception {
        mockMvc.perform(get("/api/lyrics/999999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getLyrics_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/lyrics/" + testTrackId))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "testuser")
    void retryLyrics_returnsLyricsResponse() throws Exception {
        mockMvc.perform(post("/api/lyrics/" + testTrackId + "/retry"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.trackId").value(testTrackId))
                .andExpect(jsonPath("$.status").isString());
    }

    @Test
    void retryLyrics_unauthenticated_returns401() throws Exception {
        mockMvc.perform(post("/api/lyrics/" + testTrackId + "/retry"))
                .andExpect(status().isUnauthorized());
    }
}
