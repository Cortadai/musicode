package com.musicode.model.dto;

import java.time.LocalDate;

public record DailyPlayCount(LocalDate date, long count) {}
