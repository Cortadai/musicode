package com.musicode.controller;

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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PlayControllerTest {

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

        // Ensure test user exists
        if (userRepository.findByUsername("testuser").isEmpty()) {
            userRepository.save(User.builder()
                    .username("testuser")
                    .passwordHash(passwordEncoder.encode("pass"))
                    .role(Role.LISTENER)
                    .build());
        }

        // Ensure a track exists
        if (trackRepository.count() == 0) {
            var artist = artistRepository.save(Artist.builder().name("Test Artist").build());
            var album = albumRepository.save(Album.builder().title("Test Album").artist(artist).build());
            var track = trackRepository.save(Track.builder()
                    .title("Test Track")
                    .filePath("/test/track.flac")
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
    void recordPlay_returnsCreated() throws Exception {
        mockMvc.perform(post("/api/plays/" + testTrackId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"listenDurationSec\": 120}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.trackId").value(testTrackId))
                .andExpect(jsonPath("$.playedAt").isNotEmpty());
    }

    @Test
    @WithMockUser(username = "testuser")
    void recordPlay_withoutBody_returnsCreated() throws Exception {
        mockMvc.perform(post("/api/plays/" + testTrackId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.trackId").value(testTrackId));
    }

    @Test
    @WithMockUser(username = "testuser")
    void recordPlay_invalidTrack_returns404() throws Exception {
        mockMvc.perform(post("/api/plays/999999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void recordPlay_unauthenticated_returns401() throws Exception {
        mockMvc.perform(post("/api/plays/" + testTrackId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
