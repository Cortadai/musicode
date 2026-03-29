package com.musicode.repository;

import com.musicode.model.entity.Track;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrackRepository extends JpaRepository<Track, Long> {

    Optional<Track> findByFilePath(String filePath);

    boolean existsByFilePath(String filePath);
}
