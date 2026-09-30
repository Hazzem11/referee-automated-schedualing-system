package com.example.referee.service;

import com.example.referee.domain.Referee;
import com.example.referee.domain.RefereeAssignment;
import com.example.referee.domain.RefereeAssignmentSolution;
import com.example.referee.dto.SolutionAssignmentRowDTO;
import com.example.referee.dto.SolutionGameDTO;
import com.example.referee.dto.SolutionRefereeDTO;
import com.example.referee.dto.SolutionResponseDTO;
import com.example.referee.dto.SolutionScoreDTO;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SolutionResponseMapper {

    public SolutionResponseDTO toDto(RefereeAssignmentSolution solution) {
        SolutionResponseDTO dto = new SolutionResponseDTO();
        HardSoftScore score = solution.getScore();
        if (score != null) {
            dto.setScore(new SolutionScoreDTO(score.hardScore(), score.softScore()));
        } else {
            dto.setScore(new SolutionScoreDTO(0, 0));
        }
        List<SolutionAssignmentRowDTO> rows = solution.getAssignments().stream()
            .map(this::toRow)
            .collect(Collectors.toList());
        dto.setAssignments(rows);
        return dto;
    }

    private SolutionAssignmentRowDTO toRow(RefereeAssignment a) {
        SolutionAssignmentRowDTO row = new SolutionAssignmentRowDTO();
        row.setId(a.getId());
        row.setGame(toGameDto(a.getGame()));
        row.setReferee(a.getReferee() != null ? toRefereeDto(a.getReferee()) : null);
        return row;
    }

    private SolutionGameDTO toGameDto(com.example.referee.domain.Game g) {
        SolutionGameDTO dto = new SolutionGameDTO();
        dto.setId(g.getId());
        dto.setName(g.getName());
        dto.setStartTime(g.getStartTime());
        dto.setEndTime(g.getEndTime());
        dto.setLocation(g.getLocation());
        dto.setGameLevel(g.getGameLevel());
        dto.setWeekNumber(weekOffsetFromToday(g.getStartTime()));
        return dto;
    }

    /** Aligns with AssignmentVisualizer: floor(days/7) from today to game day */
    private int weekOffsetFromToday(LocalDateTime start) {
        if (start == null) {
            return 0;
        }
        long days = ChronoUnit.DAYS.between(java.time.LocalDate.now(), start.toLocalDate());
        return (int) Math.floorDiv(days, 7);
    }

    private SolutionRefereeDTO toRefereeDto(Referee r) {
        SolutionRefereeDTO dto = new SolutionRefereeDTO();
        dto.setId(r.getId());
        dto.setName(r.getName());
        dto.setExperienceLevel(r.getExperienceLevel());
        dto.setHomeLocation(r.getHomeLocation());
        dto.setMaxTravelDistance(r.getMaxTravelDistance());
        return dto;
    }
}
