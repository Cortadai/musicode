package com.musicode.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC configuration.
 * CORS is handled by SecurityConfig's CorsConfigurationSource — not here.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    // CORS moved to SecurityConfig to ensure it's processed before the security filter chain
}
