package com.musicode.repository;

import com.musicode.model.entity.Playlist;
import com.musicode.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    List<Playlist> findByUserOrderByUpdatedAtDesc(User user);

    Optional<Playlist> findByIdAndUser(Long id, User user);

    long countByUser(User user);
}
