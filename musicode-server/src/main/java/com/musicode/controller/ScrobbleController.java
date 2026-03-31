package com.musicode.controller;

import com.musicode.exception.BadRequestException;
import com.musicode.exception.ResourceNotFoundException;
import com.musicode.model.dto.ScrobbleSettingsRequest;
import com.musicode.model.dto.ScrobbleSettingsResponse;
import com.musicode.repository.UserRepository;
import com.musicode.service.LastfmService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/scrobble")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Scrobble", description = "Scrobbling service configuration (Last.fm, ListenBrainz)")
public class ScrobbleController {

    private final UserRepository userRepository;
    private final LastfmService lastfmService;

    @GetMapping("/settings")
    @Operation(summary = "Get scrobble settings", description = "Returns which scrobble services are connected for the current user.")
    public ScrobbleSettingsResponse getSettings(Principal principal) {
        var user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getName()));
        return ScrobbleSettingsResponse.from(user);
    }

    @PutMapping("/settings")
    @Operation(summary = "Update scrobble settings", description = "Connect or disconnect scrobble services. "
            + "For ListenBrainz, provide the user token. For Last.fm, provide username+password to authenticate.")
    public ScrobbleSettingsResponse updateSettings(
            @RequestBody ScrobbleSettingsRequest request,
            Principal principal) {

        var user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getName()));

        // ListenBrainz — simple token
        if (request.listenbrainzToken() != null) {
            if (request.listenbrainzToken().isBlank()) {
                user.setListenbrainzToken(null);
                log.info("User '{}' disconnected ListenBrainz", user.getUsername());
            } else {
                user.setListenbrainzToken(request.listenbrainzToken().trim());
                log.info("User '{}' connected ListenBrainz", user.getUsername());
            }
        }

        // Last.fm — authenticate with username+password to get session key
        if (request.lastfmUsername() != null && request.lastfmPassword() != null) {
            if (request.lastfmUsername().isBlank()) {
                user.setLastfmSessionKey(null);
                log.info("User '{}' disconnected Last.fm", user.getUsername());
            } else {
                var sessionKey = lastfmService.authenticate(
                        request.lastfmUsername(), request.lastfmPassword());
                if (sessionKey == null) {
                    throw new BadRequestException("Last.fm authentication failed. Check credentials and API key.");
                }
                user.setLastfmSessionKey(sessionKey);
                log.info("User '{}' connected Last.fm as '{}'", user.getUsername(), request.lastfmUsername());
            }
        }

        userRepository.save(user);
        return ScrobbleSettingsResponse.from(user);
    }

    @DeleteMapping("/settings/lastfm")
    @Operation(summary = "Disconnect Last.fm", description = "Remove Last.fm session key.")
    public ScrobbleSettingsResponse disconnectLastfm(Principal principal) {
        var user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getName()));
        user.setLastfmSessionKey(null);
        userRepository.save(user);
        log.info("User '{}' disconnected Last.fm", user.getUsername());
        return ScrobbleSettingsResponse.from(user);
    }

    @DeleteMapping("/settings/listenbrainz")
    @Operation(summary = "Disconnect ListenBrainz", description = "Remove ListenBrainz token.")
    public ScrobbleSettingsResponse disconnectListenBrainz(Principal principal) {
        var user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getName()));
        user.setListenbrainzToken(null);
        userRepository.save(user);
        log.info("User '{}' disconnected ListenBrainz", user.getUsername());
        return ScrobbleSettingsResponse.from(user);
    }
}
