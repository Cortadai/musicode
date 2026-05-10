package com.musicode.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI 3.0 configuration for Sonance.
 *
 * AUTH NOTE: Sonance uses HttpOnly cookies for authentication, not Bearer tokens.
 * Swagger UI sends cookies automatically for same-origin requests, so try-it-out
 * works after logging in via POST /api/auth/login. We define a cookieAuth security
 * scheme for documentation purposes — it tells API consumers that endpoints require
 * an authenticated session via cookies.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI sonanceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Sonance API")
                        .description("""
                                Personal music player REST API. Scan local audio folders, \
                                browse by album/artist/track, stream audio with HTTP Range \
                                support, and manage users.
                                
                                **Authentication:** POST to `/api/auth/login` with username \
                                and password. The server sets HttpOnly cookies — subsequent \
                                requests are authenticated automatically. Use Swagger UI's \
                                "Try it out" on the login endpoint first, then all other \
                                endpoints will work.""")
                        .version("0.1.0")
                        .contact(new Contact()
                                .name("Sonance")))
                .components(new Components()
                        .addSecuritySchemes("cookieAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.COOKIE)
                                .name("access_token")
                                .description("JWT access token in HttpOnly cookie. "
                                        + "Obtained via POST /api/auth/login.")))
                .addSecurityItem(new SecurityRequirement().addList("cookieAuth"));
    }
}
