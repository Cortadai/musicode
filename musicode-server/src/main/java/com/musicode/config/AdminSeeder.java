package com.musicode.config;

import com.musicode.model.entity.Role;
import com.musicode.model.entity.User;
import com.musicode.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${musicode.admin.default-password:changeme}")
    private String defaultPassword;

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.existsByRole(Role.ADMIN)) {
            log.debug("Admin user already exists — skipping seed");
            return;
        }

        var admin = User.builder()
                .username("admin")
                .passwordHash(passwordEncoder.encode(defaultPassword))
                .role(Role.ADMIN)
                .enabled(true)
                .build();

        userRepository.save(admin);
        log.info("Admin user 'admin' created");

        if ("changeme".equals(defaultPassword)) {
            log.warn("⚠ Admin is using default password — change it via musicode.admin.default-password");
        }
    }
}
