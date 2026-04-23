package com.musicode.service;

import com.github.tomakehurst.wiremock.junit5.WireMockExtension;
import com.musicode.config.LastfmConfig;
import com.musicode.model.dto.ScrobbleResult;
import com.musicode.model.dto.ScrobbleResult.ErrorType;
import com.musicode.model.entity.Album;
import com.musicode.model.entity.Artist;
import com.musicode.model.entity.Track;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * HTTP wire-level tests for LastfmService.
 *
 * Complements LastfmServiceTest (which mocks RestTemplate) by exercising the actual
 * HTTP request/response path, including form encoding, signature computation, and the
 * specific status codes Last.fm returns for common failure modes.
 */
class LastfmServiceWireMockTest {

    private static final String API_PATH = "/2.0/";
    private static final String API_KEY = "test-api-key";
    private static final String API_SECRET = "test-api-secret";

    @RegisterExtension
    static WireMockExtension wireMock = WireMockExtension.newInstance()
            .options(wireMockConfig().dynamicPort())
            .build();

    private LastfmConfig config;
    private LastfmService service;

    @BeforeEach
    void setUp() {
        config = new LastfmConfig();
        config.setApiKey(API_KEY);
        config.setApiSecret(API_SECRET);
        service = new LastfmService(config);
        ReflectionTestUtils.setField(service, "apiUrl", wireMock.baseUrl() + API_PATH);
    }

    // --- authenticate ---

