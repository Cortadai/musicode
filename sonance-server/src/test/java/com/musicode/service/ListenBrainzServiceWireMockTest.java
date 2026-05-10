package com.musicode.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.tomakehurst.wiremock.junit5.WireMockExtension;
import com.musicode.model.dto.ScrobbleResult;
import com.musicode.model.dto.ScrobbleResult.ErrorType;
import com.musicode.model.entity.Album;
import com.musicode.model.entity.Artist;
import com.musicode.model.entity.Track;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * HTTP wire-level tests for ListenBrainzService.
 *
 * Complements ListenBrainzServiceTest (which mocks RestTemplate) by exercising the
 * actual HTTP request/response path. Catches wire-level regressions the mocked tests miss —
 * e.g. the Map.of-empty-body bug that shipped the main scrobble integration broken until
 * the serialized-ObjectMapper fix.
 */
class ListenBrainzServiceWireMockTest {

    private static final String SUBMIT_PATH = "/1/submit-listens";

    @RegisterExtension
    static WireMockExtension wireMock = WireMockExtension.newInstance()
            .options(wireMockConfig().dynamicPort())
            .build();

    private ListenBrainzService service;

    @BeforeEach
    void setUp() {
        service = new ListenBrainzService();
        ReflectionTestUtils.setField(service, "apiUrl", wireMock.baseUrl() + SUBMIT_PATH);
    }

    @Test
    void submitListen_sendsCorrectlyFormedRequest() throws Exception {
        wireMock.stubFor(post(urlEqualTo(SUBMIT_PATH))
                .willReturn(aResponse().withStatus(200).withBody("{\"status\":\"ok\"}")));

        ScrobbleResult result = service.submitListen(fullTrack(), "lb-token-123", Instant.ofEpochSecond(1_700_000_000L));

        assertThat(result.success()).isTrue();

        var requests = wireMock.findAll(postRequestedFor(urlEqualTo(SUBMIT_PATH)));
        assertThat(requests).hasSize(1);
        var req = requests.get(0);

        assertThat(req.getHeader("Authorization")).isEqualTo("Token lb-token-123");
        assertThat(req.getHeader("Content-Type")).startsWith("application/json");
        assertThat(req.getHeader("User-Agent")).startsWith("Musicode/");

        Map<String, Object> body = new ObjectMapper().readValue(req.getBodyAsString(), Map.class);
        assertThat(body.get("listen_type")).isEqualTo("single");

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> payload = (List<Map<String, Object>>) body.get("payload");
        assertThat(payload).hasSize(1);
        assertThat(((Number) payload.get(0).get("listened_at")).longValue()).isEqualTo(1_700_000_000L);

        @SuppressWarnings("unchecked")
        Map<String, Object> metadata = (Map<String, Object>) payload.get(0).get("track_metadata");
        assertThat(metadata.get("artist_name")).isEqualTo("Radiohead");
        assertThat(metadata.get("track_name")).isEqualTo("Karma Police");
        assertThat(metadata.get("release_name")).isEqualTo("OK Computer");
    }

    @Test
    void submitListen_401_returnsAuthError() {
        wireMock.stubFor(post(urlEqualTo(SUBMIT_PATH))
                .willReturn(aResponse()
                        .withStatus(401)
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"code\":401,\"error\":\"Invalid authorization token.\"}")));

        ScrobbleResult result = service.submitListen(fullTrack(), "bad-token", Instant.ofEpochSecond(1_700_000_000L));

        assertThat(result.success()).isFalse();
        assertThat(result.errorType()).isEqualTo(ErrorType.AUTH_ERROR);
        assertThat(result.isRetryable()).isFalse();
    }

    @Test
    void submitListen_429_returnsClientError() {
        wireMock.stubFor(post(urlEqualTo(SUBMIT_PATH))
                .willReturn(aResponse()
                        .withStatus(429)
                        .withHeader("X-RateLimit-Remaining", "0")
                        .withHeader("X-RateLimit-Reset-In", "30")
                        .withBody("{\"code\":429,\"error\":\"Rate limit exceeded\"}")));

        ScrobbleResult result = service.submitListen(fullTrack(), "lb-token", Instant.ofEpochSecond(1L));

        assertThat(result.success()).isFalse();
    }

    @Test
    void submitListen_503_returnsServerError() {
        wireMock.stubFor(post(urlEqualTo(SUBMIT_PATH))
                .willReturn(aResponse()
                        .withStatus(503)
                        .withBody("<html>Service Unavailable</html>")));

        ScrobbleResult result = service.submitListen(fullTrack(), "lb-token", Instant.ofEpochSecond(1L));

        assertThat(result.success()).isFalse();
        assertThat(result.errorType()).isEqualTo(ErrorType.SERVER_ERROR);
        assertThat(result.isRetryable()).isTrue();
    }

    @Test
    void submitListen_malformedJsonResponse_stillHandlesGracefully() {
        wireMock.stubFor(post(urlEqualTo(SUBMIT_PATH))
                .willReturn(aResponse().withStatus(200).withBody("not-json")));

        ScrobbleResult result = service.submitListen(fullTrack(), "lb-token", Instant.ofEpochSecond(1L));

        assertThat(result.success()).isTrue();
    }

    @Test
    void submitListen_serverClosesConnection_returnsTimeoutError() {
        wireMock.stubFor(post(urlEqualTo(SUBMIT_PATH))
                .willReturn(aResponse().withFault(
                        com.github.tomakehurst.wiremock.http.Fault.CONNECTION_RESET_BY_PEER)));

        ScrobbleResult result = service.submitListen(fullTrack(), "lb-token", Instant.ofEpochSecond(1L));

        assertThat(result.success()).isFalse();
        assertThat(result.errorType()).isEqualTo(ErrorType.TIMEOUT);
        assertThat(result.isRetryable()).isTrue();
    }

    @Test
    void submitListen_unicodeTitleSerializesCorrectly() throws Exception {
        wireMock.stubFor(post(urlEqualTo(SUBMIT_PATH))
                .willReturn(aResponse().withStatus(200).withBody("{\"status\":\"ok\"}")));

        Artist a = new Artist();
        a.setName("Sigur Rós");
        Album alb = new Album();
        alb.setTitle("( )");
        Track t = Track.builder()
                .title("Untitled #4 — Njósnavélin")
                .artist(a)
                .album(alb)
                .build();

        ScrobbleResult result = service.submitListen(t, "lb-token", Instant.ofEpochSecond(1L));
        assertThat(result.success()).isTrue();

        var req = wireMock.findAll(postRequestedFor(urlEqualTo(SUBMIT_PATH))).get(0);
        Map<String, Object> body = new ObjectMapper().readValue(req.getBodyAsString(), Map.class);
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> payload = (List<Map<String, Object>>) body.get("payload");
        @SuppressWarnings("unchecked")
        Map<String, Object> metadata = (Map<String, Object>) payload.get(0).get("track_metadata");
        assertThat(metadata.get("artist_name")).isEqualTo("Sigur Rós");
        assertThat(metadata.get("release_name")).isEqualTo("( )");
        assertThat(metadata.get("track_name")).isEqualTo("Untitled #4 — Njósnavélin");
    }

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
}
