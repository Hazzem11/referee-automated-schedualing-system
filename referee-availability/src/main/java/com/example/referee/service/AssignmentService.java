package com.example.referee.service;

import com.example.referee.dto.AssignmentDTO;
import com.example.referee.dto.GameDTO;
import com.example.referee.dto.RefereeDTO;
import com.example.referee.model.Game;
import com.example.referee.model.Referee;
import com.example.referee.model.RefereeAssignment;
import com.example.referee.repository.GameRepository;
import com.example.referee.repository.RefereeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private RefereeRepository refereeRepository;

    public List<AssignmentDTO> getAllAssignments() {
        List<Game> games = gameRepository.findAll();
        List<AssignmentDTO> assignments = new ArrayList<>();

        for (Game game : games) {
            AssignmentDTO assignmentDTO = new AssignmentDTO();
            assignmentDTO.setId(game.getId());
            
            // Convert Game to GameDTO
            GameDTO gameDTO = new GameDTO();
            gameDTO.setId(game.getId());
            gameDTO.setName(game.getName());
            gameDTO.setStartTime(game.getStartTime());
            gameDTO.setLevel(game.getLevel());
            assignmentDTO.setGame(gameDTO);

            // Get assigned referees
            List<Referee> assignedReferees = game.getAssignedReferees();
            List<RefereeDTO> refereeDTOs = assignedReferees.stream()
                .map(referee -> {
                    RefereeDTO refereeDTO = new RefereeDTO();
                    refereeDTO.setId(referee.getId());
                    refereeDTO.setName(referee.getName());
                    refereeDTO.setExperienceLevel(referee.getExperienceLevel());
                    return refereeDTO;
                })
                .collect(Collectors.toList());
            assignmentDTO.setReferees(refereeDTOs);

            // Calculate score based on your OptaPlanner constraints
            assignmentDTO.setScore(calculateAssignmentScore(game, assignedReferees));

            assignments.add(assignmentDTO);
        }

        return assignments;
    }

    private int calculateAssignmentScore(Game game, List<Referee> referees) {
        int score = 0;
        
        // Example scoring logic - adjust based on your actual constraints
        for (Referee referee : referees) {
            // Match experience level with game level
            if (referee.getExperienceLevel() >= game.getRequiredExperienceLevel()) {
                score += 10;
            }
            
            // Check availability
            if (referee.isAvailable(game.getStartTime())) {
                score += 5;
            }
            
            // Add more scoring criteria as needed
        }
        
        return score;
    }
} 