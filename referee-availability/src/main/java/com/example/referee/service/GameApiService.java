package com.example.referee.service;

import com.example.referee.dto.CreateGameRequest;
import com.example.referee.dto.GameDTO;
import com.example.referee.model.Assignment;
import com.example.referee.model.Game;
import com.example.referee.model.Referee;
import com.example.referee.repository.AssignmentRepository;
import com.example.referee.repository.GameRepository;
import com.example.referee.repository.RefereeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GameApiService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("H:mm");

    private final GameRepository gameRepository;
    private final AssignmentRepository assignmentRepository;
    private final RefereeRepository refereeRepository;
    private final NotificationService notificationService;

    public GameApiService(GameRepository gameRepository,
                          AssignmentRepository assignmentRepository,
                          RefereeRepository refereeRepository,
                          NotificationService notificationService) {
        this.gameRepository = gameRepository;
        this.assignmentRepository = assignmentRepository;
        this.refereeRepository = refereeRepository;
        this.notificationService = notificationService;
    }

    public List<GameDTO> listAll() {
        return gameRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public GameDTO create(CreateGameRequest req) {
        Game g = new Game();
        applyRequest(g, req);
        g.setName("Game — " + req.getLocation() + " " + req.getDate());
        g.setAssigned(false);

        gameRepository.save(g);
        return toDto(g);
    }

    /**
     * Updates a game; if venue or kickoff changed and the game already has
     * published assignments, the assigned referees are emailed about the change.
     */
    public GameDTO update(Long id, CreateGameRequest req) {
        Game g = gameRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found: " + id));

        String oldLocation = g.getLocation();
        LocalDateTime oldStart = g.getStartTime();
        LocalDateTime oldEnd = g.getEndTime();

        applyRequest(g, req);
        gameRepository.save(g);

        boolean venueChanged = !Objects.equals(oldLocation, g.getLocation());
        boolean timeChanged = !Objects.equals(oldStart, g.getStartTime())
            || !Objects.equals(oldEnd, g.getEndTime());

        if (venueChanged || timeChanged) {
            List<Referee> crew = assignmentRepository.findByGameId(id).stream()
                .map(Assignment::getRefereeId)
                .map(refereeRepository::findById)
                .flatMap(Optional::stream)
                .collect(Collectors.toList());
            if (!crew.isEmpty()) {
                notificationService.sendGameChangeNotification(
                    g, oldLocation, oldStart, oldEnd, venueChanged, timeChanged, crew);
            }
        }
        return toDto(g);
    }

    private void applyRequest(Game g, CreateGameRequest req) {
        LocalDate date = LocalDate.parse(req.getDate(), DATE_FMT);
        LocalTime time = parseTime(req.getTime());
        LocalDateTime start = LocalDateTime.of(date, time);
        LocalDateTime end = start.plusHours(2);

        int crew = req.getRequiredReferees() != null && req.getRequiredReferees() > 0
            ? req.getRequiredReferees() : 3;

        g.setLocation(req.getLocation());
        g.setLocationPlaceId(req.getLocationPlaceId() != null ? req.getLocationPlaceId() : "");
        g.setLocationLat(req.getLocationLat());
        g.setLocationLng(req.getLocationLng());
        g.setStartTime(start);
        g.setEndTime(end);
        g.setLevel(req.getLevel() != null ? req.getLevel() : "");
        g.setGameLevel(req.getGameLevel());
        g.setRequiredExperienceLevel(req.getGameLevel());
        g.setRequiredReferees(crew);
        g.setNumberOfGames(req.getNumberOfGames());
        g.setType(req.getType() != null ? req.getType() : "");
    }

    private LocalTime parseTime(String time) {
        try {
            return LocalTime.parse(time, DateTimeFormatter.ISO_LOCAL_TIME);
        } catch (DateTimeParseException e1) {
            try {
                return LocalTime.parse(time, TIME_FMT);
            } catch (DateTimeParseException e2) {
                return LocalTime.of(12, 0);
            }
        }
    }

    private GameDTO toDto(Game g) {
        GameDTO dto = new GameDTO();
        dto.setId(g.getId());
        dto.setName(g.getName());
        dto.setLocation(g.getLocation());
        dto.setStartTime(g.getStartTime());
        dto.setEndTime(g.getEndTime());
        dto.setLevel(g.getLevel());
        dto.setGameLevel(g.getGameLevel());
        dto.setRequiredReferees(g.getRequiredReferees());
        dto.setNumberOfGames(g.getNumberOfGames());
        dto.setType(g.getType());
        dto.setStatus(g.isAssigned() ? "assigned" : "open");
        return dto;
    }
}
