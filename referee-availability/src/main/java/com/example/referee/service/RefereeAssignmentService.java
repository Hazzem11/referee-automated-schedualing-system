package com.example.referee.service;

import com.example.referee.domain.RefereeAssignment;
import com.example.referee.domain.RefereeAssignmentSolution;
import com.example.referee.dto.PublishResultDTO;
import com.example.referee.dto.SolutionResponseDTO;
import com.example.referee.dto.SolutionScoreDTO;
import com.example.referee.model.Assignment;
import com.example.referee.model.Game;
import com.example.referee.model.Referee;
import com.example.referee.repository.AssignmentRepository;
import com.example.referee.repository.GameRepository;
import com.example.referee.repository.RefereeRepository;
import com.example.referee.solver.RefereeConstraintProvider;
import org.optaplanner.core.api.solver.Solver;
import org.optaplanner.core.api.solver.SolverFactory;
import org.optaplanner.core.config.solver.SolverConfig;
import org.optaplanner.core.config.solver.termination.TerminationConfig;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
public class RefereeAssignmentService {

    private final RefereeRepository refereeRepository;
    private final GameRepository gameRepository;
    private final AssignmentRepository assignmentRepository;
    private final PlanningProblemMapper planningProblemMapper;
    private final SolutionResponseMapper solutionResponseMapper;
    private final NotificationService notificationService;
    private final AtomicReference<RefereeAssignmentSolution> currentSolution = new AtomicReference<>();

    public RefereeAssignmentService(
            RefereeRepository refereeRepository,
            GameRepository gameRepository,
            AssignmentRepository assignmentRepository,
            PlanningProblemMapper planningProblemMapper,
            SolutionResponseMapper solutionResponseMapper,
            NotificationService notificationService) {
        this.refereeRepository = refereeRepository;
        this.gameRepository = gameRepository;
        this.assignmentRepository = assignmentRepository;
        this.planningProblemMapper = planningProblemMapper;
        this.solutionResponseMapper = solutionResponseMapper;
        this.notificationService = notificationService;
    }

    public SolutionResponseDTO solve() {
        List<Referee> referees = refereeRepository.findAll();
        List<Game> games = gameRepository.findAll();
        if (referees.isEmpty() || games.isEmpty()) {
            SolutionResponseDTO empty = new SolutionResponseDTO();
            empty.setScore(new SolutionScoreDTO(0, 0));
            empty.setAssignments(Collections.emptyList());
            return empty;
        }

        RefereeAssignmentSolution problem = planningProblemMapper.buildSolution(referees, games);

        SolverConfig solverConfig = new SolverConfig()
            .withSolutionClass(RefereeAssignmentSolution.class)
            .withEntityClasses(com.example.referee.domain.RefereeAssignment.class)
            .withConstraintProviderClass(RefereeConstraintProvider.class)
            .withTerminationConfig(new TerminationConfig()
                .withSecondsSpentLimit(30L));

        SolverFactory<RefereeAssignmentSolution> solverFactory = SolverFactory.create(solverConfig);
        Solver<RefereeAssignmentSolution> solver = solverFactory.buildSolver();
        RefereeAssignmentSolution solved = solver.solve(problem);
        currentSolution.set(solved);
        return solutionResponseMapper.toDto(solved);
    }

    public SolutionResponseDTO getCurrentSolution() {
        RefereeAssignmentSolution solution = currentSolution.get();
        if (solution == null) {
            SolutionResponseDTO empty = new SolutionResponseDTO();
            empty.setScore(new SolutionScoreDTO(0, 0));
            empty.setAssignments(Collections.emptyList());
            return empty;
        }
        return solutionResponseMapper.toDto(solution);
    }

    /**
     * Persists the current solution as published assignments, emails referees
     * about assignments that are new since the last publish, and sends the
     * assigner a coverage digest.
     */
    @Transactional
    public PublishResultDTO publish() {
        RefereeAssignmentSolution solution = currentSolution.get();
        if (solution == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "No solution to publish — run the solver first.");
        }

