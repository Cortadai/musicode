package com.musicode.controller;

import com.musicode.service.CoverArtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(roles = "LISTENER")
class CoverArtControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private CoverArtService coverArtService;

    @Test
    void getCoverArt_nonExistent_returns404() throws Exception {
        mockMvc.perform(get("/api/covers/{albumId}", 99999))
                .andExpect(status().isNotFound());
    }

    @Test
    void getCoverArt_existing_returnsCover() throws Exception {
        // Save a test cover via service
        byte[] fakeJpeg = new byte[]{(byte)0xFF, (byte)0xD8, (byte)0xFF, (byte)0xE0, 0, 0, 0, 0};
        coverArtService.saveCoverArt(1L, fakeJpeg);

        mockMvc.perform(get("/api/covers/{albumId}", 1))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "image/jpeg"))
                .andExpect(header().exists("Cache-Control"));
    }
}
