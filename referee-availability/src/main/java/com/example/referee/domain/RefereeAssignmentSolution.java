package com.example.referee.domain;

import org.optaplanner.core.api.domain.solution.PlanningSolution;
import org.optaplanner.core.api.domain.solution.PlanningEntityCollectionProperty;
import org.optaplanner.core.api.domain.solution.ProblemFactCollectionProperty;
import org.optaplanner.core.api.domain.valuerange.ValueRangeProvider;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.api.domain.solution.PlanningScore;

import java.util.List;

@PlanningSolution
public class RefereeAssignmentSolution {
    private List<Game> games;
    private List<Referee> referees;
    private List<RefereeAssignment> assignments;
    private HardSoftScore score;

    @ProblemFactCollectionProperty
    @ValueRangeProvider(id = "gameRange")
    public List<Game> getGames() {
        return games;
    }

    public void setGames(List<Game> games) {
        this.games = games;
    }

    @ProblemFactCollectionProperty
    @ValueRangeProvider(id = "refereeRange")
    public List<Referee> getReferees() {
        return referees;
    }

    public void setReferees(List<Referee> referees) {
        this.referees = referees;
    }

    @PlanningEntityCollectionProperty
    public List<RefereeAssignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<RefereeAssignment> assignments) {
        this.assignments = assignments;
    }

    @PlanningScore
    public HardSoftScore getScore() {
        return score;
    }

    public void setScore(HardSoftScore score) {
        this.score = score;
    }
} 