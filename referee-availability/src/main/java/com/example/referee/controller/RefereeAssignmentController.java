package com.example.referee.controller;

import com.example.referee.domain.RefereeAssignmentSolution;
import com.example.referee.service.RefereeAssignmentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assignments")
public class RefereeAssignmentController {

    private final RefereeAssignmentService assignmentService;

    public RefereeAssignmentController(RefereeAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping("/solve")
    public RefereeAssignmentSolution solve() {
        return assignmentService.solve();
    }

    @GetMapping("/current")
    public RefereeAssignmentSolution getCurrentSolution() {
        return assignmentService.getCurrentSolution();
    }
} 