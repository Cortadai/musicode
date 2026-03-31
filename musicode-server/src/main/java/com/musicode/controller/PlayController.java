package com.musicode.controller;

import com.musicode.exception.ResourceNotFoundException;
import com.musicode.model.entity.PlaybackEvent;
import com.musicode.repository.PlaybackEventRepository;
import com.musicode.repository.TrackRepository;
import com.musicode.repository.UserRepository;
import com.musicode.service.ScrobbleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/plays")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Playback", description = "Record track play events")
public class PlayController {

    private final PlaybackEventRepository playbackEventRepository;
    private final TrackRepository trackRepository;
    private final UserRepository userRepository;
    private final ScrobbleService scrobbleService;

    @PostMapping("/{trackId}")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Record a play", description = "Record that the authenticated user played a track. "
            + "Called by the frontend when playback passes 50% of track duration.")
    public Map<String, Object> recordPlay(
            @PathVariable Long trackId,
            @RequestBody(required = false) Map<String, Integer> body,
            Principal principal) {

        var track = trackRepository.findById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("Track", trackId));
        var user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getName()));

        Integer listenDuration = (body != null) ? body.get("listenDurationSec") : null;

        var event = PlaybackEvent.builder()
                .user(user)
                .track(track)
                .listenDurationSec(listenDuration)
                .build();

        event = playbackEventRepository.save(event);
        log.debug("Recorded play: user='{}' track='{}' (id={})", principal.getName(), track.getTitle(), track.getId());

        // Fire-and-forget scrobble to configured services (async)
        scrobbleService.scrobble(event);

        return Map.of(
                "id", event.getId(),
                "trackId", trackId,
                "playedAt", event.getPlayedAt().toString()
        );
    }
}
