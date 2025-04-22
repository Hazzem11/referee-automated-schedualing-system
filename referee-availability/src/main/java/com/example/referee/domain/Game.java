package com.example.referee.domain;

import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.variable.PlanningVariable;

import java.time.LocalDateTime;

@PlanningEntity
public class Game {
    private Long id;
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    private int requiredReferees;
    private int gameLevel; // Higher number = more important game
    
    @PlanningVariable(valueRangeProviderRefs = {"refereeRange"})
    private Referee mainReferee;
    
    @PlanningVariable(valueRangeProviderRefs = {"refereeRange"})
    private Referee assistantReferee1;
    
    @PlanningVariable(valueRangeProviderRefs = {"refereeRange"})
    private Referee assistantReferee2;

    public Game() {
    }

    public Game(String location, LocalDateTime startTime, LocalDateTime endTime, int gameLevel, int requiredReferees) {
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
        this.gameLevel = gameLevel;
        this.requiredReferees = requiredReferees;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getRequiredReferees() {
        return requiredReferees;
    }

    public void setRequiredReferees(int requiredReferees) {
        this.requiredReferees = requiredReferees;
    }

    public int getGameLevel() {
        return gameLevel;
    }

    public void setGameLevel(int gameLevel) {
        this.gameLevel = gameLevel;
    }

    public Referee getMainReferee() {
        return mainReferee;
    }

    public void setMainReferee(Referee mainReferee) {
        this.mainReferee = mainReferee;
    }

    public Referee getAssistantReferee1() {
        return assistantReferee1;
    }

    public void setAssistantReferee1(Referee assistantReferee1) {
        this.assistantReferee1 = assistantReferee1;
    }

    public Referee getAssistantReferee2() {
        return assistantReferee2;
    }

    public void setAssistantReferee2(Referee assistantReferee2) {
        this.assistantReferee2 = assistantReferee2;
    }
} 