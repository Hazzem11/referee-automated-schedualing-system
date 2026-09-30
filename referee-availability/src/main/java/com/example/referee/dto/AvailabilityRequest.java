package com.example.referee.dto;

import javax.validation.constraints.NotBlank;
import java.util.List;

public class AvailabilityRequest {

    @NotBlank
    private String refereeName;

    @NotBlank
    private String weekStart;

    private List<TimeSlotDTO> slots;

    public String getRefereeName() {
        return refereeName;
    }

    public void setRefereeName(String refereeName) {
        this.refereeName = refereeName;
    }

    public String getWeekStart() {
        return weekStart;
    }

    public void setWeekStart(String weekStart) {
        this.weekStart = weekStart;
    }

    public List<TimeSlotDTO> getSlots() {
        return slots;
    }

    public void setSlots(List<TimeSlotDTO> slots) {
        this.slots = slots;
    }
}
