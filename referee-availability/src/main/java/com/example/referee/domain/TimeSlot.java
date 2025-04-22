package com.example.referee.domain;

import java.time.LocalDateTime;

public class TimeSlot {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean available;

    public TimeSlot() {
    }

    public TimeSlot(LocalDateTime startTime, LocalDateTime endTime) {
        this(startTime, endTime, true);
    }

    public TimeSlot(LocalDateTime startTime, LocalDateTime endTime, boolean available) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.available = available;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public boolean contains(LocalDateTime time) {
        return !time.isBefore(startTime) && !time.isAfter(endTime);
    }

    public boolean overlaps(TimeSlot other) {
        return !this.endTime.isBefore(other.startTime) && !this.startTime.isAfter(other.endTime);
    }
} 