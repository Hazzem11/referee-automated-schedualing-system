package com.example.referee.domain;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Referee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    private String phone;
    private int experienceLevel; // Higher number = more experienced
    private String homeLocation;
    private int maxTravelDistance; // in kilometers
    private String status;
    private List<TimeSlot> availability;
    private List<String> preferredLocations;
    private int maxGamesPerWeek;
    private int currentGamesThisWeek;

    public Referee() {
    }

    public Referee(String name, int experienceLevel, String homeLocation) {
        this.name = name;
        this.experienceLevel = experienceLevel;
        this.homeLocation = homeLocation;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<TimeSlot> getAvailability() {
        return availability;
    }

    public void setAvailability(List<TimeSlot> availability) {
        this.availability = availability;
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

    public int getCurrentGamesThisWeek() {
        return currentGamesThisWeek;
    }

    public void setCurrentGamesThisWeek(int currentGamesThisWeek) {
        this.currentGamesThisWeek = currentGamesThisWeek;
    }

    public boolean isAvailable(LocalDateTime startTime, LocalDateTime endTime) {
        if (availability == null || availability.isEmpty()) {
            return false;
        }
        return availability.stream()
            .anyMatch(slot -> slot.isAvailable() && 
                            !slot.getStartTime().isAfter(startTime) && 
                            !slot.getEndTime().isBefore(endTime));
    }

    public boolean canTravelTo(String location) {
        // This would need to be implemented with actual distance calculation
        return true; // Placeholder
    }
} 