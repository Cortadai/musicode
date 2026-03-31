package com.musicode.service;

import com.musicode.model.entity.Role;
import com.musicode.model.entity.User;
import com.musicode.repository.PlaybackEventRepository;
import com.musicode.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class MusicodeUserDetailsServiceTest {

    @Autowired private MusicodeUserDetailsService userDetailsService;
    @Autowired private UserRepository userRepository;
    @Autowired private PlaybackEventRepository playbackEventRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        playbackEventRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void loadUserByUsername_admin() {
        userRepository.save(User.builder()
                .username("admin")
                .passwordHash(passwordEncoder.encode("secret"))
                .role(Role.ADMIN)
                .build());

        var userDetails = userDetailsService.loadUserByUsername("admin");

        assertThat(userDetails.getUsername()).isEqualTo("admin");
        assertThat(userDetails.getAuthorities())
                .extracting("authority")
                .containsExactly("ROLE_ADMIN");
        assertThat(userDetails.isEnabled()).isTrue();
        assertThat(passwordEncoder.matches("secret", userDetails.getPassword())).isTrue();
    }

    @Test
    void loadUserByUsername_listener() {
        userRepository.save(User.builder()
                .username("listener")
                .passwordHash(passwordEncoder.encode("pass"))
                .role(Role.LISTENER)
                .build());

        var userDetails = userDetailsService.loadUserByUsername("listener");

        assertThat(userDetails.getAuthorities())
                .extracting("authority")
                .containsExactly("ROLE_LISTENER");
    }

    @Test
    void loadUserByUsername_notFound() {
        assertThatThrownBy(() -> userDetailsService.loadUserByUsername("ghost"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("ghost");
    }

    @Test
    void loadUserByUsername_disabledUser() {
        userRepository.save(User.builder()
                .username("disabled")
                .passwordHash(passwordEncoder.encode("pass"))
                .role(Role.LISTENER)
                .enabled(false)
                .build());

        var userDetails = userDetailsService.loadUserByUsername("disabled");
        assertThat(userDetails.isEnabled()).isFalse();
    }
}
