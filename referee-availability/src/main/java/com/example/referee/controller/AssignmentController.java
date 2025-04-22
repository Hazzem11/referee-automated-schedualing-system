package com.example.referee.controller;

import com.example.referee.dto.AssignmentDTO;
import com.example.referee.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @GetMapping("/assignments")
    public List<AssignmentDTO> getAllAssignments() {
        return assignmentService.getAllAssignments();
    }
} 