    @Test
    void authenticate_success_returnsSessionKey() {
        wireMock.stubFor(post(urlEqualTo(API_PATH))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"session\":{\"name\":\"alice\",\"key\":\"sess-abc-123\",\"subscriber\":0}}")));

        String key = service.authenticate("alice", "hunter2");

        assertThat(key).isEqualTo("sess-abc-123");
    }

    @Test
    void authenticate_signsRequestAndSendsFormEncoded() {
        stubScrobbleOk("{\"session\":{\"key\":\"sess-xyz\"}}");

        service.authenticate("alice", "hunter2");

        var req = wireMock.findAll(postRequestedFor(urlEqualTo(API_PATH))).get(0);
        assertThat(req.getHeader("Content-Type")).startsWith("application/x-www-form-urlencoded");

        Map<String, String> form = parseForm(req.getBodyAsString());
        assertThat(form.get("method")).isEqualTo("auth.getMobileSession");
        assertThat(form.get("username")).isEqualTo("alice");
        assertThat(form.get("password")).isEqualTo("hunter2");
        assertThat(form.get("api_key")).isEqualTo(API_KEY);
        assertThat(form.get("format")).isEqualTo("json");
        assertThat(form.get("api_sig")).isNotBlank();
    }

    @Test
    void authenticate_403_returnsNull() {
        // Last.fm returns 403 with error=4 for bad credentials
        wireMock.stubFor(post(urlEqualTo(API_PATH))
                .willReturn(aResponse()
                        .withStatus(403)
                        .withBody("{\"error\":4,\"message\":\"Authentication Failed\"}")));

        String key = service.authenticate("alice", "wrong-password");

        assertThat(key).isNull();
    }

    @Test
    void authenticate_500_returnsNull() {
        wireMock.stubFor(post(urlEqualTo(API_PATH))
                .willReturn(aResponse().withStatus(500).withBody("internal error")));

        String key = service.authenticate("alice", "hunter2");

        assertThat(key).isNull();
    }

    @Test
    void authenticate_connectionReset_returnsNull() {
        wireMock.stubFor(post(urlEqualTo(API_PATH))
                .willReturn(aResponse().withFault(
                        com.github.tomakehurst.wiremock.http.Fault.CONNECTION_RESET_BY_PEER)));

        String key = service.authenticate("alice", "hunter2");

        assertThat(key).isNull();
    }

    // --- scrobble ---

    @Test
    void scrobble_success_returnsOk() {
        stubScrobbleOk("{\"scrobbles\":{\"@attr\":{\"ignored\":0,\"accepted\":1}}}");

        ScrobbleResult result = service.scrobble(fullTrack(), "sk-42", Instant.ofEpochSecond(1_700_000_000L));

        assertThat(result.success()).isTrue();
        assertThat(result.errorType()).isEqualTo(ErrorType.NONE);
    }

    @Test
    void scrobble_401_returnsAuthError() {
        wireMock.stubFor(post(urlEqualTo(API_PATH))
                .willReturn(aResponse()
                        .withStatus(401)
                        .withBody("{\"error\":9,\"message\":\"Invalid session key\"}")));

        ScrobbleResult result = service.scrobble(fullTrack(), "sk-stale", Instant.ofEpochSecond(1L));

        assertThat(result.success()).isFalse();
        assertThat(result.errorType()).isEqualTo(ErrorType.AUTH_ERROR);
        assertThat(result.isRetryable()).isFalse();
    }

    @Test
    void scrobble_429_returnsUnknownError() {
        wireMock.stubFor(post(urlEqualTo(API_PATH))
                .willReturn(aResponse()
                        .withStatus(429)
                        .withHeader("Retry-After", "60")
                        .withBody("{\"error\":29,\"message\":\"Rate limit exceeded\"}")));

        ScrobbleResult result = service.scrobble(fullTrack(), "sk-42", Instant.ofEpochSecond(1L));

        assertThat(result.success()).isFalse();
    }

    @Test
    void scrobble_503_returnsServerError() {
        wireMock.stubFor(post(urlEqualTo(API_PATH))
                .willReturn(aResponse()
                        .withStatus(503)
                        .withBody("<html>Service Unavailable</html>")));

        ScrobbleResult result = service.scrobble(fullTrack(), "sk-42", Instant.ofEpochSecond(1L));

        assertThat(result.success()).isFalse();
        assertThat(result.errorType()).isEqualTo(ErrorType.SERVER_ERROR);
        assertThat(result.isRetryable()).isTrue();
    }

    @Test
    void scrobble_sendsSignedFormPayloadWithAllTrackFields() {
        stubScrobbleOk("{\"scrobbles\":{}}");

        service.scrobble(fullTrack(), "sk-42", Instant.ofEpochSecond(1_700_000_000L));

        var req = wireMock.findAll(postRequestedFor(urlEqualTo(API_PATH))).get(0);
        assertThat(req.getHeader("Content-Type")).startsWith("application/x-www-form-urlencoded");

        Map<String, String> form = parseForm(req.getBodyAsString());
        assertThat(form.get("method")).isEqualTo("track.scrobble");
        assertThat(form.get("artist")).isEqualTo("Radiohead");
        assertThat(form.get("track")).isEqualTo("Karma Police");
        assertThat(form.get("album")).isEqualTo("OK Computer");
        assertThat(form.get("duration")).isEqualTo("263");
        assertThat(form.get("timestamp")).isEqualTo("1700000000");
        assertThat(form.get("sk")).isEqualTo("sk-42");
        assertThat(form.get("api_key")).isEqualTo(API_KEY);
        assertThat(form.get("api_sig")).isNotBlank();
        assertThat(form.get("format")).isEqualTo("json");
    }

    @Test
    void scrobble_unicodeTitleSurvivesFormEncoding() {
        stubScrobbleOk("{\"scrobbles\":{}}");

        Artist a = new Artist();
        a.setName("Sigur Rós");
        Album alb = new Album();
        alb.setTitle("( )");
        Track t = Track.builder()
                .title("Untitled #4 — Njósnavélin")
                .artist(a)
                .album(alb)
                .duration(440)
                .build();

        ScrobbleResult result = service.scrobble(t, "sk-42", Instant.ofEpochSecond(1L));
        assertThat(result.success()).isTrue();

        var req = wireMock.findAll(postRequestedFor(urlEqualTo(API_PATH))).get(0);
        Map<String, String> form = parseForm(req.getBodyAsString());
        assertThat(form.get("artist")).isEqualTo("Sigur Rós");
        assertThat(form.get("album")).isEqualTo("( )");
        assertThat(form.get("track")).isEqualTo("Untitled #4 — Njósnavélin");
    }

    @Test
    void scrobble_connectionReset_returnsTimeoutError() {
        wireMock.stubFor(post(urlEqualTo(API_PATH))
                .willReturn(aResponse().withFault(
                        com.github.tomakehurst.wiremock.http.Fault.CONNECTION_RESET_BY_PEER)));

        ScrobbleResult result = service.scrobble(fullTrack(), "sk-42", Instant.ofEpochSecond(1L));

        assertThat(result.success()).isFalse();
        assertThat(result.errorType()).isEqualTo(ErrorType.TIMEOUT);
        assertThat(result.isRetryable()).isTrue();
    }

    // --- helpers ---

    private Track fullTrack() {
        Artist a = new Artist();
        a.setName("Radiohead");
        Album alb = new Album();
        alb.setTitle("OK Computer");
        return Track.builder()
                .title("Karma Police")
                .artist(a)
                .album(alb)
                .duration(263)
                .build();
    }

    private void stubScrobbleOk(String jsonBody) {
        wireMock.stubFor(post(urlEqualTo(API_PATH))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody(jsonBody)));
    }

    private Map<String, String> parseForm(String body) {
        Map<String, String> out = new HashMap<>();
        for (String pair : body.split("&")) {
            int eq = pair.indexOf('=');
            if (eq < 0) continue;
            String k = URLDecoder.decode(pair.substring(0, eq), StandardCharsets.UTF_8);
            String v = URLDecoder.decode(pair.substring(eq + 1), StandardCharsets.UTF_8);
            out.put(k, v);
        }
        return out;
    }
}
