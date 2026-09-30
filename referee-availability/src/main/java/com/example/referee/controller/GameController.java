package com.example.referee.controller;

import com.example.referee.dto.CreateGameRequest;
import com.example.referee.dto.GameDTO;
import com.example.referee.dto.ImportResultDTO;
import com.example.referee.service.CsvImportService;
import com.example.referee.service.GameApiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameApiService gameApiService;
    private final CsvImportService csvImportService;

    public GameController(GameApiService gameApiService, CsvImportService csvImportService) {
        this.gameApiService = gameApiService;
        this.csvImportService = csvImportService;
    }

    @GetMapping
    public List<GameDTO> list() {
        return gameApiService.listAll();
    }

    @PostMapping
    public GameDTO create(@Valid @RequestBody CreateGameRequest request) {
        return gameApiService.create(request);
    }

    @PutMapping("/{id}")
    public GameDTO update(@PathVariable Long id, @Valid @RequestBody CreateGameRequest request) {
        return gameApiService.update(id, request);
    }

    @PostMapping(value = "/import", consumes = "text/plain")
    public ImportResultDTO importCsv(@RequestBody String csv) {
        return csvImportService.importGames(csv);
    }
}
