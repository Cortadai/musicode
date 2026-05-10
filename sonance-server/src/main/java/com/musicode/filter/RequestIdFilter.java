package com.musicode.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Adds a unique requestId to every HTTP request via SLF4J MDC (Mapped Diagnostic Context).
 *
 * WHY: When multiple requests hit concurrently, log lines interleave. Without a request ID,
 * you can't tell which log lines belong to which request. MDC makes every log line from
 * the same request share a common ID — grep for it and you get the full request trace.
 *
 * Runs before all other filters (@Order HIGHEST_PRECEDENCE) so that security filters,
 * auth filters, and controller code all have the requestId available.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestIdFilter extends OncePerRequestFilter {

    public static final String REQUEST_ID_KEY = "requestId";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        var requestId = UUID.randomUUID().toString().substring(0, 8);
        MDC.put(REQUEST_ID_KEY, requestId);
        response.setHeader("X-Request-Id", requestId);

        try {
            filterChain.doFilter(request, response);
        } finally {
            // Always clear MDC to prevent leaking into thread-pool-reused threads
            MDC.remove(REQUEST_ID_KEY);
        }
    }
}
