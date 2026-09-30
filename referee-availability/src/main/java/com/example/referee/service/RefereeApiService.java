package com.example.referee.service;

import com.example.referee.dto.RefereeDTO;
import com.example.referee.dto.TimeSlotDTO;
import com.example.referee.model.Referee;
import com.example.referee.repository.RefereeRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RefereeApiService {

    private final RefereeRepository refereeRepository;
    private final ObjectMapper objectMapper;

    public RefereeApiService(RefereeRepository refereeRepository, ObjectMapper objectMapper) {
        this.refereeRepository = refereeRepository;
        this.objectMapper = objectMapper;
    }

    public List<RefereeDTO> listAll() {
        return refereeRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public RefereeDTO toDto(Referee e) {
        RefereeDTO dto = new RefereeDTO();
        dto.setId(e.getId());
        dto.setName(e.getName());
        dto.setEmail(e.getEmail());
        dto.setExperienceLevel(e.getExperienceLevel());
        dto.setHomeLocation(e.getHomeLocation());
        dto.setMaxTravelDistance(e.getMaxTravelDistance());
        dto.setMaxGamesPerWeek(e.getMaxGamesPerWeek());
        dto.setCurrentAssignments(e.getCurrentGamesThisWeek());
        if (e.getPreferredLocations() != null && !e.getPreferredLocations().isBlank()) {
            dto.setPreferredLocations(Arrays.asList(e.getPreferredLocations().split("\\s*,\\s*")));
        } else {
            dto.setPreferredLocations(Collections.emptyList());
        }
        dto.setAvailability(parseSlots(e.getAvailabilityJson()));
        dto.setStatus(e.isAvailable() ? "active" : "inactive");
        return dto;
    }

    private List<TimeSlotDTO> parseSlots(String json) {
        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<TimeSlotDTO>>() {});
        } catch (Exception ex) {
            return Collections.emptyList();
        }
    }
}
