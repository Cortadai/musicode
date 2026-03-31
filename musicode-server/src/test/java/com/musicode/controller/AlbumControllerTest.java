package com.musicode.controller;

import com.musicode.model.entity.Album;
import com.musicode.model.entity.Artist;
import com.musicode.model.entity.Track;
import com.musicode.repository.AlbumRepository;
import com.musicode.repository.ArtistRepository;
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
class AlbumControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private AlbumRepository albumRepository;
    @Autowired private ArtistRepository artistRepository;
    @Autowired private TrackRepository trackRepository;

    private Album savedAlbum;

    @BeforeEach
    void setUp() {
        trackRepository.deleteAll();
        albumRepository.deleteAll();
        artistRepository.deleteAll();

        Artist artist = artistRepository.save(Artist.builder().name("Test Artist").build());

        savedAlbum = albumRepository.save(Album.builder()
                .title("Test Album")
                .year(2024)
                .artist(artist)
                .hasCoverArt(false)
                .build());

        trackRepository.save(Track.builder()
                .title("Track One")
                .trackNumber(1)
                .duration(200)
                .filePath("/music/track1.flac")
                .fileSize(10_000_000L)
                .album(savedAlbum)
                .artist(artist)
                .build());

        trackRepository.save(Track.builder()
                .title("Track Two")
                .trackNumber(2)
                .duration(180)
                .filePath("/music/track2.flac")
                .fileSize(9_000_000L)
                .album(savedAlbum)
                .artist(artist)
                .build());
    }

    @Test
    void getAllAlbums_returnsPaginatedList() throws Exception {
        mockMvc.perform(get("/api/albums"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title", is("Test Album")))
                .andExpect(jsonPath("$.content[0].artist.name", is("Test Artist")))
                .andExpect(jsonPath("$.totalElements", is(1)));
    }

    @Test
    void getAlbum_existingId_returnsAlbumWithTracks() throws Exception {
        mockMvc.perform(get("/api/albums/{id}", savedAlbum.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Test Album")))
                .andExpect(jsonPath("$.artist.name", is("Test Artist")))
                .andExpect(jsonPath("$.tracks", hasSize(2)))
                .andExpect(jsonPath("$.tracks[0].title", is("Track One")));
    }

    @Test
    void getAlbum_nonExistentId_returns404() throws Exception {
        mockMvc.perform(get("/api/albums/{id}", 99999))
                .andExpect(status().isNotFound());
    }
}
