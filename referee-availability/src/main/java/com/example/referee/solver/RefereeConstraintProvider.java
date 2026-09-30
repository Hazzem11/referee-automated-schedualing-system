package com.example.referee.solver;

import com.example.referee.domain.Game;
import com.example.referee.domain.Referee;
import com.example.referee.domain.RefereeAssignment;
import com.example.referee.util.LocationDistance;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.api.score.stream.Constraint;
import org.optaplanner.core.api.score.stream.ConstraintFactory;
import org.optaplanner.core.api.score.stream.ConstraintProvider;
import org.optaplanner.core.api.score.stream.Joiners;

public class RefereeConstraintProvider implements ConstraintProvider {

    @Override
    public Constraint[] defineConstraints(ConstraintFactory constraintFactory) {
        return new Constraint[] {
            refereeAvailability(constraintFactory),
            gameTimeOverlap(constraintFactory),
            experienceLevelMatch(constraintFactory),
            minimizeTravelDistance(constraintFactory),
            maximizeRefereeExperience(constraintFactory),
            preferVenue(constraintFactory)
        };
    }

    private Constraint refereeAvailability(ConstraintFactory constraintFactory) {
        return constraintFactory.forEach(RefereeAssignment.class)
            .filter(a -> a.getReferee() != null)
            .filter(assignment -> !assignment.getReferee().isAvailable(
                assignment.getGame().getStartTime(),
                assignment.getGame().getEndTime()))
            .penalize(HardSoftScore.ONE_HARD)
            .asConstraint("Referee availability");
    }

    private Constraint gameTimeOverlap(ConstraintFactory constraintFactory) {
        return constraintFactory.forEachUniquePair(RefereeAssignment.class,
                Joiners.equal(RefereeAssignment::getReferee),
                Joiners.overlapping(
                    assignment -> assignment.getGame().getStartTime(),
                    assignment -> assignment.getGame().getEndTime()
                ))
            .filter((a1, a2) -> a1.getReferee() != null)
            .penalize(HardSoftScore.ONE_HARD)
            .asConstraint("Game time overlap");
    }

    private Constraint experienceLevelMatch(ConstraintFactory constraintFactory) {
        return constraintFactory.forEach(RefereeAssignment.class)
            .filter(a -> a.getReferee() != null)
            .filter(assignment -> assignment.getReferee().getExperienceLevel()
                < assignment.getGame().getGameLevel())
            .penalize(HardSoftScore.ONE_HARD)
            .asConstraint("Experience level match");
    }

    private Constraint minimizeTravelDistance(ConstraintFactory constraintFactory) {
        return constraintFactory.forEach(RefereeAssignment.class)
            .filter(a -> a.getReferee() != null)
            .penalize(HardSoftScore.ONE_SOFT,
                assignment -> calculateTravelDistance(assignment.getReferee(), assignment.getGame()))
            .asConstraint("Minimize travel distance");
    }

    private Constraint maximizeRefereeExperience(ConstraintFactory constraintFactory) {
        return constraintFactory.forEach(RefereeAssignment.class)
            .filter(a -> a.getReferee() != null)
            .reward(HardSoftScore.ONE_SOFT,
                assignment -> assignment.getReferee().getExperienceLevel())
            .asConstraint("Maximize referee experience");
    }

    private Constraint preferVenue(ConstraintFactory constraintFactory) {
        return constraintFactory.forEach(RefereeAssignment.class)
            .filter(a -> a.getReferee() != null
                && a.getReferee().getPreferredLocations() != null
                && !a.getReferee().getPreferredLocations().isEmpty()
                && a.getGame().getLocation() != null)
            .filter(a -> a.getReferee().getPreferredLocations().stream()
                .noneMatch(p -> p.equalsIgnoreCase(a.getGame().getLocation())))
            .penalize(HardSoftScore.ONE_SOFT)
            .asConstraint("Preferred venue");
    }

    private int calculateTravelDistance(Referee referee, Game game) {
        if (referee.getHomeLat() != null && referee.getHomeLng() != null
            && game.getLocationLat() != null && game.getLocationLng() != null) {
            return LocationDistance.kmBetween(
                referee.getHomeLat(), referee.getHomeLng(),
                game.getLocationLat(), game.getLocationLng());
        }
        return LocationDistance.kmBetween(referee.getHomeLocation(), game.getLocation());
    }
}
