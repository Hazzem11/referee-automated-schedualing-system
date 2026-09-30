package com.example.referee.controller;

import com.example.referee.dto.AvailabilityRequest;
import com.example.referee.service.AvailabilityApiService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/availability")
public class AvailabilityController {

    private final AvailabilityApiService availabilityApiService;

    public AvailabilityController(AvailabilityApiService availabilityApiService) {
        this.availabilityApiService = availabilityApiService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void submit(@Valid @RequestBody AvailabilityRequest request) {
        availabilityApiService.saveAvailability(request);
    }
}
