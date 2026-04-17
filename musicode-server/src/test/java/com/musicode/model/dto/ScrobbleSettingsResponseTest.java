package com.musicode.model.dto;

import com.musicode.model.entity.Role;
import com.musicode.model.entity.User;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ScrobbleSettingsResponseTest {

    @Nested
    class Mask {

        @Test
        void nullToken_returnsNull() {
            assertNull(ScrobbleSettingsResponse.mask(null));
        }

        @Test
        void emptyToken_returnsFourStars() {
            assertEquals("****", ScrobbleSettingsResponse.mask(""));
        }

        @Test
        void shortToken_exactly8chars_returnsFourStars() {
            assertEquals("****", ScrobbleSettingsResponse.mask("12345678"));
        }

        @Test
        void shortToken_lessThan8chars_returnsFourStars() {
            assertEquals("****", ScrobbleSettingsResponse.mask("abc"));
        }

        @Test
        void normalToken_showsFirst4AndLast4() {
            assertEquals("abcd…5678", ScrobbleSettingsResponse.mask("abcd1234efgh5678"));
        }

        @Test
        void token9chars_showsFirst4AndLast4() {
            // Boundary: exactly 9 chars — should mask (first 4 + last 4 with overlap char hidden)
            assertEquals("abcd…fghi", ScrobbleSettingsResponse.mask("abcdefghi"));
        }
    }

    @Nested
    class From {

        @Test
        void userWithBothTokens_bothConnectedAndMasked() {
            var user = User.builder()
                    .username("test")
                    .passwordHash("hash")
                    .role(Role.LISTENER)
                    .listenbrainzToken("lb-token-1234567890")
                    .lastfmSessionKey("sk-session-key-abcd")
                    .build();

            var response = ScrobbleSettingsResponse.from(user);

            assertTrue(response.listenbrainzConnected());
            assertTrue(response.lastfmConnected());
            assertNotNull(response.listenbrainzTokenMasked());
            assertNotNull(response.lastfmSessionKeyMasked());
        }

        @Test
        void userWithNoTokens_bothDisconnected() {
            var user = User.builder()
                    .username("test")
                    .passwordHash("hash")
                    .role(Role.LISTENER)
                    .build();

            var response = ScrobbleSettingsResponse.from(user);

            assertFalse(response.listenbrainzConnected());
            assertFalse(response.lastfmConnected());
            assertNull(response.listenbrainzTokenMasked());
            assertNull(response.lastfmSessionKeyMasked());
        }

        @Test
        void userWithBlankTokens_treatedAsDisconnected() {
            var user = User.builder()
                    .username("test")
                    .passwordHash("hash")
                    .role(Role.LISTENER)
                    .listenbrainzToken("   ")
                    .lastfmSessionKey("")
                    .build();

            var response = ScrobbleSettingsResponse.from(user);

            assertFalse(response.listenbrainzConnected());
            assertFalse(response.lastfmConnected());
            // mask() still returns a value for non-null tokens, but connected is false
            assertEquals("****", response.listenbrainzTokenMasked());
            assertEquals("****", response.lastfmSessionKeyMasked());
        }

        @Test
        void userWithOnlyListenBrainz_partialConnection() {
            var user = User.builder()
                    .username("test")
                    .passwordHash("hash")
                    .role(Role.LISTENER)
                    .listenbrainzToken("my-valid-lb-token123")
                    .build();

            var response = ScrobbleSettingsResponse.from(user);

            assertTrue(response.listenbrainzConnected());
            assertFalse(response.lastfmConnected());
            assertNotNull(response.listenbrainzTokenMasked());
            assertNull(response.lastfmSessionKeyMasked());
        }
    }
}
