package com.example.referee;

import com.example.referee.domain.*;
import com.example.referee.solver.RefereeConstraintProvider;
import org.optaplanner.core.api.solver.Solver;
import org.optaplanner.core.api.solver.SolverFactory;
import org.optaplanner.core.config.solver.SolverConfig;
import org.optaplanner.core.config.solver.termination.TerminationConfig;
import org.optaplanner.core.api.solver.event.BestSolutionChangedEvent;
import org.optaplanner.core.api.solver.event.SolverEventListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

public class RefereeAssignmentTest {
    private static final AtomicLong assignmentIdCounter = new AtomicLong(1);

    public static void main(String[] args) {
        System.out.println("Creating sample data...");
        RefereeAssignmentSolution solution = createSampleSolution();
        
        System.out.println("Starting solver...");

        // Configure solver
        SolverConfig solverConfig = new SolverConfig()
            .withSolutionClass(RefereeAssignmentSolution.class)
            .withEntityClasses(RefereeAssignment.class)
            .withConstraintProviderClass(RefereeConstraintProvider.class)
            .withTerminationConfig(new TerminationConfig()
                .withSecondsSpentLimit(10L)  // Reduced from 30 seconds to 10
                .withBestScoreLimit("0hard/0soft"));  // Stop when we find a perfect solution

        // Create solver
        SolverFactory<RefereeAssignmentSolution> solverFactory = SolverFactory.create(solverConfig);
        Solver<RefereeAssignmentSolution> solver = solverFactory.buildSolver();

        // Add event listener to show progress
        solver.addEventListener(new SolverEventListener<RefereeAssignmentSolution>() {
            @Override
            public void bestSolutionChanged(BestSolutionChangedEvent<RefereeAssignmentSolution> event) {
                RefereeAssignmentSolution solution = event.getNewBestSolution();
                System.out.printf("Score: %s (after %d ms)%n", 
                    solution.getScore(), 
                    event.getTimeMillisSpent());
            }
        });

        // Solve
        System.out.println("Solving...");
        RefereeAssignmentSolution solvedSolution = solver.solve(solution);
        System.out.println("Solver finished!");

        // Print results
        printSolution(solvedSolution);
    }

    public static RefereeAssignmentSolution createSampleSolution() {
        List<Referee> referees = createSampleReferees();
        List<Game> games = createSampleGames();
        
        RefereeAssignmentSolution solution = new RefereeAssignmentSolution();
        solution.setReferees(referees);
        solution.setGames(games);
        solution.setAssignments(createSampleAssignments(games));
        return solution;
    }

    private static List<Referee> createSampleReferees() {
        List<Referee> referees = new ArrayList<>();
        
        // Experienced referee
        Referee ref1 = new Referee();
        ref1.setId(1L);
        ref1.setName("John Smith");
        ref1.setExperienceLevel(3);
        ref1.setHomeLocation("Downtown");
        ref1.setMaxTravelDistance(50);
        ref1.setAvailability(Arrays.asList(
            new TimeSlot(
                LocalDateTime.now().plusHours(1),
                LocalDateTime.now().plusHours(3),
                true
            ),
            new TimeSlot(
                LocalDateTime.now().plusHours(4),
                LocalDateTime.now().plusHours(6),
                true
            )
        ));
        ref1.setPreferredLocations(Arrays.asList("Downtown", "North Side"));
        ref1.setMaxGamesPerWeek(3);
        referees.add(ref1);

        // Mid-level referee
        Referee ref2 = new Referee();
        ref2.setId(2L);
        ref2.setName("Jane Doe");
        ref2.setExperienceLevel(2);
        ref2.setHomeLocation("North Side");
        ref2.setMaxTravelDistance(30);
        ref2.setAvailability(Arrays.asList(
            new TimeSlot(
                LocalDateTime.now().plusHours(2),
                LocalDateTime.now().plusHours(4),
                true
            ),
            new TimeSlot(
                LocalDateTime.now().plusHours(5),
                LocalDateTime.now().plusHours(7),
                true
            )
        ));
        ref2.setPreferredLocations(Arrays.asList("North Side", "East Side"));
        ref2.setMaxGamesPerWeek(2);
        referees.add(ref2);

        // Junior referee
        Referee ref3 = new Referee();
        ref3.setId(3L);
        ref3.setName("Mike Johnson");
        ref3.setExperienceLevel(1);
        ref3.setHomeLocation("East Side");
        ref3.setMaxTravelDistance(20);
        ref3.setAvailability(Arrays.asList(
            new TimeSlot(
                LocalDateTime.now().plusHours(3),
                LocalDateTime.now().plusHours(5),
                true
            ),
            new TimeSlot(
                LocalDateTime.now().plusHours(6),
                LocalDateTime.now().plusHours(8),
                true
            )
        ));
        ref3.setPreferredLocations(Arrays.asList("East Side", "Downtown"));
        ref3.setMaxGamesPerWeek(2);
        referees.add(ref3);

        return referees;
    }

