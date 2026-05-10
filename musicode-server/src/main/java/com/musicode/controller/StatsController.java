package com.musicode.controller;

import com.musicode.exception.ResourceNotFoundException;
import com.musicode.model.dto.*;
import com.musicode.repository.UserRepository;
import com.musicode.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Tag(name = "Stats", description = "Listening statistics per user")
public class StatsController {

    private final StatsService statsService;
    private final UserRepository userRepository;

    @GetMapping("/recent-plays")
    @Operation(summary = "Recent plays", description = "Most recent play events for the authenticated user.")
    public List<RecentPlay> recentPlays(
            Principal principal,
            @RequestParam(defaultValue = "20") int limit) {
        return statsService.getRecentPlays(resolveUser(principal.getName()), limit);
    }

    @GetMapping("/top-artists")
    @Operation(summary = "Top artists", description = "Most-played artists ranked by play count.")
    public List<TopArtistStat> topArtists(
            Principal principal,
            @Parameter(description = "Time period: week, month, year, all")
            @RequestParam(defaultValue = "month") String period,
            @RequestParam(defaultValue = "10") int limit) {
        return statsService.getTopArtists(resolveUser(principal.getName()), period, limit);
    }

    @GetMapping("/top-albums")
    @Operation(summary = "Top albums", description = "Most-played albums ranked by play count.")
    public List<TopAlbumStat> topAlbums(
            Principal principal,
            @RequestParam(defaultValue = "month") String period,
            @RequestParam(defaultValue = "10") int limit) {
        return statsService.getTopAlbums(resolveUser(principal.getName()), period, limit);
    }

    @GetMapping("/top-tracks")
    @Operation(summary = "Top tracks", description = "Most-played tracks ranked by play count.")
    public List<TopTrackStat> topTracks(
            Principal principal,
            @RequestParam(defaultValue = "month") String period,
            @RequestParam(defaultValue = "10") int limit) {
        return statsService.getTopTracks(resolveUser(principal.getName()), period, limit);
    }

    @GetMapping("/summary")
    @Operation(summary = "Listening summary", description = "Total plays, listening time, unique artists and albums.")
    public StatsSummary summary(
            Principal principal,
            @RequestParam(defaultValue = "month") String period) {
        return statsService.getSummary(resolveUser(principal.getName()), period);
    }

    @GetMapping("/history")
    @Operation(summary = "Daily play history", description = "Play count per day for charting.")
    public List<DailyPlayCount> history(
            Principal principal,
            @RequestParam(defaultValue = "month") String period) {
        return statsService.getHistory(resolveUser(principal.getName()), period);
    }

    private com.musicode.model.entity.User resolveUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", username));
    }
}
