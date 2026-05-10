package com.musicode.config;

import com.musicode.model.entity.Role;
import com.musicode.repository.PlaybackEventRepository;
import com.musicode.repository.PlaylistRepository;
import com.musicode.repository.PlaylistTrackRepository;
import com.musicode.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class AdminSeederTest {

    @Autowired private UserRepository userRepository;
    @Autowired private PlaybackEventRepository playbackEventRepository;
    @Autowired private PlaylistTrackRepository playlistTrackRepository;
    @Autowired private PlaylistRepository playlistRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AdminSeeder adminSeeder;

    @BeforeEach
    void setUp() {
        playbackEventRepository.deleteAll();
        playlistTrackRepository.deleteAll();
        playlistRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void seedsAdminWhenNoAdminExists() {
        // AdminSeeder already ran during context startup, but we cleared the DB
        adminSeeder.run(null);

        var admin = userRepository.findByUsername("admin");
        assertThat(admin).isPresent();
        assertThat(admin.get().getRole()).isEqualTo(Role.ADMIN);
        assertThat(admin.get().isEnabled()).isTrue();
        assertThat(passwordEncoder.matches("changeme", admin.get().getPasswordHash())).isTrue();
    }

    @Test
    void doesNotSeedWhenAdminAlreadyExists() {
        // Seed first admin
        adminSeeder.run(null);
        assertThat(userRepository.count()).isEqualTo(1);

        // Run again — should not create a second admin
        adminSeeder.run(null);
        assertThat(userRepository.count()).isEqualTo(1);
    }

    @Test
    void adminHasBcryptEncodedPassword() {
        adminSeeder.run(null);

        var admin = userRepository.findByUsername("admin").orElseThrow();
        // BCrypt hashes start with $2a$ or $2b$
        assertThat(admin.getPasswordHash()).startsWith("$2a$");
    }
}
