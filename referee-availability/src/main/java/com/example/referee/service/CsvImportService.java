package com.example.referee.service;

import com.example.referee.dto.CreateGameRequest;
import com.example.referee.dto.ImportResultDTO;
import com.example.referee.model.Game;
import com.example.referee.model.Referee;
import com.example.referee.repository.GameRepository;
import com.example.referee.repository.RefereeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * CSV imports for bulk-loading the roster and the season schedule.
 *
 * Referees: name,email,experienceLevel,homeLocation,maxTravelDistance,preferredLocations,maxGamesPerWeek
 * Games:    date,time,location,gameLevel,type,numberOfGames,requiredReferees
 *
 * A header row is optional. Bad rows are skipped with a per-row error rather
 * than failing the whole file.
 */
@Service
public class CsvImportService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("H:mm");

    private final RefereeRepository refereeRepository;
    private final GameRepository gameRepository;
    private final GameApiService gameApiService;

    public CsvImportService(RefereeRepository refereeRepository,
                            GameRepository gameRepository,
                            GameApiService gameApiService) {
        this.refereeRepository = refereeRepository;
        this.gameRepository = gameRepository;
        this.gameApiService = gameApiService;
    }

    public ImportResultDTO importReferees(String csv) {
        ImportResultDTO result = new ImportResultDTO();
        List<List<String>> rows = parseCsv(csv);
        if (rows.isEmpty()) {
            result.getErrors().add("No rows found in the file.");
            return result;
        }

        Set<String> existingEmails = refereeRepository.findAll().stream()
            .map(r -> r.getEmail() == null ? "" : r.getEmail().toLowerCase(Locale.ROOT))
            .filter(e -> !e.isEmpty())
            .collect(Collectors.toSet());

        int start = rows.get(0).get(0).equalsIgnoreCase("name") ? 1 : 0;
        for (int i = start; i < rows.size(); i++) {
            List<String> cols = rows.get(i);
            int rowNum = i + 1;

            String name = col(cols, 0);
            if (name.isBlank()) {
                skip(result, rowNum, "missing name");
                continue;
            }
            String email = col(cols, 1);
            if (!email.isBlank() && existingEmails.contains(email.toLowerCase(Locale.ROOT))) {
                skip(result, rowNum, "email already exists: " + email);
                continue;
            }
            Integer level = parseInt(col(cols, 2), 1, 6, 1, result, rowNum, "experienceLevel");
            if (level == null) continue;
            Integer travel = parseInt(col(cols, 4), 1, 500, 50, result, rowNum, "maxTravelDistance");
            if (travel == null) continue;
            Integer maxGames = parseInt(col(cols, 6), 1, 20, 3, result, rowNum, "maxGamesPerWeek");
            if (maxGames == null) continue;

            Referee referee = new Referee();
            referee.setName(name);
            referee.setEmail(email);
            referee.setExperienceLevel(level);
            referee.setHomeLocation(col(cols, 3));
            referee.setMaxTravelDistance(travel);
            referee.setPreferredLocations(col(cols, 5));
            referee.setMaxGamesPerWeek(maxGames);
            referee.setAvailabilityJson("[]");
            referee.setAvailable(true);
            refereeRepository.save(referee);

            if (!email.isBlank()) {
                existingEmails.add(email.toLowerCase(Locale.ROOT));
            }
            result.setImported(result.getImported() + 1);
        }
        return result;
    }

    public ImportResultDTO importGames(String csv) {
        ImportResultDTO result = new ImportResultDTO();
        List<List<String>> rows = parseCsv(csv);
        if (rows.isEmpty()) {
            result.getErrors().add("No rows found in the file.");
            return result;
        }

        Set<String> existingKeys = gameRepository.findAll().stream()
            .map(g -> gameKey(g.getLocation(), g.getStartTime()))
            .collect(Collectors.toSet());

        int start = rows.get(0).get(0).equalsIgnoreCase("date") ? 1 : 0;
        for (int i = start; i < rows.size(); i++) {
            List<String> cols = rows.get(i);
            int rowNum = i + 1;

            String date = col(cols, 0);
            String time = col(cols, 1);
            String location = col(cols, 2);
            if (date.isBlank() || time.isBlank() || location.isBlank()) {
                skip(result, rowNum, "date, time and location are required");
                continue;
            }

            LocalDateTime startTime = parseDateTime(date, time);
            if (startTime == null) {
                skip(result, rowNum, "unparseable date/time: '" + date + "' '" + time + "' (want YYYY-MM-DD and HH:MM)");
                continue;
            }
            Integer level = parseInt(col(cols, 3), 1, 6, 0, result, rowNum, "gameLevel");
            if (level == null || level == 0) {
                if (level != null) {
                    skip(result, rowNum, "gameLevel is required (1–6)");
                }
                continue;
            }
            Integer numberOfGames = parseInt(col(cols, 5), 1, 20, 1, result, rowNum, "numberOfGames");
            if (numberOfGames == null) continue;
            Integer crew = parseInt(col(cols, 6), 1, 5, 2, result, rowNum, "requiredReferees");
            if (crew == null) continue;

            String key = gameKey(location, startTime);
            if (existingKeys.contains(key)) {
                skip(result, rowNum, "duplicate game (same venue and start time)");
                continue;
            }

            CreateGameRequest req = new CreateGameRequest();
            req.setDate(date);
            req.setTime(time);
            req.setLocation(location);
            req.setGameLevel(level);
            req.setType(col(cols, 4));
            req.setNumberOfGames(numberOfGames);
            req.setRequiredReferees(crew);
            gameApiService.create(req);

            existingKeys.add(key);
            result.setImported(result.getImported() + 1);
        }
        return result;
    }

    private static String gameKey(String location, LocalDateTime startTime) {
        return location.toLowerCase(Locale.ROOT).trim() + "|" + startTime;
    }

    private static String col(List<String> cols, int index) {
        return index < cols.size() ? cols.get(index).trim() : "";
    }

    private static void skip(ImportResultDTO result, int rowNum, String reason) {
        result.setSkipped(result.getSkipped() + 1);
        result.getErrors().add("Row " + rowNum + ": " + reason);
    }

    /** Returns null (and records a skip) only when the value is present but invalid. */
    private static Integer parseInt(String raw, int min, int max, int defaultValue,
                                    ImportResultDTO result, int rowNum, String field) {
        if (raw.isBlank()) {
            return defaultValue;
        }
        try {
            int value = Integer.parseInt(raw);
            if (value < min || value > max) {
                skip(result, rowNum, field + " must be " + min + "–" + max + ", got '" + raw + "'");
                return null;
            }
            return value;
        } catch (NumberFormatException e) {
            skip(result, rowNum, field + " is not a number: '" + raw + "'");
            return null;
        }
    }

    private static LocalDateTime parseDateTime(String date, String time) {
        try {
            LocalDate d = LocalDate.parse(date, DATE_FMT);
            LocalTime t;
            try {
                t = LocalTime.parse(time, DateTimeFormatter.ISO_LOCAL_TIME);
            } catch (DateTimeParseException e) {
                t = LocalTime.parse(time, TIME_FMT);
            }
            return LocalDateTime.of(d, t);
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    /** Minimal CSV parser: commas, double-quoted fields, "" escapes, CRLF-safe. */
    private static List<List<String>> parseCsv(String csv) {
        List<List<String>> rows = new ArrayList<>();
        List<String> current = new ArrayList<>();
        StringBuilder field = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < csv.length(); i++) {
            char c = csv.charAt(i);
            if (inQuotes) {
                if (c == '"') {
                    if (i + 1 < csv.length() && csv.charAt(i + 1) == '"') {
                        field.append('"');
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    field.append(c);
                }
            } else if (c == '"') {
                inQuotes = true;
            } else if (c == ',') {
                current.add(field.toString());
                field.setLength(0);
            } else if (c == '\n' || c == '\r') {
                if (c == '\r' && i + 1 < csv.length() && csv.charAt(i + 1) == '\n') {
                    i++;
                }
                current.add(field.toString());
                field.setLength(0);
                if (current.stream().anyMatch(s -> !s.isBlank())) {
                    rows.add(current);
                }
                current = new ArrayList<>();
            } else {
                field.append(c);
            }
        }
        current.add(field.toString());
        if (current.stream().anyMatch(s -> !s.isBlank())) {
            rows.add(current);
        }
        return rows;
    }
}
