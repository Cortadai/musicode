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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(roles = "LISTENER")
class ArtistControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private AlbumRepository albumRepository;
    @Autowired private ArtistRepository artistRepository;
    @Autowired private TrackRepository trackRepository;
    @Autowired private PlaybackEventRepository playbackEventRepository;

    private Artist savedArtist;

    @BeforeEach
    void setUp() {
        playbackEventRepository.deleteAll();
        trackRepository.deleteAll();
        albumRepository.deleteAll();
        artistRepository.deleteAll();

        savedArtist = artistRepository.save(Artist.builder().name("Synthwave Artist").build());

        Album album = albumRepository.save(Album.builder()
                .title("Neon Dreams")
                .year(2023)
                .artist(savedArtist)
                .hasCoverArt(false)
                .build());

        trackRepository.save(Track.builder()
                .title("Midnight Drive")
                .trackNumber(1)
                .duration(240)
                .filePath("/music/midnight.flac")
                .fileSize(12_000_000L)
                .album(album)
                .artist(savedArtist)
                .build());
    }

    @Test
    void getAllArtists_returnsPaginatedList() throws Exception {
        mockMvc.perform(get("/api/artists"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name", is("Synthwave Artist")))
                .andExpect(jsonPath("$.totalElements", is(1)));
    }

    @Test
    void getArtist_existingId_returnsArtistWithAlbums() throws Exception {
        mockMvc.perform(get("/api/artists/{id}", savedArtist.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Synthwave Artist")))
                .andExpect(jsonPath("$.albums", hasSize(1)))
                .andExpect(jsonPath("$.albums[0].title", is("Neon Dreams")));
    }

    @Test
    void getArtist_nonExistentId_returns404() throws Exception {
        mockMvc.perform(get("/api/artists/{id}", 99999))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAllArtists_includesHiddenArtists() throws Exception {
        savedArtist.setHidden(true);
        artistRepository.save(savedArtist);

        mockMvc.perform(get("/api/artists"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].hidden", is(true)));
    }

    @Test
    void toggleVisibility_hidesArtist() throws Exception {
        mockMvc.perform(patch("/api/artists/{id}/visibility", savedArtist.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hidden", is(true)));

        mockMvc.perform(get("/api/artists"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].hidden", is(true)));
    }

    @Test
    void toggleVisibility_unhidesArtist() throws Exception {
        savedArtist.setHidden(true);
        artistRepository.save(savedArtist);

        mockMvc.perform(patch("/api/artists/{id}/visibility", savedArtist.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hidden", is(false)));

        mockMvc.perform(get("/api/artists"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].hidden", is(false)));
    }

    @Test
    void hiddenArtist_albumsExcludedFromListing() throws Exception {
        savedArtist.setHidden(true);
        artistRepository.save(savedArtist);

        mockMvc.perform(get("/api/albums"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(0)));
    }

    @Test
    void getHiddenArtists_returnsOnlyHidden() throws Exception {
        Artist hiddenArtist = artistRepository.save(Artist.builder().name("Hidden Band").hidden(true).build());
        albumRepository.save(Album.builder()
                .title("Secret Album")
                .year(2024)
                .artist(hiddenArtist)
                .hasCoverArt(false)
                .build());

        mockMvc.perform(get("/api/artists/hidden"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is("Hidden Band")));
    }
}
