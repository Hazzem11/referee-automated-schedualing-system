package com.example.referee.dto;

import java.util.List;

public class RefereeDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private int experienceLevel;
    private String homeLocation;
    private int maxTravelDistance;
    private List<String> preferredLocations;
    private int maxGamesPerWeek;
    private int currentAssignments;
    private List<TimeSlotDTO> availability;
    private String status;

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public int getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(int experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public String getHomeLocation() {
        return homeLocation;
    }

    public void setHomeLocation(String homeLocation) {
        this.homeLocation = homeLocation;
    }

    public int getMaxTravelDistance() {
        return maxTravelDistance;
    }

    public void setMaxTravelDistance(int maxTravelDistance) {
        this.maxTravelDistance = maxTravelDistance;
    }

    public List<String> getPreferredLocations() {
        return preferredLocations;
    }

    public void setPreferredLocations(List<String> preferredLocations) {
        this.preferredLocations = preferredLocations;
    }

    public int getMaxGamesPerWeek() {
        return maxGamesPerWeek;
    }

    public void setMaxGamesPerWeek(int maxGamesPerWeek) {
        this.maxGamesPerWeek = maxGamesPerWeek;
    }

    public int getCurrentAssignments() {
        return currentAssignments;
    }

    public void setCurrentAssignments(int currentAssignments) {
        this.currentAssignments = currentAssignments;
    }

    public List<TimeSlotDTO> getAvailability() {
        return availability;
    }

    public void setAvailability(List<TimeSlotDTO> availability) {
        this.availability = availability;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