        Map<Long, Game> gamesById = gameRepository.findAll().stream()
            .collect(Collectors.toMap(Game::getId, g -> g));
        Map<Long, Referee> refereesById = refereeRepository.findAll().stream()
            .collect(Collectors.toMap(Referee::getId, r -> r));

        Set<String> previouslyPublished = assignmentRepository.findAll().stream()
            .map(a -> pairKey(a.getGameId(), a.getRefereeId()))
            .collect(Collectors.toSet());

        List<Assignment> fresh = new ArrayList<>();
        Map<Long, Integer> slotCounter = new HashMap<>();
        Map<Long, List<Referee>> crewByGame = new HashMap<>();
        Map<Long, long[]> slotsByGame = new HashMap<>();

        for (RefereeAssignment ra : solution.getAssignments()) {
            Long gameId = ra.getGame().getId();
            long[] counts = slotsByGame.computeIfAbsent(gameId, k -> new long[2]);
            counts[1]++;
            if (ra.getReferee() == null) {
                continue;
            }
            counts[0]++;
            Referee referee = refereesById.get(ra.getReferee().getId());
            if (referee == null) {
                continue;
            }
            Assignment assignment = new Assignment();
            assignment.setGameId(gameId);
            assignment.setRefereeId(referee.getId());
            assignment.setSlotIndex(slotCounter.merge(gameId, 1, Integer::sum) - 1);
            assignment.setPublishedAt(LocalDateTime.now());
            fresh.add(assignment);
            crewByGame.computeIfAbsent(gameId, k -> new ArrayList<>()).add(referee);
        }

        assignmentRepository.deleteAllInBatch();
        assignmentRepository.saveAll(fresh);

        int fullyStaffed = 0;
        int unassignedSlots = 0;
        List<Game> understaffed = new ArrayList<>();
        for (Map.Entry<Long, long[]> entry : slotsByGame.entrySet()) {
            Game game = gamesById.get(entry.getKey());
            if (game == null) {
                continue;
            }
            long filled = entry.getValue()[0];
            long total = entry.getValue()[1];
            boolean complete = total > 0 && filled == total;
            game.setAssigned(complete);
            gameRepository.save(game);
            if (complete) {
                fullyStaffed++;
            } else {
                unassignedSlots += (int) (total - filled);
                understaffed.add(game);
            }
        }

        Map<Referee, List<NotificationService.AssignmentNotice>> noticesByReferee = new HashMap<>();
        int newAssignments = 0;
        for (Assignment assignment : fresh) {
            if (previouslyPublished.contains(pairKey(assignment.getGameId(), assignment.getRefereeId()))) {
                continue;
            }
            newAssignments++;
            Referee referee = refereesById.get(assignment.getRefereeId());
            Game game = gamesById.get(assignment.getGameId());
            if (referee == null || game == null) {
                continue;
            }
            String partner = crewByGame.getOrDefault(assignment.getGameId(), Collections.emptyList())
                .stream()
                .filter(r -> !r.getId().equals(referee.getId()))
                .map(Referee::getName)
                .findFirst()
                .orElse(null);
            noticesByReferee.computeIfAbsent(referee, k -> new ArrayList<>())
                .add(new NotificationService.AssignmentNotice(game, partner));
        }

        int refereesNotified = notificationService.sendAssignmentNotifications(noticesByReferee);

        Set<Long> gameIds = new HashSet<>(slotsByGame.keySet());
        notificationService.sendAssignerDigest(
            gameIds.size(), fullyStaffed, unassignedSlots, understaffed, refereesNotified);

        PublishResultDTO result = new PublishResultDTO();
        result.setTotalGames(gameIds.size());
        result.setGamesFullyStaffed(fullyStaffed);
        result.setUnassignedSlots(unassignedSlots);
        result.setPublishedAssignments(fresh.size());
        result.setNewAssignments(newAssignments);
        result.setRefereesNotified(refereesNotified);
        result.setLive(notificationService.isLive());
        return result;
    }

    private static String pairKey(Long gameId, Long refereeId) {
        return gameId + ":" + refereeId;
    }
}
