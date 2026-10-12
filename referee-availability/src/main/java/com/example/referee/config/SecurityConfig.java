package com.example.referee.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import javax.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Session cookie is SameSite=Lax and the API is JSON-only, so classic CSRF
            // form-post attacks don't apply; no state-changing endpoint accepts form data.
            .csrf().disable()
            // H2 console (demo profile only) renders in a frame.
            .headers().frameOptions().sameOrigin()
            .and()
            .authorizeRequests(auth -> auth
                .antMatchers(
                    "/api/auth/login",
                    "/api/auth/config",
                    "/api/auth/invite-info",
                    "/api/auth/accept-invite"
                ).permitAll()
                .antMatchers("/h2-console/**").permitAll()
                .antMatchers("/api/users/**").hasAnyRole("ADMIN", "GAME_ASSIGNER")
                .antMatchers(HttpMethod.GET, "/api/**").authenticated()
                .antMatchers("/api/**").hasAnyRole("ADMIN", "GAME_ASSIGNER")
                .anyRequest().permitAll()
            )
            // Return 401/403 as status codes instead of redirecting to a form login page.
            .exceptionHandling(handling -> handling
                .authenticationEntryPoint((request, response, ex) ->
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED))
                .accessDeniedHandler((request, response, ex) ->
                    response.sendError(HttpServletResponse.SC_FORBIDDEN))
            )
            .logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .logoutSuccessHandler((request, response, authentication) ->
                    response.setStatus(HttpStatus.OK.value()))
            );
        return http.build();
    }
}
