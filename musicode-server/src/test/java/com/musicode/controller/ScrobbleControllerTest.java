package com.musicode.controller;

import com.musicode.model.entity.Role;
import com.musicode.model.entity.User;
import com.musicode.repository.PlaybackEventRepository;
import com.musicode.repository.RefreshTokenRepository;
import com.musicode.repository.UserRepository;
import com.musicode.service.LastfmService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ScrobbleControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserRepository userRepository;
    @Autowired private PlaybackEventRepository playbackEventRepository;
    @Autowired private RefreshTokenRepository refreshTokenRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @MockBean private LastfmService lastfmService;

    @BeforeEach
    void setUp() {
        playbackEventRepository.deleteAll();
        refreshTokenRepository.deleteAll();

        // Reset or create the test user with no scrobble tokens
        var existing = userRepository.findByUsername("testuser");
        if (existing.isPresent()) {
            var user = existing.get();
            user.setListenbrainzToken(null);
            user.setLastfmSessionKey(null);
            userRepository.save(user);
        } else {
            userRepository.save(User.builder()
                    .username("testuser")
                    .passwordHash(passwordEncoder.encode("pass"))
                    .role(Role.LISTENER)
                    .build());
        }
    }

    // --- GET /api/scrobble/settings ---

    @Nested
    class GetSettings {

        @Test
        @WithMockUser(username = "testuser")
        void returnsDisconnectedWhenNoTokens() throws Exception {
            mockMvc.perform(get("/api/scrobble/settings"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.listenbrainzConnected", is(false)))
                    .andExpect(jsonPath("$.lastfmConnected", is(false)))
                    .andExpect(jsonPath("$.listenbrainzTokenMasked").doesNotExist())
                    .andExpect(jsonPath("$.lastfmSessionKeyMasked").doesNotExist());
        }

        @Test
        @WithMockUser(username = "testuser")
        void returnsConnectedWithMaskedTokens() throws Exception {
            var user = userRepository.findByUsername("testuser").orElseThrow();
            user.setListenbrainzToken("abcd1234efgh5678");
            user.setLastfmSessionKey("sess1234key56789");
            userRepository.save(user);

            mockMvc.perform(get("/api/scrobble/settings"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.listenbrainzConnected", is(true)))
                    .andExpect(jsonPath("$.lastfmConnected", is(true)))
                    .andExpect(jsonPath("$.listenbrainzTokenMasked", is("abcd…5678")))
                    .andExpect(jsonPath("$.lastfmSessionKeyMasked", is("sess…6789")));
        }

        @Test
        void unauthenticated_returns401() throws Exception {
            mockMvc.perform(get("/api/scrobble/settings"))
                    .andExpect(status().isUnauthorized());
        }
    }

    // --- PUT /api/scrobble/settings ---

    @Nested
    class UpdateSettings {

        @Test
        @WithMockUser(username = "testuser")
        void connectListenBrainz_setsToken() throws Exception {
            mockMvc.perform(put("/api/scrobble/settings")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"listenbrainzToken\": \"my-lb-token-1234567890\"}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.listenbrainzConnected", is(true)))
                    .andExpect(jsonPath("$.listenbrainzTokenMasked", is("my-l…7890")));

            // Verify persisted
            var user = userRepository.findByUsername("testuser").orElseThrow();
            assert user.getListenbrainzToken() != null;
        }

        @Test
        @WithMockUser(username = "testuser")
        void disconnectListenBrainz_withBlankToken() throws Exception {
            // Pre-connect
            var user = userRepository.findByUsername("testuser").orElseThrow();
            user.setListenbrainzToken("existing-token-value1");
            userRepository.save(user);

            mockMvc.perform(put("/api/scrobble/settings")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"listenbrainzToken\": \"\"}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.listenbrainzConnected", is(false)));
        }

        @Test
        @WithMockUser(username = "testuser")
        void connectLastfm_authenticatesAndSetsSessionKey() throws Exception {
            when(lastfmService.authenticate("lfuser", "lfpass")).thenReturn("session-key-from-lastfm");

            mockMvc.perform(put("/api/scrobble/settings")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"lastfmUsername\": \"lfuser\", \"lastfmPassword\": \"lfpass\"}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.lastfmConnected", is(true)));

            verify(lastfmService).authenticate("lfuser", "lfpass");
        }

        @Test
        @WithMockUser(username = "testuser")
        void disconnectLastfm_withBlankUsername() throws Exception {
            // Pre-connect
            var user = userRepository.findByUsername("testuser").orElseThrow();
            user.setLastfmSessionKey("existing-session-key1");
            userRepository.save(user);

            mockMvc.perform(put("/api/scrobble/settings")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"lastfmUsername\": \"\", \"lastfmPassword\": \"ignored\"}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.lastfmConnected", is(false)));

            verify(lastfmService, never()).authenticate(anyString(), anyString());
        }

        @Test
        @WithMockUser(username = "testuser")
        void lastfmAuthFails_returns400() throws Exception {
            when(lastfmService.authenticate("bad", "creds")).thenReturn(null);

            mockMvc.perform(put("/api/scrobble/settings")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"lastfmUsername\": \"bad\", \"lastfmPassword\": \"creds\"}"))
                    .andExpect(status().isBadRequest());
        }

        @Test
        void unauthenticated_returns401() throws Exception {
            mockMvc.perform(put("/api/scrobble/settings")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"listenbrainzToken\": \"token\"}"))
                    .andExpect(status().isUnauthorized());
        }
    }

    // --- DELETE /api/scrobble/settings/lastfm ---

    @Nested
    class DisconnectLastfm {

        @Test
        @WithMockUser(username = "testuser")
        void disconnects_andReturnsUpdatedSettings() throws Exception {
            var user = userRepository.findByUsername("testuser").orElseThrow();
            user.setLastfmSessionKey("session-to-remove1");
            userRepository.save(user);

            mockMvc.perform(delete("/api/scrobble/settings/lastfm"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.lastfmConnected", is(false)))
                    .andExpect(jsonPath("$.lastfmSessionKeyMasked").doesNotExist());
        }

        @Test
        @WithMockUser(username = "testuser")
        void disconnectWhenAlreadyDisconnected_succeeds() throws Exception {
            mockMvc.perform(delete("/api/scrobble/settings/lastfm"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.lastfmConnected", is(false)));
        }
    }

    // --- DELETE /api/scrobble/settings/listenbrainz ---

    @Nested
    class DisconnectListenBrainz {

        @Test
        @WithMockUser(username = "testuser")
        void disconnects_andReturnsUpdatedSettings() throws Exception {
            var user = userRepository.findByUsername("testuser").orElseThrow();
            user.setListenbrainzToken("token-to-remove12345");
            userRepository.save(user);

            mockMvc.perform(delete("/api/scrobble/settings/listenbrainz"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.listenbrainzConnected", is(false)))
                    .andExpect(jsonPath("$.listenbrainzTokenMasked").doesNotExist());
        }

        @Test
        @WithMockUser(username = "testuser")
        void disconnectWhenAlreadyDisconnected_succeeds() throws Exception {
            mockMvc.perform(delete("/api/scrobble/settings/listenbrainz"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.listenbrainzConnected", is(false)));
        }
    }
}
