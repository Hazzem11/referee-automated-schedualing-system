package com.example.referee.controller;

import com.example.referee.model.AppUser;
import com.example.referee.service.AppUserDetailsService.AppUserDetails;
import com.example.referee.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    @Value("${app.demo:false}")
    private boolean demo;

    public AuthController(AuthenticationManager authenticationManager, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    /** Public: tells the login page whether to show demo credentials. */
    @GetMapping("/config")
    public Map<String, Object> config() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("demo", demo);
        return body;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
        String email = credentials.getOrDefault("email", "").trim();
        String password = credentials.getOrDefault("password", "");
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
            SecurityContextHolder.getContext().setAuthentication(auth);
            // Bind the security context to a session so subsequent requests are authenticated.
            request.getSession(true);
            AppUser user = ((AppUserDetails) auth.getPrincipal()).getAppUser();
            return ResponseEntity.ok(userBody(user));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid email or password."));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
            || !(authentication.getPrincipal() instanceof AppUserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        AppUser user = ((AppUserDetails) authentication.getPrincipal()).getAppUser();
        return ResponseEntity.ok(userBody(user));
    }

    /** Public: pre-fill the accept-invite page. */
    @GetMapping("/invite-info")
    public ResponseEntity<?> inviteInfo(@RequestParam String token) {
        return userService.findUsableInvite(token)
            .<ResponseEntity<?>>map(invite -> ResponseEntity.ok(Map.of(
                "email", invite.getEmail(),
                "name", invite.getName(),
                "role", invite.getRole().name())))
            .orElseGet(() -> ResponseEntity.status(HttpStatus.GONE)
                .body(Map.of("error", "This invite link is invalid or has expired.")));
    }

    @PostMapping("/accept-invite")
    public ResponseEntity<?> acceptInvite(@RequestBody Map<String, String> payload) {
        try {
            AppUser user = userService.acceptInvite(payload.get("token"), payload.get("password"));
            return ResponseEntity.ok(userBody(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private Map<String, Object> userBody(AppUser user) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("id", user.getId());
        body.put("email", user.getEmail());
        body.put("name", user.getName());
        body.put("role", user.getRole().name());
        body.put("refereeId", user.getRefereeId());
        return body;
    }
}
