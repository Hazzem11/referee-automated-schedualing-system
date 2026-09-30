package com.example.referee.repository;

import com.example.referee.model.Referee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefereeRepository extends JpaRepository<Referee, Long> {

    Optional<Referee> findByNameIgnoreCase(String name);
}
