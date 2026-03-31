package com.musicode.controller;

import com.musicode.model.dto.ActivityEvent;
import com.musicode.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
@Tag(name = "Activity", description = "Real-time listening activity feed")
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Activity stream (SSE)", description = "Server-Sent Events stream of play events. "
            + "Events have name 'play' and data is an ActivityEvent JSON object.")
    public SseEmitter stream() {
        return activityService.subscribe();
    }

    @GetMapping("/recent")
    @Operation(summary = "Recent activity", description = "Last 20 play events for clients that connect late.")
    public List<ActivityEvent> recent() {
        return activityService.getRecent();
    }
}
