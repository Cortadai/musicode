package com.musicode.controller;

import com.musicode.model.dto.HealthIssue;
import com.musicode.model.dto.HealthIssueType;
import com.musicode.model.dto.HealthSummary;
import com.musicode.service.LibraryHealthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/library/health")
@RequiredArgsConstructor
@Tag(name = "Library Health", description = "Library metadata quality analysis")
public class LibraryHealthController {

    private final LibraryHealthService libraryHealthService;

    @GetMapping("/summary")
    @Operation(summary = "Health summary", description = "Issue counts per type across the entire library.")
    public HealthSummary summary() {
        return libraryHealthService.getSummary();
    }

    @GetMapping("/issues")
    @Operation(summary = "Health issues", description = "Paginated list of issues filtered by type.")
    public Page<HealthIssue> issues(
            @RequestParam HealthIssueType type,
            @PageableDefault(size = 50) Pageable pageable) {
        return libraryHealthService.getIssues(type, pageable);
    }
}
