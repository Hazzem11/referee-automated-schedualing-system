package com.example.referee.dto;

import java.util.List;

public class SolutionResponseDTO {
    private SolutionScoreDTO score;
    private List<SolutionAssignmentRowDTO> assignments;

    public SolutionScoreDTO getScore() {
        return score;
    }

    public void setScore(SolutionScoreDTO score) {
        this.score = score;
    }

    public List<SolutionAssignmentRowDTO> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<SolutionAssignmentRowDTO> assignments) {
        this.assignments = assignments;
    }
}