    private static List<Game> createSampleGames() {
        List<Game> games = new ArrayList<>();
        
        // High-level game
        Game game1 = new Game();
        game1.setId(1L);
        game1.setName("Senior League Final");
        game1.setStartTime(LocalDateTime.now().plusHours(1));
        game1.setEndTime(LocalDateTime.now().plusHours(3));
        game1.setLocation("Downtown");
        game1.setRequiredReferees(3);
        game1.setGameLevel(3);
        games.add(game1);

        // Mid-level game
        Game game2 = new Game();
        game2.setId(2L);
        game2.setName("Youth League Semi-Final");
        game2.setStartTime(LocalDateTime.now().plusHours(4));
        game2.setEndTime(LocalDateTime.now().plusHours(6));
        game2.setLocation("North Side");
        game2.setRequiredReferees(3);
        game2.setGameLevel(2);
        games.add(game2);

        // Junior game
        Game game3 = new Game();
        game3.setId(3L);
        game3.setName("Junior League Quarter-Final");
        game3.setStartTime(LocalDateTime.now().plusHours(2));
        game3.setEndTime(LocalDateTime.now().plusHours(4));
        game3.setLocation("East Side");
        game3.setRequiredReferees(3);
        game3.setGameLevel(1);
        games.add(game3);

        return games;
    }

    private static List<RefereeAssignment> createSampleAssignments(List<Game> games) {
        List<RefereeAssignment> assignments = new ArrayList<>();
        for (Game game : games) {
            RefereeAssignment assignment = new RefereeAssignment(game);
            assignment.setId(assignmentIdCounter.getAndIncrement());
            assignments.add(assignment);
        }
        return assignments;
    }

    private static void printSolution(RefereeAssignmentSolution solution) {
        System.out.println("\n=== Solution Summary ===");
        System.out.println("Final Score: " + solution.getScore());
        System.out.println("\nHard Constraints (-3):");
        System.out.println("- Availability conflicts");
        System.out.println("- Time slot overlaps");
        System.out.println("- Travel distance exceeded");
        
        System.out.println("\nSoft Constraints (8):");
        System.out.println("- Experience level mismatches");
        System.out.println("- Non-preferred locations");
        System.out.println("- Suboptimal travel distances");
        
        System.out.println("\nAssignments:");
        solution.getAssignments().forEach(assignment -> {
            System.out.printf("\nGame: %s (Level %d)%n", 
                assignment.getGame().getName(),
                assignment.getGame().getGameLevel());
            System.out.printf("Time: %s to %s%n",
                assignment.getGame().getStartTime(),
                assignment.getGame().getEndTime());
            System.out.printf("Location: %s%n",
                assignment.getGame().getLocation());
            System.out.printf("Assigned Referee: %s (Experience: %d)%n",
                assignment.getReferee() != null ? assignment.getReferee().getName() : "Unassigned",
                assignment.getReferee() != null ? assignment.getReferee().getExperienceLevel() : 0);
            if (assignment.getReferee() != null) {
                System.out.printf("Referee's Home: %s (Max Travel: %d km)%n",
                    assignment.getReferee().getHomeLocation(),
                    assignment.getReferee().getMaxTravelDistance());
            }
            System.out.println("-------------------");
        });
    }
} 