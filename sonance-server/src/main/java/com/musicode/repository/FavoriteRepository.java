package com.musicode.repository;

import com.musicode.model.entity.Favorite;
import com.musicode.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Optional<Favorite> findByUserAndTrackId(User user, Long trackId);

    boolean existsByUserAndTrackId(User user, Long trackId);

    @Query("SELECT f.track.id FROM Favorite f WHERE f.user = :user")
    Set<Long> findTrackIdsByUser(User user);

    Page<Favorite> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    long countByUser(User user);

    void deleteByTrackIdIn(Collection<Long> trackIds);
}
