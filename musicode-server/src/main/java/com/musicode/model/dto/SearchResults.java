package com.musicode.model.dto;

import com.musicode.model.entity.Album;
import com.musicode.model.entity.Artist;
import com.musicode.model.entity.Track;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResults {
    private List<Track> tracks;
    private List<Album> albums;
    private List<Artist> artists;
}
