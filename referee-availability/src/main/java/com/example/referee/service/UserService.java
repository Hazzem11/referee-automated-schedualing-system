package com.example.referee.service;

import com.example.referee.model.AppUser;
import com.example.referee.model.InviteToken;
import com.example.referee.model.Referee;
import com.example.referee.model.Role;
import com.example.referee.repository.AppUserRepository;
import com.example.referee.repository.InviteTokenRepository;
import com.example.referee.repository.RefereeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private static final int INVITE_VALID_DAYS = 7;
    private static final int MIN_PASSWORD_LENGTH = 8;

    private final AppUserRepository userRepository;
    private final InviteTokenRepository inviteRepository;
    private final RefereeRepository refereeRepository;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    public UserService(AppUserRepository userRepository, InviteTokenRepository inviteRepository,
                       RefereeRepository refereeRepository, NotificationService notificationService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.inviteRepository = inviteRepository;
        this.refereeRepository = refereeRepository;
        this.notificationService = notificationService;
        this.passwordEncoder = passwordEncoder;
    }

    public List<AppUser> listUsers() {
        return userRepository.findAll();
    }

    public List<InviteToken> listPendingInvites() {
        return inviteRepository.findByUsedAtIsNull();
    }

    /** Create a single-use invite and email the link. Throws IllegalArgumentException on bad input. */
    @Transactional
    public InviteToken invite(String email, String name, Role role, Long refereeId) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name is required.");
        }
        if (role == null) {
            throw new IllegalArgumentException("Role is required.");
        }
        String cleanEmail = email.trim();
        if (userRepository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new IllegalArgumentException("An account already exists for " + cleanEmail);
        }
        // One live invite per email: supersede any earlier ones.
        for (InviteToken old : inviteRepository.findByEmailIgnoreCaseAndUsedAtIsNull(cleanEmail)) {
            inviteRepository.delete(old);
        }

        InviteToken invite = new InviteToken();
        invite.setToken(UUID.randomUUID().toString().replace("-", ""));
        invite.setEmail(cleanEmail);
        invite.setName(name.trim());
        invite.setRole(role);
        invite.setRefereeId(refereeId);
        invite.setExpiresAt(LocalDateTime.now().plusDays(INVITE_VALID_DAYS));
        InviteToken saved = inviteRepository.save(invite);

        notificationService.sendInviteEmail(cleanEmail, name.trim(), inviteUrl(saved.getToken()), role);
        return saved;
    }

    public Optional<InviteToken> findUsableInvite(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        return inviteRepository.findByToken(token.trim()).filter(InviteToken::isUsable);
    }

    /** Activate the account from an invite: creates the user with a bcrypt-hashed password. */
    @Transactional
    public AppUser acceptInvite(String token, String password) {
        InviteToken invite = findUsableInvite(token)
            .orElseThrow(() -> new IllegalArgumentException("This invite link is invalid or has expired."));
        if (password == null || password.length() < MIN_PASSWORD_LENGTH) {
            throw new IllegalArgumentException("Password must be at least " + MIN_PASSWORD_LENGTH + " characters.");
        }
        if (userRepository.existsByEmailIgnoreCase(invite.getEmail())) {
            throw new IllegalArgumentException("An account already exists for " + invite.getEmail());
        }

        AppUser user = new AppUser();
        user.setEmail(invite.getEmail());
        user.setName(invite.getName());
        user.setRole(invite.getRole());
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRefereeId(resolveRefereeLink(invite));
        AppUser saved = userRepository.save(user);

        invite.setUsedAt(LocalDateTime.now());
        inviteRepository.save(invite);
        return saved;
    }

    /** Explicit referee link from the invite, otherwise auto-link by matching referee email. */
    private Long resolveRefereeLink(InviteToken invite) {
        if (invite.getRefereeId() != null) {
            return invite.getRefereeId();
        }
        return refereeRepository.findAll().stream()
            .filter(r -> invite.getEmail().equalsIgnoreCase(r.getEmail()))
            .findFirst()
            .map(Referee::getId)
            .orElse(null);
    }

    @Transactional
    public void resendInvite(Long inviteId) {
        InviteToken old = inviteRepository.findById(inviteId)
            .orElseThrow(() -> new IllegalArgumentException("Invite not found."));
        invite(old.getEmail(), old.getName(), old.getRole(), old.getRefereeId());
    }

    @Transactional
    public void deleteInvite(Long inviteId) {
        inviteRepository.deleteById(inviteId);
    }

    @Transactional
    public void deleteUser(Long userId, String actingEmail) {
        AppUser user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found."));
        if (user.getEmail().equalsIgnoreCase(actingEmail)) {
            throw new IllegalArgumentException("You cannot delete your own account.");
        }
        userRepository.delete(user);
    }

    private String inviteUrl(String token) {
        return baseUrl + "/accept-invite?token=" + token;
    }
}
