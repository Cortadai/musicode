package com.musicode.controller;

import com.musicode.model.entity.Album;
import com.musicode.model.entity.Artist;
import com.musicode.repository.AlbumRepository;
import com.musicode.repository.ArtistRepository;
import com.musicode.service.CoverArtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(roles = "LISTENER")
class CoverArtControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private CoverArtService coverArtService;
    @Autowired private AlbumRepository albumRepository;
    @Autowired private ArtistRepository artistRepository;

    @Test
    void getCoverArt_nonExistent_returns404() throws Exception {
        mockMvc.perform(get("/api/covers/{albumId}", 99999))
                .andExpect(status().isNotFound());
    }

    @Test
    void getCoverArt_albumWithoutFlag_returns404() throws Exception {
        byte[] fakeJpeg = new byte[]{(byte)0xFF, (byte)0xD8, (byte)0xFF, (byte)0xE0, 0, 0, 0, 0};
        Artist artist = artistRepository.save(Artist.builder().name("Orphan Artist").build());
        Album album = albumRepository.save(Album.builder()
                .title("Orphan Album").artist(artist).hasCoverArt(false).build());
        coverArtService.saveCoverArt(album.getId(), fakeJpeg);

        mockMvc.perform(get("/api/covers/{albumId}", album.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void getCoverArt_existing_returnsCover() throws Exception {
        Artist artist = artistRepository.save(Artist.builder().name("Test Artist").build());
        Album album = albumRepository.save(Album.builder()
                .title("Test Album").artist(artist).hasCoverArt(true).build());

        byte[] fakeJpeg = new byte[]{(byte)0xFF, (byte)0xD8, (byte)0xFF, (byte)0xE0, 0, 0, 0, 0};
        coverArtService.saveCoverArt(album.getId(), fakeJpeg);

        mockMvc.perform(get("/api/covers/{albumId}", album.getId()))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "image/jpeg"))
                .andExpect(header().exists("Cache-Control"));
    }
}
