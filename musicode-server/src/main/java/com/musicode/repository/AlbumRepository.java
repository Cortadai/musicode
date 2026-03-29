package com.musicode.repository;

import com.musicode.model.entity.Album;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlbumRepository extends JpaRepository<Album, Long> {

    Optional<Album> findByTitleIgnoreCaseAndArtistId(String title, Long artistId);
}
