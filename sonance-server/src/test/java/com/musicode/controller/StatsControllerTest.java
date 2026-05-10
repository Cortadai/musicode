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

import java.time.Instant;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class StatsControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private TrackRepository trackRepository;
    @Autowired private ArtistRepository artistRepository;
    @Autowired private AlbumRepository albumRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PlaybackEventRepository playbackEventRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        playbackEventRepository.deleteAll();

        var user = userRepository.findByUsername("statsuser").orElseGet(() ->
                userRepository.save(User.builder()
                        .username("statsuser")
                        .passwordHash(passwordEncoder.encode("pass"))
                        .role(Role.LISTENER)
                        .build()));

        // Create two artists with tracks
        var artist1 = artistRepository.findByNameContainingIgnoreCase("StatsArtist1")
                .stream().findFirst()
                .orElseGet(() -> artistRepository.save(Artist.builder().name("StatsArtist1").build()));
        var artist2 = artistRepository.findByNameContainingIgnoreCase("StatsArtist2")
                .stream().findFirst()
                .orElseGet(() -> artistRepository.save(Artist.builder().name("StatsArtist2").build()));

        var album1 = albumRepository.findByTitleContainingIgnoreCase("StatsAlbum1")
                .stream().findFirst()
                .orElseGet(() -> albumRepository.save(Album.builder().title("StatsAlbum1").artist(artist1).build()));
        var album2 = albumRepository.findByTitleContainingIgnoreCase("StatsAlbum2")
                .stream().findFirst()
                .orElseGet(() -> albumRepository.save(Album.builder().title("StatsAlbum2").artist(artist2).build()));

        var track1 = trackRepository.findByTitleContainingIgnoreCase("StatsTrack1")
                .stream().findFirst()
                .orElseGet(() -> trackRepository.save(Track.builder()
                        .title("StatsTrack1").filePath("/stats/t1.flac")
                        .artist(artist1).album(album1).duration(200).build()));
        var track2 = trackRepository.findByTitleContainingIgnoreCase("StatsTrack2")
                .stream().findFirst()
                .orElseGet(() -> trackRepository.save(Track.builder()
                        .title("StatsTrack2").filePath("/stats/t2.flac")
                        .artist(artist2).album(album2).duration(180).build()));

        // Seed play events: 3 plays for track1, 1 for track2
        for (int i = 0; i < 3; i++) {
            playbackEventRepository.save(PlaybackEvent.builder()
                    .user(user).track(track1).listenDurationSec(100 + i * 10).build());
        }
        playbackEventRepository.save(PlaybackEvent.builder()
                .user(user).track(track2).listenDurationSec(90).build());
    }

    @Test
    @WithMockUser(username = "statsuser")
    void topArtists_returnsRanked() throws Exception {
        mockMvc.perform(get("/api/stats/top-artists?period=month&limit=5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name").value("StatsArtist1"))
                .andExpect(jsonPath("$[0].playCount").value(3))
                .andExpect(jsonPath("$[1].name").value("StatsArtist2"))
                .andExpect(jsonPath("$[1].playCount").value(1));
    }

    @Test
    @WithMockUser(username = "statsuser")
    void topAlbums_returnsRanked() throws Exception {
        mockMvc.perform(get("/api/stats/top-albums?period=month&limit=5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("StatsAlbum1"))
                .andExpect(jsonPath("$[0].playCount").value(3));
    }

    @Test
    @WithMockUser(username = "statsuser")
    void topTracks_returnsRanked() throws Exception {
        mockMvc.perform(get("/api/stats/top-tracks?period=month&limit=5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("StatsTrack1"))
                .andExpect(jsonPath("$[0].playCount").value(3));
    }

    @Test
    @WithMockUser(username = "statsuser")
    void summary_returnsTotals() throws Exception {
        mockMvc.perform(get("/api/stats/summary?period=month"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPlays").value(4))
                .andExpect(jsonPath("$.totalListeningSec").value(420)) // 100+110+120+90
                .andExpect(jsonPath("$.uniqueArtists").value(2))
                .andExpect(jsonPath("$.uniqueAlbums").value(2));
    }

    @Test
    @WithMockUser(username = "statsuser")
    void history_returnsDailyCounts() throws Exception {
        mockMvc.perform(get("/api/stats/history?period=week"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1))) // All plays today
                .andExpect(jsonPath("$[0].count").value(4));
    }

    @Test
    void stats_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/stats/summary"))
                .andExpect(status().isUnauthorized());
    }
}
