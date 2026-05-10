package com.musicode.controller;

import com.musicode.model.entity.Album;
import com.musicode.model.entity.Artist;
import com.musicode.model.entity.Track;
import com.musicode.repository.AlbumRepository;
import com.musicode.repository.ArtistRepository;
import com.musicode.repository.PlaybackEventRepository;
import com.musicode.repository.TrackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(roles = "LISTENER")
class SearchControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private AlbumRepository albumRepository;
    @Autowired private ArtistRepository artistRepository;
    @Autowired private TrackRepository trackRepository;
    @Autowired private PlaybackEventRepository playbackEventRepository;

    @BeforeEach
    void setUp() {
        playbackEventRepository.deleteAll();
        trackRepository.deleteAll();
        albumRepository.deleteAll();
        artistRepository.deleteAll();

        Artist artist = artistRepository.save(Artist.builder().name("Echo Synth").build());

        Album album = albumRepository.save(Album.builder()
                .title("After The Neon Fades")
                .year(2024)
                .artist(artist)
                .hasCoverArt(false)
                .build());

        trackRepository.save(Track.builder()
                .title("Rolling Through the Dark")
                .trackNumber(1)
                .duration(300)
                .filePath("/music/rolling.flac")
                .fileSize(15_000_000L)
                .album(album)
                .artist(artist)
                .build());

        trackRepository.save(Track.builder()
                .title("Neon Highway")
                .trackNumber(2)
                .duration(250)
                .filePath("/music/neon.flac")
                .fileSize(13_000_000L)
                .album(album)
                .artist(artist)
                .build());
    }

    @Test
    void search_withMatchingQuery_returnsResults() throws Exception {
        mockMvc.perform(get("/api/search").param("q", "neon"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tracks", hasSize(1)))
                .andExpect(jsonPath("$.tracks[0].title", is("Neon Highway")))
                .andExpect(jsonPath("$.albums", hasSize(1)))
                .andExpect(jsonPath("$.albums[0].title", is("After The Neon Fades")))
                .andExpect(jsonPath("$.artists", hasSize(0)));
    }

    @Test
    void search_withArtistQuery_returnsArtist() throws Exception {
        mockMvc.perform(get("/api/search").param("q", "echo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.artists", hasSize(1)))
                .andExpect(jsonPath("$.artists[0].name", is("Echo Synth")));
    }

    @Test
    void search_withBlankQuery_returnsEmptyResults() throws Exception {
        mockMvc.perform(get("/api/search").param("q", ""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tracks", hasSize(0)))
                .andExpect(jsonPath("$.albums", hasSize(0)))
                .andExpect(jsonPath("$.artists", hasSize(0)));
    }

    @Test
    void search_withNoMatchingQuery_returnsEmptyResults() throws Exception {
        mockMvc.perform(get("/api/search").param("q", "zzzznotfound"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tracks", hasSize(0)))
                .andExpect(jsonPath("$.albums", hasSize(0)))
                .andExpect(jsonPath("$.artists", hasSize(0)));
    }
}
