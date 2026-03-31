package com.musicode.model.dto;

import com.musicode.model.entity.Album;
import com.musicode.model.entity.Artist;
import com.musicode.model.entity.Track;

import java.util.List;

public record SearchResults(
        List<Track> tracks,
        List<Album> albums,
        List<Artist> artists
) {}
