package com.example.referee.domain;

import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.lookup.PlanningId;
import org.optaplanner.core.api.domain.variable.PlanningVariable;

/**
 * One slot to fill with a referee for a given game (multiple slots per game when crew &gt; 1).
 */
@PlanningEntity
public class RefereeAssignment {

    @PlanningId
    private Long id;

    private Game game;

    @PlanningVariable(valueRangeProviderRefs = "refereeRange", nullable = true)
    private Referee referee;

    private String status;
    private int score;

    public RefereeAssignment() {
    }

    public RefereeAssignment(Game game) {
        this.game = game;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public Referee getReferee() {
        return referee;
    }

    public void setReferee(Referee referee) {
        this.referee = referee;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
