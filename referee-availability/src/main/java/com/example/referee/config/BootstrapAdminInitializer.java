package com.example.referee.config;

import com.example.referee.model.AppUser;
import com.example.referee.model.Role;
import com.example.referee.repository.AppUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates the very first ADMIN account when the database has no users at all.
 * Only active when both APP_BOOTSTRAP_ADMIN_EMAIL and APP_BOOTSTRAP_ADMIN_PASSWORD
 * are set — after the admin exists they invite everyone else through the UI.
 */
@Component
@Order(1)
public class BootstrapAdminInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(BootstrapAdminInitializer.class);

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap-admin.email:${APP_BOOTSTRAP_ADMIN_EMAIL:}}")
    private String email;

    @Value("${app.bootstrap-admin.password:${APP_BOOTSTRAP_ADMIN_PASSWORD:}}")
    private String password;

    @Value("${app.bootstrap-admin.name:${APP_BOOTSTRAP_ADMIN_NAME:Board Admin}}")
    private String name;

    public BootstrapAdminInitializer(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return;
        }
        if (userRepository.count() > 0) {
            log.info("Bootstrap admin skipped — user accounts already exist.");
            return;
        }
        AppUser admin = new AppUser();
        admin.setEmail(email.trim());
        admin.setName(name);
        admin.setRole(Role.ADMIN);
        admin.setPasswordHash(passwordEncoder.encode(password));
        userRepository.save(admin);
        log.info("Bootstrap ADMIN account created for {}.", email.trim());
    }
}
