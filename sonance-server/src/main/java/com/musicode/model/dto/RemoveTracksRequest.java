package com.musicode.model.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record RemoveTracksRequest(
        @NotEmpty List<Long> trackIds
) {}
