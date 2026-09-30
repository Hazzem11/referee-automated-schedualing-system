package com.example.referee.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String location = "";
    /** Google Place ID for game location (optional). */
    private String locationPlaceId = "";
    private Double locationLat;
    private Double locationLng;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    /** Display label e.g. PRO, INTERMEDIATE */
    private String level = "";

    /** Numeric difficulty 1–6 (higher = harder) */
    private int gameLevel = 1;

    private int requiredExperienceLevel = 1;

    /** Crew size to assign via planner */
    private int requiredReferees = 1;

    private Integer numberOfGames;

    private String type = "";

    private boolean assigned = false;

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

    public String getLocationPlaceId() {
        return locationPlaceId;
    }

    public void setLocationPlaceId(String locationPlaceId) {
        this.locationPlaceId = locationPlaceId;
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

    public int getGameLevel() {
        return gameLevel;
    }

    public void setGameLevel(int gameLevel) {
        this.gameLevel = gameLevel;
    }

    public int getRequiredExperienceLevel() {
        return requiredExperienceLevel;
    }

    public void setRequiredExperienceLevel(int requiredExperienceLevel) {
        this.requiredExperienceLevel = requiredExperienceLevel;
    }

    public int getRequiredReferees() {
        return requiredReferees;
    }

    public void setRequiredReferees(int requiredReferees) {
        this.requiredReferees = requiredReferees;
    }

    public Integer getNumberOfGames() {
        return numberOfGames;
    }

    public void setNumberOfGames(Integer numberOfGames) {
        this.numberOfGames = numberOfGames;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isAssigned() {
        return assigned;
    }

    public void setAssigned(boolean assigned) {
        this.assigned = assigned;
    }
}
