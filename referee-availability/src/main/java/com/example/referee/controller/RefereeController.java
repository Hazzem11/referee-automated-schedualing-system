package com.example.referee.controller;

import com.example.referee.dto.ImportResultDTO;
import com.example.referee.dto.RefereeDTO;
import com.example.referee.service.CsvImportService;
import com.example.referee.service.RefereeApiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/referees")
public class RefereeController {

    private final RefereeApiService refereeApiService;
    private final CsvImportService csvImportService;

    public RefereeController(RefereeApiService refereeApiService, CsvImportService csvImportService) {
        this.refereeApiService = refereeApiService;
        this.csvImportService = csvImportService;
    }

    @GetMapping
    public List<RefereeDTO> list() {
        return refereeApiService.listAll();
    }

    @PostMapping(value = "/import", consumes = "text/plain")
    public ImportResultDTO importCsv(@RequestBody String csv) {
        return csvImportService.importReferees(csv);
    }
}
