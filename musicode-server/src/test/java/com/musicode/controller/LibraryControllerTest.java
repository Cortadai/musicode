package com.musicode.controller;

import com.musicode.model.entity.LibraryFolder;
import com.musicode.repository.LibraryFolderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.file.Path;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LibraryControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private LibraryFolderRepository libraryFolderRepository;
    @Autowired private com.musicode.repository.TrackRepository trackRepository;
    @Autowired private com.musicode.repository.AlbumRepository albumRepository;
    @Autowired private com.musicode.repository.ArtistRepository artistRepository;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        trackRepository.deleteAll();
        albumRepository.deleteAll();
        artistRepository.deleteAll();
        libraryFolderRepository.deleteAll();
    }

    @Test
    void getFolders_empty_returnsEmptyList() throws Exception {
        mockMvc.perform(get("/api/library/folders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void addFolder_validPath_returnsFolder() throws Exception {
        String json = "{\"path\":\"" + tempDir.toString().replace("\\", "\\\\") + "\"}";

        mockMvc.perform(post("/api/library/folders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.path", is(tempDir.toString())));
    }

    @Test
    void addFolder_blankPath_returns400() throws Exception {
        mockMvc.perform(post("/api/library/folders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"path\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", containsString("required")));
    }

    @Test
    void addFolder_nonExistentPath_returns400() throws Exception {
        mockMvc.perform(post("/api/library/folders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"path\":\"C:/nonexistent/folder/xyz\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", containsString("not exist")));
    }

    @Test
    void addFolder_duplicate_returns400() throws Exception {
        // Save one first
        libraryFolderRepository.save(LibraryFolder.builder().path(tempDir.toString()).build());

        String json = "{\"path\":\"" + tempDir.toString().replace("\\", "\\\\") + "\"}";
        mockMvc.perform(post("/api/library/folders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", containsString("already")));
    }

    @Test
    void removeFolder_existingId_returnsOk() throws Exception {
        LibraryFolder saved = libraryFolderRepository.save(
                LibraryFolder.builder().path(tempDir.toString()).build());

        mockMvc.perform(delete("/api/library/folders/{id}", saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deleted", is(saved.getId().intValue())));
    }

    @Test
    void removeFolder_nonExistentId_returns404() throws Exception {
        mockMvc.perform(delete("/api/library/folders/{id}", 99999))
                .andExpect(status().isNotFound());
    }

    @Test
    void getScanStatus_returnsStatus() throws Exception {
        mockMvc.perform(get("/api/library/scan/status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.scanning", is(false)));
    }

    @Test
    void startScan_noFolders_returns400() throws Exception {
        mockMvc.perform(post("/api/library/scan"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", containsString("No library folders")));
    }

    @Test
    void cleanup_returnsRemovedCount() throws Exception {
        mockMvc.perform(post("/api/library/cleanup"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.removed", is(0)));
    }
}
