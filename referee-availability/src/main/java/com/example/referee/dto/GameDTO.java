package com.example.referee.dto;

import java.time.LocalDateTime;

public class GameDTO {
    private Long id;
    private String name;
    private String location;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String level;
    private int requiredReferees;
    private String status;

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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
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

    public int getRequiredReferees() {
        return requiredReferees;
    }

    public void setRequiredReferees(int requiredReferees) {
        this.requiredReferees = requiredReferees;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
} 