package com.musicode.filter;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class LoginRateLimitFilterTest {

    private LoginRateLimitFilter filter;
    private FilterChain chain;

    @BeforeEach
    void setUp() {
        filter = new LoginRateLimitFilter(5, 60);
        chain = mock(FilterChain.class);
    }

    @Test
    void allowsRequestsUnderLimit() throws Exception {
        for (int i = 0; i < 5; i++) {
            var request = loginRequest("192.168.1.1");
            var response = new MockHttpServletResponse();
            filter.doFilter(request, response, chain);
            assertThat(response.getStatus()).isEqualTo(200);
        }
        verify(chain, times(5)).doFilter(any(), any());
    }

    @Test
    void blocksAfterExceedingLimit() throws Exception {
        // Exhaust the 5-attempt limit
        for (int i = 0; i < 5; i++) {
            filter.doFilter(loginRequest("10.0.0.1"), new MockHttpServletResponse(), chain);
        }

        // 6th attempt should be blocked
        var response = new MockHttpServletResponse();
        filter.doFilter(loginRequest("10.0.0.1"), response, chain);

        assertThat(response.getStatus()).isEqualTo(429);
        assertThat(response.getContentAsString()).contains("Too many login attempts");
        assertThat(response.getHeader("Retry-After")).isEqualTo("60");
        verify(chain, times(5)).doFilter(any(), any()); // only 5, not 6
    }

    @Test
    void differentIpsHaveSeparateLimits() throws Exception {
        // Exhaust IP A
        for (int i = 0; i < 5; i++) {
            filter.doFilter(loginRequest("10.0.0.1"), new MockHttpServletResponse(), chain);
        }

        // IP B should still be allowed
        var response = new MockHttpServletResponse();
        filter.doFilter(loginRequest("10.0.0.2"), response, chain);
        assertThat(response.getStatus()).isEqualTo(200);
    }

    @Test
    void skipsNonLoginPaths() throws Exception {
        var request = new MockHttpServletRequest("POST", "/api/albums");
        request.setServletPath("/api/albums");
        var response = new MockHttpServletResponse();

        filter.doFilter(request, response, chain);
        assertThat(response.getStatus()).isEqualTo(200);
    }

    @Test
    void skipsGetRequests() throws Exception {
        var request = new MockHttpServletRequest("GET", "/api/auth/login");
        request.setServletPath("/api/auth/login");
        var response = new MockHttpServletResponse();

        filter.doFilter(request, response, chain);
        assertThat(response.getStatus()).isEqualTo(200);
    }

    @Test
    void usesXForwardedForWhenPresent() throws Exception {
        // Exhaust limit using forwarded IP
        for (int i = 0; i < 5; i++) {
            var req = loginRequest("127.0.0.1");
            req.addHeader("X-Forwarded-For", "203.0.113.50, 10.0.0.1");
            filter.doFilter(req, new MockHttpServletResponse(), chain);
        }

        // Same forwarded IP → blocked
        var req = loginRequest("127.0.0.1");
        req.addHeader("X-Forwarded-For", "203.0.113.50, 10.0.0.1");
        var response = new MockHttpServletResponse();
        filter.doFilter(req, response, chain);
        assertThat(response.getStatus()).isEqualTo(429);

        // Different forwarded IP → allowed
        var req2 = loginRequest("127.0.0.1");
        req2.addHeader("X-Forwarded-For", "198.51.100.1");
        var response2 = new MockHttpServletResponse();
        filter.doFilter(req2, response2, chain);
        assertThat(response2.getStatus()).isEqualTo(200);
    }

    private MockHttpServletRequest loginRequest(String remoteAddr) {
        var request = new MockHttpServletRequest("POST", "/api/auth/login");
        request.setServletPath("/api/auth/login");
        request.setRemoteAddr(remoteAddr);
        return request;
    }
}
