package com.example.referee.dto;

public class PublishResultDTO {
    private int totalGames;
    private int gamesFullyStaffed;
    private int unassignedSlots;
    private int publishedAssignments;
    private int newAssignments;
    private int refereesNotified;
    /** true when emails were actually sent (SendGrid), false when log-only. */
    private boolean live;

    public int getTotalGames() {
        return totalGames;
    }

    public void setTotalGames(int totalGames) {
        this.totalGames = totalGames;
    }

    public int getGamesFullyStaffed() {
        return gamesFullyStaffed;
    }

    public void setGamesFullyStaffed(int gamesFullyStaffed) {
        this.gamesFullyStaffed = gamesFullyStaffed;
    }

    public int getUnassignedSlots() {
        return unassignedSlots;
    }

    public void setUnassignedSlots(int unassignedSlots) {
        this.unassignedSlots = unassignedSlots;
    }

    public int getPublishedAssignments() {
        return publishedAssignments;
    }

    public void setPublishedAssignments(int publishedAssignments) {
        this.publishedAssignments = publishedAssignments;
    }

    public int getNewAssignments() {
        return newAssignments;
    }

    public void setNewAssignments(int newAssignments) {
        this.newAssignments = newAssignments;
    }

    public int getRefereesNotified() {
        return refereesNotified;
    }

    public void setRefereesNotified(int refereesNotified) {
        this.refereesNotified = refereesNotified;
    }

    public boolean isLive() {
        return live;
    }

    public void setLive(boolean live) {
        this.live = live;
    }
}
