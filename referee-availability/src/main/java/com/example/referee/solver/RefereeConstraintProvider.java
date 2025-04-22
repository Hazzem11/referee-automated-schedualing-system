package com.example.referee.solver;

import com.example.referee.domain.Game;
import com.example.referee.domain.Referee;
import com.example.referee.domain.RefereeAssignment;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.api.score.stream.Constraint;
import org.optaplanner.core.api.score.stream.ConstraintFactory;
import org.optaplanner.core.api.score.stream.ConstraintProvider;
import org.optaplanner.core.api.score.stream.Joiners;

public class RefereeConstraintProvider implements ConstraintProvider {

    @Override
    public Constraint[] defineConstraints(ConstraintFactory constraintFactory) {
        return new Constraint[] {
            // Hard constraints
            refereeAvailability(constraintFactory),
            gameTimeOverlap(constraintFactory),
            experienceLevelMatch(constraintFactory),
            
            // Soft constraints
            minimizeTravelDistance(constraintFactory),
            maximizeRefereeExperience(constraintFactory)
        };
    }

    private Constraint refereeAvailability(ConstraintFactory constraintFactory) {
        return constraintFactory.forEach(RefereeAssignment.class)
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
            .penalize(HardSoftScore.ONE_HARD)
            .asConstraint("Game time overlap");
    }

    private Constraint experienceLevelMatch(ConstraintFactory constraintFactory) {
        return constraintFactory.forEach(RefereeAssignment.class)
            .filter(assignment -> assignment.getReferee().getExperienceLevel() < 
                                assignment.getGame().getGameLevel())
            .penalize(HardSoftScore.ONE_HARD)
            .asConstraint("Experience level match");
    }

    private Constraint minimizeTravelDistance(ConstraintFactory constraintFactory) {
        return constraintFactory.forEach(RefereeAssignment.class)
            .penalize(HardSoftScore.ONE_SOFT,
                    assignment -> calculateTravelDistance(assignment.getReferee(), assignment.getGame()))
            .asConstraint("Minimize travel distance");
    }

    private Constraint maximizeRefereeExperience(ConstraintFactory constraintFactory) {
        return constraintFactory.forEach(RefereeAssignment.class)
            .reward(HardSoftScore.ONE_SOFT,
                    assignment -> assignment.getReferee().getExperienceLevel())
            .asConstraint("Maximize referee experience");
    }

    private int calculateTravelDistance(Referee referee, Game game) {
        // This is a placeholder implementation
        // You should implement actual distance calculation logic here
        return 0;
    }
} 