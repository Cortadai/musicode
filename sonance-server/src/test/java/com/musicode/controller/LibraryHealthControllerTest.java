package com.musicode.controller;

import com.musicode.model.entity.*;
import com.musicode.repository.*;
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
class LibraryHealthControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private TrackRepository trackRepository;
    @Autowired private ArtistRepository artistRepository;
    @Autowired private AlbumRepository albumRepository;
    @Autowired private PlaybackEventRepository playbackEventRepository;

    private Artist healthyArtist;
    private Artist unknownArtist;
    private Album healthyAlbum;
    private Album unknownAlbum;
    private Album noCoverAlbum;

    @BeforeEach
    void setUp() {
        playbackEventRepository.deleteAll();
        trackRepository.deleteAll();
        albumRepository.deleteAll();
        artistRepository.deleteAll();

        healthyArtist = artistRepository.save(Artist.builder().name("Daft Punk").build());
        unknownArtist = artistRepository.save(Artist.builder().name("Unknown Artist").build());

        healthyAlbum = albumRepository.save(Album.builder()
                .title("Discovery").artist(healthyArtist).year(2001).hasCoverArt(true).build());
        unknownAlbum = albumRepository.save(Album.builder()
                .title("Unknown Album").artist(unknownArtist).hasCoverArt(true).build());
        noCoverAlbum = albumRepository.save(Album.builder()
                .title("No Cover Album").artist(healthyArtist).hasCoverArt(false).build());

        // Healthy track — no issues
        trackRepository.save(Track.builder()
                .title("One More Time").filePath("/music/one-more-time.flac")
                .artist(healthyArtist).album(healthyAlbum)
                .trackNumber(1).year(2001).genre("Electronic").duration(320)
                .build());

        // Track with Unknown Artist
        trackRepository.save(Track.builder()
                .title("Mystery Song").filePath("/music/mystery.flac")
                .artist(unknownArtist).album(healthyAlbum)
                .trackNumber(2).year(2001).genre("Electronic").duration(200)
                .build());

        // Track with Unknown Album
        trackRepository.save(Track.builder()
                .title("Lost Track").filePath("/music/lost.flac")
                .artist(healthyArtist).album(unknownAlbum)
                .trackNumber(1).year(2020).genre("Pop").duration(180)
                .build());

        // Track with title matching filename (stem)
        trackRepository.save(Track.builder()
                .title("track04").filePath("/music/track04.mp3")
                .artist(healthyArtist).album(healthyAlbum)
                .trackNumber(4).year(2001).genre("Electronic").duration(240)
                .build());

        // Track missing trackNumber, year, and genre
        trackRepository.save(Track.builder()
                .title("Bare Minimum").filePath("/music/bare.flac")
                .artist(healthyArtist).album(healthyAlbum)
                .duration(150)
                .build());

        // Track with empty genre
        trackRepository.save(Track.builder()
                .title("No Genre Song").filePath("/music/nogenre.flac")
                .artist(healthyArtist).album(healthyAlbum)
                .trackNumber(6).year(2001).genre("").duration(200)
                .build());
    }

    @Test
    @WithMockUser(username = "healthuser")
    void summary_returnsAllIssueCounts() throws Exception {
        mockMvc.perform(get("/api/library/health/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalTracks").value(6))
                .andExpect(jsonPath("$.totalAlbums").value(3))
                .andExpect(jsonPath("$.issueCounts.MISSING_ARTIST").value(1))
                .andExpect(jsonPath("$.issueCounts.MISSING_ALBUM").value(1))
                .andExpect(jsonPath("$.issueCounts.MISSING_TITLE").value(1))
                .andExpect(jsonPath("$.issueCounts.MISSING_TRACK_NUMBER").value(1))
                .andExpect(jsonPath("$.issueCounts.MISSING_YEAR").value(1))
                .andExpect(jsonPath("$.issueCounts.MISSING_GENRE").value(2))
                .andExpect(jsonPath("$.issueCounts.MISSING_COVER_ART").value(1))
                .andExpect(jsonPath("$.totalIssues").value(8));
    }

    @Test
    @WithMockUser(username = "healthuser")
    void issues_missingArtist_returnsPaginatedResults() throws Exception {
        mockMvc.perform(get("/api/library/health/issues?type=MISSING_ARTIST"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].entityName").value("Mystery Song"))
                .andExpect(jsonPath("$.content[0].type").value("MISSING_ARTIST"))
                .andExpect(jsonPath("$.content[0].filePath").value("/music/mystery.flac"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    @WithMockUser(username = "healthuser")
    void issues_missingAlbum_returnsTracks() throws Exception {
        mockMvc.perform(get("/api/library/health/issues?type=MISSING_ALBUM"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].entityName").value("Lost Track"));
    }

    @Test
    @WithMockUser(username = "healthuser")
    void issues_missingTitle_detectsFilenameMatch() throws Exception {
        mockMvc.perform(get("/api/library/health/issues?type=MISSING_TITLE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].entityName").value("track04"))
                .andExpect(jsonPath("$.content[0].detail").value("Title matches filename"));
    }

    @Test
    @WithMockUser(username = "healthuser")
    void issues_missingGenre_includesEmptyString() throws Exception {
        mockMvc.perform(get("/api/library/health/issues?type=MISSING_GENRE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.totalElements").value(2));
    }

    @Test
    @WithMockUser(username = "healthuser")
    void issues_missingCoverArt_returnsAlbums() throws Exception {
        mockMvc.perform(get("/api/library/health/issues?type=MISSING_COVER_ART"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].entityName", containsString("No Cover Album")))
                .andExpect(jsonPath("$.content[0].filePath").isEmpty());
    }

    @Test
    @WithMockUser(username = "healthuser")
    void issues_pagination_respectsPageSize() throws Exception {
        mockMvc.perform(get("/api/library/health/issues?type=MISSING_GENRE&size=1&page=0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.totalPages").value(2));
    }

    @Test
    void summary_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/library/health/summary"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "healthuser")
    void issues_missingTypeParam_returns400() throws Exception {
        mockMvc.perform(get("/api/library/health/issues"))
                .andExpect(status().isBadRequest());
    }
}
