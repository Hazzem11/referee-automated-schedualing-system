package com.example.referee.dto;

public class SolutionAssignmentRowDTO {
    private Long id;
    private SolutionGameDTO game;
    private SolutionRefereeDTO referee;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SolutionGameDTO getGame() {
        return game;
    }

    public void setGame(SolutionGameDTO game) {
        this.game = game;
    }

    public SolutionRefereeDTO getReferee() {
        return referee;
    }

    public void setReferee(SolutionRefereeDTO referee) {
        this.referee = referee;
    }
}
