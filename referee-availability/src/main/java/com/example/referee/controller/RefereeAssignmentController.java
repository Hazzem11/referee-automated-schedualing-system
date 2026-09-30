package com.example.referee.controller;

import com.example.referee.dto.PublishResultDTO;
import com.example.referee.dto.SolutionResponseDTO;
import com.example.referee.service.RefereeAssignmentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assignments")
public class RefereeAssignmentController {

    private final RefereeAssignmentService assignmentService;

    public RefereeAssignmentController(RefereeAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping("/solve")
    public SolutionResponseDTO solve() {
        return assignmentService.solve();
    }

    @GetMapping("/current")
    public SolutionResponseDTO getCurrentSolution() {
        return assignmentService.getCurrentSolution();
    }

    @PostMapping("/publish")
    public PublishResultDTO publish() {
        return assignmentService.publish();
    }
}
