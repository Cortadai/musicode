package com.musicode.repository;

import com.musicode.model.entity.Role;
import com.musicode.model.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void saveAndFindByUsername() {
        var user = User.builder()
                .username("alice")
                .passwordHash("hashed")
                .role(Role.LISTENER)
                .build();
        userRepository.save(user);

        var found = userRepository.findByUsername("alice");
        assertThat(found).isPresent();
        assertThat(found.get().getRole()).isEqualTo(Role.LISTENER);
        assertThat(found.get().isEnabled()).isTrue();
        assertThat(found.get().getCreatedAt()).isNotNull();
    }

    @Test
    void findByUsername_notFound() {
        var found = userRepository.findByUsername("nonexistent");
        assertThat(found).isEmpty();
    }

    @Test
    void uniqueConstraintOnUsername() {
        userRepository.save(User.builder()
                .username("bob")
                .passwordHash("hash1")
                .role(Role.LISTENER)
                .build());

        assertThatThrownBy(() -> {
            userRepository.save(User.builder()
                    .username("bob")
                    .passwordHash("hash2")
                    .role(Role.ADMIN)
                    .build());
            userRepository.flush();
        }).isInstanceOf(Exception.class);
    }

    @Test
    void existsByRole() {
        assertThat(userRepository.existsByRole(Role.ADMIN)).isFalse();

        userRepository.save(User.builder()
                .username("admin")
                .passwordHash("hashed")
                .role(Role.ADMIN)
                .build());

        assertThat(userRepository.existsByRole(Role.ADMIN)).isTrue();
        assertThat(userRepository.existsByRole(Role.LISTENER)).isFalse();
    }

    @Test
    void existsByUsername() {
        assertThat(userRepository.existsByUsername("charlie")).isFalse();

        userRepository.save(User.builder()
                .username("charlie")
                .passwordHash("hashed")
                .role(Role.LISTENER)
                .build());

        assertThat(userRepository.existsByUsername("charlie")).isTrue();
    }
}
