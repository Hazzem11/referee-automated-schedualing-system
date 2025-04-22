package com.example.referee.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RefereeDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private int experienceLevel;
    private String homeLocation;
    private List<TimeSlotDTO> availability;
    private String status;

    public RefereeDTO() {
    }

    public RefereeDTO(Long id, String name, int experienceLevel, String homeLocation) {
        this.id = id;
        this.name = name;
        this.experienceLevel = experienceLevel;
        this.homeLocation = homeLocation;
    }

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