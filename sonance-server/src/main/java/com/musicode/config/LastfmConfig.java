package com.musicode.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Last.fm API credentials — configured per application, not per user.
 * Users authenticate individually via auth.getMobileSession to get a session key.
 */
@Configuration
@ConfigurationProperties(prefix = "sonance.lastfm")
@Getter @Setter
public class LastfmConfig {
    private String apiKey = "";
    private String apiSecret = "";
}
