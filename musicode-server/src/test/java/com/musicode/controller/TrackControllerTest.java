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
class TrackControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private AlbumRepository albumRepository;
    @Autowired private ArtistRepository artistRepository;
    @Autowired private TrackRepository trackRepository;

    private Track savedTrack;

    @BeforeEach
    void setUp() {
        trackRepository.deleteAll();
        albumRepository.deleteAll();
        artistRepository.deleteAll();

        Artist artist = artistRepository.save(Artist.builder().name("Track Artist").build());

        Album album = albumRepository.save(Album.builder()
                .title("Track Album")
                .year(2024)
                .artist(artist)
                .hasCoverArt(false)
                .build());

        savedTrack = trackRepository.save(Track.builder()
                .title("First Song")
                .trackNumber(1)
                .discNumber(1)
                .duration(210)
                .filePath("/music/first.flac")
                .fileSize(11_000_000L)
                .bitRate(1411)
                .sampleRate(44100)
                .bitsPerSample(16)
                .year(2024)
                .genre("Electronic")
                .album(album)
                .artist(artist)
                .build());

        trackRepository.save(Track.builder()
                .title("Second Song")
                .trackNumber(2)
                .duration(195)
                .filePath("/music/second.flac")
                .fileSize(10_500_000L)
                .album(album)
                .artist(artist)
                .build());
    }

    @Test
    void getAllTracks_returnsPaginatedList() throws Exception {
        mockMvc.perform(get("/api/tracks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.totalElements", is(2)));
    }

    @Test
    void getTrack_existingId_returnsTrackWithDetails() throws Exception {
        mockMvc.perform(get("/api/tracks/{id}", savedTrack.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("First Song")))
                .andExpect(jsonPath("$.trackNumber", is(1)))
                .andExpect(jsonPath("$.duration", is(210)))
                .andExpect(jsonPath("$.bitRate", is(1411)))
                .andExpect(jsonPath("$.sampleRate", is(44100)))
                .andExpect(jsonPath("$.genre", is("Electronic")))
                .andExpect(jsonPath("$.album.title", is("Track Album")))
                .andExpect(jsonPath("$.artist.name", is("Track Artist")));
    }

    @Test
    void getTrack_nonExistentId_returns404() throws Exception {
        mockMvc.perform(get("/api/tracks/{id}", 99999))
                .andExpect(status().isNotFound());
    }
}
