package com.example.referee.service;

import com.example.referee.dto.AvailabilityRequest;
import com.example.referee.dto.TimeSlotDTO;
import com.example.referee.model.Referee;
import com.example.referee.repository.RefereeRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class AvailabilityApiService {

    private final RefereeRepository refereeRepository;
    private final ObjectMapper objectMapper;

    public AvailabilityApiService(RefereeRepository refereeRepository, ObjectMapper objectMapper) {
        this.refereeRepository = refereeRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public void saveAvailability(AvailabilityRequest request) {
        Referee referee = refereeRepository.findByNameIgnoreCase(request.getRefereeName().trim())
            .orElseGet(() -> createDefaultReferee(request.getRefereeName().trim()));

        List<TimeSlotDTO> incoming = request.getSlots() != null ? request.getSlots() : Collections.emptyList();
        List<TimeSlotDTO> merged = mergeWeek(referee.getAvailabilityJson(), incoming);
        try {
            referee.setAvailabilityJson(objectMapper.writeValueAsString(merged));
        } catch (Exception ex) {
            throw new IllegalStateException("Could not save availability", ex);
        }
        refereeRepository.save(referee);
    }

    private Referee createDefaultReferee(String name) {
        Referee r = new Referee();
        r.setName(name);
        r.setExperienceLevel(2);
        r.setHomeLocation("Downtown");
        r.setMaxTravelDistance(40);
        r.setPreferredLocations("Downtown, North Side");
        r.setMaxGamesPerWeek(3);
        return refereeRepository.save(r);
    }

    private List<TimeSlotDTO> mergeWeek(String existingJson, List<TimeSlotDTO> newSlots) {
        List<TimeSlotDTO> all = new ArrayList<>();
        if (existingJson != null && !existingJson.isBlank()) {
            try {
                all.addAll(objectMapper.readValue(existingJson, new TypeReference<List<TimeSlotDTO>>() {}));
            } catch (Exception ignored) {
                // replace with new data if legacy JSON invalid
            }
        }
        all.addAll(newSlots);
        return all;
    }
}
