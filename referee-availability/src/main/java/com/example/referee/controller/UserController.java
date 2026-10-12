package com.example.referee.controller;

import com.example.referee.model.AppUser;
import com.example.referee.model.InviteToken;
import com.example.referee.model.Role;
import com.example.referee.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<Map<String, Object>> listUsers() {
        return userService.listUsers().stream().map(UserController::userBody).collect(Collectors.toList());
    }

    @GetMapping("/invites")
    public List<Map<String, Object>> listInvites() {
        return userService.listPendingInvites().stream().map(UserController::inviteBody).collect(Collectors.toList());
    }

    @PostMapping("/invite")
    public ResponseEntity<?> invite(@RequestBody Map<String, Object> payload, Authentication authentication) {
        try {
            Role role = Role.valueOf(String.valueOf(payload.getOrDefault("role", "")));
            if (!mayInvite(role, authentication)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only an admin can invite " + role + " accounts."));
            }
            Long refereeId = payload.get("refereeId") != null
                ? Long.valueOf(String.valueOf(payload.get("refereeId")))
                : null;
            InviteToken invite = userService.invite(
                String.valueOf(payload.getOrDefault("email", "")),
                String.valueOf(payload.getOrDefault("name", "")),
                role,
                refereeId);
            return ResponseEntity.ok(inviteBody(invite));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/invites/{id}/resend")
    public ResponseEntity<?> resendInvite(@PathVariable Long id) {
        try {
            userService.resendInvite(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/invites/{id}")
    public ResponseEntity<?> deleteInvite(@PathVariable Long id) {
        userService.deleteInvite(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Only an admin can delete accounts."));
        }
        try {
            userService.deleteUser(id, authentication.getName());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** Assigners may invite referees and coaches; elevating to admin/assigner requires an admin. */
    private static boolean mayInvite(Role role, Authentication authentication) {
        if (role == Role.REFEREE || role == Role.REFEREE_COACH) {
            return true;
        }
        return isAdmin(authentication);
    }

    private static boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch("ROLE_ADMIN"::equals);
    }

    private static Map<String, Object> userBody(AppUser user) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("id", user.getId());
        body.put("email", user.getEmail());
        body.put("name", user.getName());
        body.put("role", user.getRole().name());
        body.put("refereeId", user.getRefereeId());
        body.put("active", user.getPasswordHash() != null);
        body.put("createdAt", user.getCreatedAt());
        return body;
    }

    private static Map<String, Object> inviteBody(InviteToken invite) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("id", invite.getId());
        body.put("email", invite.getEmail());
        body.put("name", invite.getName());
        body.put("role", invite.getRole().name());
        body.put("expiresAt", invite.getExpiresAt());
        body.put("expired", !invite.isUsable());
        return body;
    }
}
