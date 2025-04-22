package com.example.referee.domain;

import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.variable.PlanningVariable;
import org.optaplanner.core.api.domain.lookup.PlanningId;

import javax.persistence.*;

@Entity
@PlanningEntity
public class RefereeAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @PlanningId
    private Long id;

    @ManyToOne
    @JoinColumn(name = "game_id")
    private Game game;

    @ManyToOne
    @JoinColumn(name = "referee_id")
    @PlanningVariable(valueRangeProviderRefs = "refereeRange")
    private Referee referee;

    private String status;
    private int score;

    public RefereeAssignment() {
    }

    public RefereeAssignment(Game game) {
        this.game = game;
    }

    // Getters and Setters
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