package com.musicode.controller;

import com.musicode.model.entity.*;
import com.musicode.repository.*;
import com.musicode.service.ActivityService;
import com.musicode.service.ScrobbleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration test: verifies that recording a play triggers scrobble and activity broadcast
 * with the correct PlaybackEvent. Uses @MockBean for ScrobbleService and ActivityService
 * as the mock boundary — wire-level scrobbling was proved in S01.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PlayScrobbleIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private TrackRepository trackRepository;
    @Autowired private ArtistRepository artistRepository;
    @Autowired private AlbumRepository albumRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PlaybackEventRepository playbackEventRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @MockBean private ScrobbleService scrobbleService;
    @MockBean private ActivityService activityService;

    private Long trackId;
    private Long userId;

    @BeforeEach
    void setUp() {
        playbackEventRepository.deleteAll();

        // Ensure test user
        var user = userRepository.findByUsername("testuser").orElseGet(() ->
                userRepository.save(User.builder()
                        .username("testuser")
                        .passwordHash(passwordEncoder.encode("pass"))
                        .role(Role.LISTENER)
                        .build()));
        userId = user.getId();

        // Ensure track with artist and album
        if (trackRepository.count() == 0) {
            var artist = artistRepository.save(Artist.builder().name("Integration Artist").build());
            var album = albumRepository.save(Album.builder().title("Integration Album").artist(artist).build());
            var track = trackRepository.save(Track.builder()
                    .title("Integration Track")
                    .filePath("/test/integration.flac")
                    .artist(artist)
                    .album(album)
                    .duration(300)
                    .build());
            trackId = track.getId();
        } else {
            trackId = trackRepository.findAll().get(0).getId();
        }
    }

    @Test
    @WithMockUser(username = "testuser")
    void recordPlay_invokesScrobbleWithCorrectEvent() throws Exception {
        mockMvc.perform(post("/api/plays/" + trackId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"listenDurationSec\": 150}"))
                .andExpect(status().isCreated());

        // Capture the PlaybackEvent passed to scrobbleService.scrobble()
        var captor = ArgumentCaptor.forClass(PlaybackEvent.class);
        verify(scrobbleService).scrobble(captor.capture());

        var event = captor.getValue();
        assertNotNull(event.getId(), "Event should be persisted before scrobble call");
        assertEquals(trackId, event.getTrack().getId());
        assertEquals(userId, event.getUser().getId());
        assertEquals(150, event.getListenDurationSec());
        assertNotNull(event.getPlayedAt());
    }

    @Test
    @WithMockUser(username = "testuser")
    void recordPlay_invokesActivityBroadcast() throws Exception {
        mockMvc.perform(post("/api/plays/" + trackId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());

        var captor = ArgumentCaptor.forClass(PlaybackEvent.class);
        verify(activityService).broadcast(captor.capture());

        var event = captor.getValue();
        assertEquals(trackId, event.getTrack().getId());
    }

    @Test
    @WithMockUser(username = "testuser")
    void recordPlay_withNoBody_stillScrobbles() throws Exception {
        mockMvc.perform(post("/api/plays/" + trackId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());

        var captor = ArgumentCaptor.forClass(PlaybackEvent.class);
        verify(scrobbleService).scrobble(captor.capture());

        assertNull(captor.getValue().getListenDurationSec());
    }

    @Test
    @WithMockUser(username = "testuser")
    void recordPlay_invalidTrack_doesNotScrobble() throws Exception {
        mockMvc.perform(post("/api/plays/999999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(scrobbleService, never()).scrobble(any());
        verify(activityService, never()).broadcast(any());
    }
}
