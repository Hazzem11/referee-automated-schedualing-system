package com.example.referee.domain;

import java.time.LocalDateTime;

/**
 * Problem fact: a match that needs referees.
 */
public class Game {

    private Long id;
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    private int requiredReferees;
    private int gameLevel;
    private Double locationLat;
    private Double locationLng;

    public Game() {
    }

    public Game(String location, LocalDateTime startTime, LocalDateTime endTime, int gameLevel, int requiredReferees) {
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
        this.gameLevel = gameLevel;
        this.requiredReferees = requiredReferees;
    }

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

    public Double getLocationLat() {
        return locationLat;
    }

    public void setLocationLat(Double locationLat) {
        this.locationLat = locationLat;
    }

    public Double getLocationLng() {
        return locationLng;
    }

    public void setLocationLng(Double locationLng) {
        this.locationLng = locationLng;
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
}
