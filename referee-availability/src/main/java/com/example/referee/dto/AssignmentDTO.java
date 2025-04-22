package com.example.referee.dto;

import java.util.List;

public class AssignmentDTO {
    private Long id;
    private GameDTO game;
    private RefereeDTO referee;
    private List<RefereeDTO> referees;
    private String status;
    private int score;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public GameDTO getGame() {
        return game;
    }

    public void setGame(GameDTO game) {
        this.game = game;
    }

    public RefereeDTO getReferee() {
        return referee;
    }

    public void setReferee(RefereeDTO referee) {
        this.referee = referee;
    }

    public List<RefereeDTO> getReferees() {
        return referees;
    }

    public void setReferees(List<RefereeDTO> referees) {
        this.referees = referees;
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