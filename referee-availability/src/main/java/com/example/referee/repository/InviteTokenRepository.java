package com.example.referee.repository;

import com.example.referee.model.InviteToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InviteTokenRepository extends JpaRepository<InviteToken, Long> {
    Optional<InviteToken> findByToken(String token);
    List<InviteToken> findByEmailIgnoreCaseAndUsedAtIsNull(String email);
    List<InviteToken> findByUsedAtIsNull();
}
