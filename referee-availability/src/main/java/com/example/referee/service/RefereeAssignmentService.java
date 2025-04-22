package com.example.referee.service;

import com.example.referee.RefereeAssignmentTest;
import com.example.referee.domain.Game;
import com.example.referee.domain.Referee;
import com.example.referee.domain.RefereeAssignment;
import com.example.referee.domain.RefereeAssignmentSolution;
import com.example.referee.solver.RefereeConstraintProvider;
import org.optaplanner.core.api.solver.Solver;
import org.optaplanner.core.api.solver.SolverFactory;
import org.optaplanner.core.config.solver.SolverConfig;
import org.optaplanner.core.config.solver.termination.TerminationConfig;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class RefereeAssignmentService {
    private final AtomicReference<RefereeAssignmentSolution> currentSolution = new AtomicReference<>();

    public RefereeAssignmentSolution solve() {
        // Create initial solution
        RefereeAssignmentSolution solution = createInitialSolution();
        
        // Configure solver
        SolverConfig solverConfig = new SolverConfig()
            .withSolutionClass(RefereeAssignmentSolution.class)
            .withEntityClasses(RefereeAssignment.class)
            .withConstraintProviderClass(RefereeConstraintProvider.class)
            .withTerminationConfig(new TerminationConfig()
                .withSecondsSpentLimit(10L)
                .withBestScoreLimit("0hard/0soft"));

        // Create and run solver
        SolverFactory<RefereeAssignmentSolution> solverFactory = SolverFactory.create(solverConfig);
        Solver<RefereeAssignmentSolution> solver = solverFactory.buildSolver();
        RefereeAssignmentSolution solvedSolution = solver.solve(solution);
        
        // Store the solution
        currentSolution.set(solvedSolution);
        return solvedSolution;
    }

    public RefereeAssignmentSolution getCurrentSolution() {
        return currentSolution.get();
    }

    private RefereeAssignmentSolution createInitialSolution() {
        // TODO: Replace with actual data from database
        return RefereeAssignmentTest.createSampleSolution();
    }

    public void printSolution(RefereeAssignmentSolution solution) {
        System.out.println("Solution score: " + solution.getScore());
        System.out.println("\nAssignments:");
        
        for (Game game : solution.getGames()) {
            System.out.println("\nGame: " + game.getName());
            System.out.println("Time: " + game.getStartTime() + " - " + game.getEndTime());
            System.out.println("Location: " + game.getLocation());
            System.out.println("Main Referee: " + (game.getMainReferee() != null ? game.getMainReferee().getName() : "Not assigned"));
            System.out.println("Assistant Referee 1: " + (game.getAssistantReferee1() != null ? game.getAssistantReferee1().getName() : "Not assigned"));
            System.out.println("Assistant Referee 2: " + (game.getAssistantReferee2() != null ? game.getAssistantReferee2().getName() : "Not assigned"));
        }
    }
} 