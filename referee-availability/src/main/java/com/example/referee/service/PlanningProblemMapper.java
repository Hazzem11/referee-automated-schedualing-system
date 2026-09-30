package com.example.referee.service;

import com.example.referee.domain.Game;
import com.example.referee.domain.Referee;
import com.example.referee.domain.RefereeAssignment;
import com.example.referee.domain.RefereeAssignmentSolution;
import com.example.referee.domain.TimeSlot;
import com.example.referee.dto.TimeSlotDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Component
public class PlanningProblemMapper {

    private final ObjectMapper objectMapper;
    private final AtomicLong assignmentId = new AtomicLong(1);

    public PlanningProblemMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public RefereeAssignmentSolution buildSolution(
            List<com.example.referee.model.Referee> entities,
            List<com.example.referee.model.Game> gameEntities) {

        assignmentId.set(1);
        List<Referee> referees = entities.stream().map(this::toDomainReferee).collect(Collectors.toList());
        List<Game> games = gameEntities.stream().map(this::toDomainGame).collect(Collectors.toList());

        List<RefereeAssignment> assignments = new ArrayList<>();
        for (Game g : games) {
            int slots = Math.max(1, g.getRequiredReferees());
            for (int i = 0; i < slots; i++) {
                RefereeAssignment ra = new RefereeAssignment(g);
                ra.setId(assignmentId.getAndIncrement());
                assignments.add(ra);
            }
        }

        RefereeAssignmentSolution solution = new RefereeAssignmentSolution();
        solution.setReferees(referees);
        solution.setGames(games);
        solution.setAssignments(assignments);
        return solution;
    }

    private Referee toDomainReferee(com.example.referee.model.Referee e) {
        Referee r = new Referee();
        r.setId(e.getId());
        r.setName(e.getName());
        r.setEmail(e.getEmail());
        r.setExperienceLevel(e.getExperienceLevel());
        r.setHomeLocation(e.getHomeLocation() != null ? e.getHomeLocation() : "");
        r.setHomeLat(e.getHomeLat());
        r.setHomeLng(e.getHomeLng());
        r.setMaxTravelDistance(e.getMaxTravelDistance());
        r.setMaxGamesPerWeek(e.getMaxGamesPerWeek());
        r.setCurrentGamesThisWeek(e.getCurrentGamesThisWeek());
        if (e.getPreferredLocations() != null && !e.getPreferredLocations().isBlank()) {
            r.setPreferredLocations(Arrays.asList(e.getPreferredLocations().split("\\s*,\\s*")));
        } else {
            r.setPreferredLocations(Collections.emptyList());
        }
        r.setAvailability(parseAvailability(e.getAvailabilityJson()));
        return r;
    }

    private List<TimeSlot> parseAvailability(String json) {
        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }
        try {
            List<TimeSlotDTO> slots = objectMapper.readValue(json, new TypeReference<List<TimeSlotDTO>>() {});
            return slots.stream()
                .filter(TimeSlotDTO::isAvailable)
                .map(dto -> new TimeSlot(dto.getStartTime(), dto.getEndTime(), true))
                .collect(Collectors.toList());
        } catch (Exception ex) {
            return Collections.emptyList();
        }
    }

    private Game toDomainGame(com.example.referee.model.Game e) {
        Game g = new Game();
        g.setId(e.getId());
        g.setName(e.getName());
        g.setLocation(e.getLocation() != null ? e.getLocation() : "");
        g.setLocationLat(e.getLocationLat());
        g.setLocationLng(e.getLocationLng());
        g.setStartTime(e.getStartTime());
        g.setEndTime(e.getEndTime());
        g.setGameLevel(e.getGameLevel() > 0 ? e.getGameLevel() : e.getRequiredExperienceLevel());
        g.setRequiredReferees(Math.max(1, e.getRequiredReferees()));
        return g;
    }
}
