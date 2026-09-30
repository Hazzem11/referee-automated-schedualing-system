package com.example.referee.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "referees")
public class Referee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private int experienceLevel = 1;

    private String homeLocation = "";
    /** Google Place ID for home location (optional). */
    private String homePlaceId = "";
    private Double homeLat;
    private Double homeLng;

    private int maxTravelDistance = 50;

    /** Comma-separated venue names */
    @Column(length = 2000)
    private String preferredLocations = "";

    private int maxGamesPerWeek = 3;

    private int currentGamesThisWeek = 0;

    /** JSON array of TimeSlotDTO (startTime, endTime, available) */
    @Column(columnDefinition = "TEXT")
    private String availabilityJson = "[]";

    private boolean available = true;

    private LocalDateTime createdAt = LocalDateTime.now();

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

    public String getHomePlaceId() {
        return homePlaceId;
    }

    public void setHomePlaceId(String homePlaceId) {
        this.homePlaceId = homePlaceId;
    }

    public Double getHomeLat() {
        return homeLat;
    }

    public void setHomeLat(Double homeLat) {
        this.homeLat = homeLat;
    }

    public Double getHomeLng() {
        return homeLng;
    }

    public void setHomeLng(Double homeLng) {
        this.homeLng = homeLng;
    }

    public int getMaxTravelDistance() {
        return maxTravelDistance;
    }

    public void setMaxTravelDistance(int maxTravelDistance) {
        this.maxTravelDistance = maxTravelDistance;
    }

    public String getPreferredLocations() {
        return preferredLocations;
    }

    public void setPreferredLocations(String preferredLocations) {
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

    public String getAvailabilityJson() {
        return availabilityJson;
    }

    public void setAvailabilityJson(String availabilityJson) {
        this.availabilityJson = availabilityJson;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isAvailable(LocalDateTime time) {
        return available;
    }
}
