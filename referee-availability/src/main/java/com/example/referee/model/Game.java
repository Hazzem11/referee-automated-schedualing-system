package com.example.referee.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String level;
    private int requiredExperienceLevel;

    @ManyToMany
    @JoinTable(
        name = "game_referee",
        joinColumns = @JoinColumn(name = "game_id"),
        inverseJoinColumns = @JoinColumn(name = "referee_id")
    )
    private List<Referee> assignedReferees;

    // Getters and Setters
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

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public int getRequiredExperienceLevel() {
        return requiredExperienceLevel;
    }

    public void setRequiredExperienceLevel(int requiredExperienceLevel) {
        this.requiredExperienceLevel = requiredExperienceLevel;
    }

    public List<Referee> getAssignedReferees() {
        return assignedReferees;
    }

    public void setAssignedReferees(List<Referee> assignedReferees) {
        this.assignedReferees = assignedReferees;
    }
} 