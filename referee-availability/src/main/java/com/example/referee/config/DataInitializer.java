package com.example.referee.config;

import com.example.referee.model.Game;
import com.example.referee.model.Referee;
import com.example.referee.repository.GameRepository;
import com.example.referee.repository.RefereeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private RefereeRepository refereeRepository;

    @Override
    public void run(String... args) {
        // Create test referees
        Referee referee1 = new Referee();
        referee1.setName("John Doe");
        referee1.setExperienceLevel(3);
        referee1.setAvailable(true);

        Referee referee2 = new Referee();
        referee2.setName("Jane Smith");
        referee2.setExperienceLevel(2);
        referee2.setAvailable(true);

        Referee referee3 = new Referee();
        referee3.setName("Mike Johnson");
        referee3.setExperienceLevel(1);
        referee3.setAvailable(true);

        refereeRepository.saveAll(Arrays.asList(referee1, referee2, referee3));

        // Create test games
        Game game1 = new Game();
        game1.setName("Championship Final");
        game1.setStartTime(LocalDateTime.now().plusDays(1));
        game1.setLevel("PRO");
        game1.setRequiredExperienceLevel(3);
        game1.setAssignedReferees(Arrays.asList(referee1, referee2));

        Game game2 = new Game();
        game2.setName("Semi-Final");
        game2.setStartTime(LocalDateTime.now().plusDays(2));
        game2.setLevel("INTERMEDIATE");
        game2.setRequiredExperienceLevel(2);
        game2.setAssignedReferees(Arrays.asList(referee2, referee3));

        gameRepository.saveAll(Arrays.asList(game1, game2));
    }
} 