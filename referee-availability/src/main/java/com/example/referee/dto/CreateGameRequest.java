package com.example.referee.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class CreateGameRequest {

    @NotBlank
    private String date;

    @NotBlank
    private String time;

    @NotBlank
    private String location;
    /** Google Place ID selected from autocomplete (optional). */
    private String locationPlaceId;
    private Double locationLat;
    private Double locationLng;

    @NotNull
    private Integer numberOfGames;

    @NotNull
    private Integer gameLevel;

    private String level = "";

    private String type = "";

    private Integer requiredReferees;

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
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

    public Integer getNumberOfGames() {
        return numberOfGames;
    }

    public void setNumberOfGames(Integer numberOfGames) {
        this.numberOfGames = numberOfGames;
    }

    public Integer getGameLevel() {
        return gameLevel;
    }

    public void setGameLevel(Integer gameLevel) {
        this.gameLevel = gameLevel;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getRequiredReferees() {
        return requiredReferees;
    }

    public void setRequiredReferees(Integer requiredReferees) {
        this.requiredReferees = requiredReferees;
    }
}
