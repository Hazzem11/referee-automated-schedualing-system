package com.example.referee.config;

import com.example.referee.dto.TimeSlotDTO;
import com.example.referee.model.Game;
import com.example.referee.model.Referee;
import com.example.referee.repository.GameRepository;
import com.example.referee.repository.RefereeRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Demo seed data shaped after the OVBABO board: real venue names from the
 * locations directory, member names that match the frontend demo data, and
 * realistic availability/travel variety so the solver visibly makes trade-offs.
 * Coordinates are approximate; edit names/venues here before the demo.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final class Venue {
        final String name;
        final double lat;
        final double lng;

        Venue(String name, double lat, double lng) {
            this.name = name;
            this.lat = lat;
            this.lng = lng;
        }
    }

    private static final Venue EARL_OF_MARCH = new Venue("Earl of March", 45.3189, -75.9070);
    private static final Venue AY_JACKSON = new Venue("A. Y. Jackson", 45.3285, -75.8895);
    private static final Venue RICHCRAFT = new Venue("Richcraft Recreation Complex", 45.3485, -75.9160);
    private static final Venue IMMACULATA = new Venue("Immaculata", 45.4116, -75.6832);
    private static final Venue GLEBE = new Venue("Glebe", 45.4030, -75.6930);
    private static final Venue LISGAR = new Venue("Lisgar", 45.4185, -75.6970);
    private static final Venue NOTRE_DAME = new Venue("Notre Dame-(Ott.)", 45.3880, -75.7320);
    private static final Venue GLOUCESTER = new Venue("Gloucester", 45.4350, -75.6325);
    private static final Venue LOUIS_RIEL = new Venue("Louis Riel", 45.4525, -75.5760);
    private static final Venue CEDARVIEW = new Venue("Cedarview Middle School", 45.2790, -75.7440);
    private static final Venue LONGFIELDS = new Venue("Longfields-Davidson", 45.2740, -75.7530);
    private static final Venue LE_RELAIS = new Venue("E. S. C. Le Relais", 45.3110, -74.6335);

    /** Rotation spreads geography so simultaneous games sit far apart. */
    private static final List<Venue> VENUES = Arrays.asList(
        EARL_OF_MARCH, IMMACULATA, CEDARVIEW, GLOUCESTER, AY_JACKSON, GLEBE,
        LOUIS_RIEL, LONGFIELDS, NOTRE_DAME, RICHCRAFT, LISGAR, LE_RELAIS
    );

    private static final int[] LEVEL_ROTATION = {3, 4, 2, 1, 5, 3, 2, 6, 4, 1, 5, 2};

    private static final String[] LEVEL_LABELS = {
        null, "U-10 Boys", "U-12 Girls", "U-14 Boys", "U-16 Girls", "Senior Women", "Senior Men"
    };

    private static final String[] LEVEL_TYPES = {
        null, "4 x 8min Stopped", "4 x 8min Stopped", "4 x 10min Stopped",
        "4 x 10min Stopped", "4 x 10min Stopped", "4 x 10min Stopped"
    };

    private static final String[][] YOUTH_PAIRS = {
        {"Shooting Stars", "Blue Devils"}, {"Next Level", "Phoenix"},
        {"Wolverines", "Titans"}, {"Impact", "Elite"},
        {"Vipers", "Storm"}, {"Kings", "Rebels"}
    };

    private static final String[][] SENIOR_PAIRS = {
        {"Ottawa Select", "Capital Kings"}, {"Bytown Bears", "Rideau City"}
    };

    private final GameRepository gameRepository;
    private final RefereeRepository refereeRepository;
    private final ObjectMapper objectMapper;

    public DataInitializer(
            GameRepository gameRepository,
            RefereeRepository refereeRepository,
            ObjectMapper objectMapper) {
        this.gameRepository = gameRepository;
        this.refereeRepository = refereeRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        if (refereeRepository.count() > 0) {
            return;
        }

        LocalDate today = LocalDate.now();
        refereeRepository.saveAll(buildReferees(today));
        gameRepository.saveAll(buildGames(today));
    }

    private List<Referee> buildReferees(LocalDate today) throws JsonProcessingException {
        Set<DayOfWeek> weekdays = EnumSet.of(
            DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY, DayOfWeek.FRIDAY);

        List<Referee> referees = new ArrayList<>();
        referees.add(referee("Michael Chagnon", "michael.chagnon@demo.ovbabo.ca", 6,
            "Orléans", 45.4670, -75.5170, 90, "Gloucester, Louis Riel", 5,
            weekly(weekdays, true), Collections.emptySet(), today));
        referees.add(referee("Julie Tremblay", "julie.tremblay@demo.ovbabo.ca", 6,
            "Gatineau (Hull)", 45.4280, -75.7150, 60, "Glebe, Lisgar, Immaculata, Notre Dame-(Ott.)", 5,
            weekly(weekdays, true), Collections.singleton(4), today));
        referees.add(referee("Marcelo Agcaoili", "marcelo.agcaoili@demo.ovbabo.ca", 5,
            "Beacon Hill", 45.4430, -75.6030, 45, "Gloucester, Louis Riel, Immaculata", 4,
            weekly(EnumSet.of(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.THURSDAY), true),
            Collections.emptySet(), today));
        referees.add(referee("Daniel Roy", "daniel.roy@demo.ovbabo.ca", 5,
            "Kanata", 45.3200, -75.9060, 50, "Earl of March, A. Y. Jackson, Richcraft Recreation Complex", 4,
            weekly(EnumSet.of(DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY), true),
            Collections.emptySet(), today));
        referees.add(referee("Hazzem Sukar", "hazzem.sukar11@gmail.com", 4,
            "Sandy Hill", 45.4240, -75.6820, 35, "Immaculata, Glebe, Lisgar", 4,
            weekly(EnumSet.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY), true),
            Collections.emptySet(), today));
        referees.add(referee("Aisha Belanger", "aisha.belanger@demo.ovbabo.ca", 4,
            "Vanier", 45.4340, -75.6610, 30, "Gloucester, Immaculata, Louis Riel", 3,
            weekly(EnumSet.of(DayOfWeek.TUESDAY, DayOfWeek.THURSDAY), true),
            Collections.emptySet(), today));
        referees.add(referee("Samir Haddad", "samir.haddad@demo.ovbabo.ca", 4,
            "Gloucester", 45.4000, -75.6200, 40, "Louis Riel, Gloucester, Cedarview Middle School", 3,
            weekly(EnumSet.of(DayOfWeek.MONDAY, DayOfWeek.THURSDAY), true),
            Collections.singleton(2), today));
        referees.add(referee("Nicolas AbantoEnns", "nicolas.abantoenns@demo.ovbabo.ca", 3,
            "Alta Vista", 45.3885, -75.6560, 25, "Glebe, Immaculata, Notre Dame-(Ott.)", 3,
            weekly(EnumSet.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY), true),
            Collections.emptySet(), today));
        referees.add(referee("Priya Raman", "priya.raman@demo.ovbabo.ca", 3,
            "Barrhaven", 45.2720, -75.7470, 25, "Cedarview Middle School, Longfields-Davidson", 3,
            weekly(EnumSet.of(DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY), true),
            Collections.emptySet(), today));
        referees.add(referee("Karen MacLeod", "karen.macleod@demo.ovbabo.ca", 3,
            "Centrepointe", 45.3480, -75.7620, 30, "Notre Dame-(Ott.), Earl of March, A. Y. Jackson", 3,
            weekly(Collections.emptySet(), true), Collections.emptySet(), today));
        referees.add(referee("Nour-el-islam Aabiyda", "nour.aabiyda@demo.ovbabo.ca", 2,
            "Sandy Hill", 45.4265, -75.6810, 20, "Immaculata, Glebe, Lisgar", 2,
            weekendPlus(DayOfWeek.TUESDAY, DayOfWeek.FRIDAY),
            Collections.singleton(5), today));
        referees.add(referee("Tom Kowalski", "tom.kowalski@demo.ovbabo.ca", 2,
            "Stittsville", 45.2600, -75.9250, 35, "Richcraft Recreation Complex, Earl of March", 2,
            weekly(Collections.emptySet(), true), Collections.emptySet(), today));
        referees.add(referee("Emad Abdelmagid", "emad.abdelmagid@demo.ovbabo.ca", 1,
            "Hunt Club", 45.3570, -75.6580, 25, "Cedarview Middle School, Longfields-Davidson, Glebe", 2,
            weekly(EnumSet.of(DayOfWeek.MONDAY), true), Collections.emptySet(), today));
        referees.add(referee("Mark O'Connor", "mark.oconnor@demo.ovbabo.ca", 1,
            "Manotick", 45.2270, -75.6860, 15, "Cedarview Middle School, Longfields-Davidson", 2,
            weekly(Collections.emptySet(), true), Collections.singleton(6), today));
        return referees;
    }

    private List<Game> buildGames(LocalDate today) {
        List<Game> games = new ArrayList<>();
        int counter = 0;

        // Same-day fixtures keep the "Today's Games" page populated on demo day.
        counter = addGame(games, today, 18, 0, counter);
        counter = addGame(games, today, 19, 30, counter);

        for (int offset = 1; offset <= 7; offset++) {
            LocalDate date = today.plusDays(offset);
            DayOfWeek dow = date.getDayOfWeek();
            if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
                counter = addGame(games, date, 9, 30, counter);
                counter = addGame(games, date, 9, 30, counter);
                counter = addGame(games, date, 11, 15, counter);
                counter = addGame(games, date, 11, 15, counter);
            } else {
                counter = addGame(games, date, 18, 0, counter);
                counter = addGame(games, date, 18, 0, counter);
                counter = addGame(games, date, 19, 30, counter);
            }
        }
        return games;
    }

    private int addGame(List<Game> games, LocalDate date, int hour, int minute, int counter) {
        Venue venue = VENUES.get(counter % VENUES.size());
        int level = LEVEL_ROTATION[counter % LEVEL_ROTATION.length];
        String[] pair = level >= 5
            ? SENIOR_PAIRS[counter % SENIOR_PAIRS.length]
            : YOUTH_PAIRS[counter % YOUTH_PAIRS.length];

        LocalDateTime start = date.atTime(hour, minute);

        Game game = new Game();
        game.setName(LEVEL_LABELS[level] + " — " + pair[0] + " vs " + pair[1]);
        game.setLocation(venue.name);
        game.setLocationLat(venue.lat);
        game.setLocationLng(venue.lng);
        game.setStartTime(start);
        game.setEndTime(start.plusMinutes(durationMinutes(level)));
        game.setLevel(LEVEL_LABELS[level]);
        game.setGameLevel(level);
        game.setRequiredExperienceLevel(level);
        game.setRequiredReferees(2);
        game.setNumberOfGames(1);
        game.setType(LEVEL_TYPES[level]);
        game.setAssigned(false);
        games.add(game);
        return counter + 1;
    }

    private static int durationMinutes(int level) {
        if (level <= 2) {
            return 90;
        }
        return level <= 4 ? 105 : 120;
    }

    private Referee referee(String name, String email, int level, String home,
                            double lat, double lng, int maxTravelKm, String preferredVenues,
                            int maxGamesPerWeek, Map<DayOfWeek, int[]> weeklyAvailability,
                            Set<Integer> blockedDayOffsets, LocalDate today) throws JsonProcessingException {
        Referee referee = new Referee();
        referee.setName(name);
        referee.setEmail(email);
        referee.setExperienceLevel(level);
        referee.setHomeLocation(home);
        referee.setHomeLat(lat);
        referee.setHomeLng(lng);
        referee.setMaxTravelDistance(maxTravelKm);
        referee.setPreferredLocations(preferredVenues);
        referee.setMaxGamesPerWeek(maxGamesPerWeek);
        referee.setAvailabilityJson(availabilityJson(weeklyAvailability, blockedDayOffsets, today));
        referee.setAvailable(true);
        return referee;
    }

    /** Evening windows run 17:00–23:00, weekend windows 08:00–22:00. */
    private static Map<DayOfWeek, int[]> weekly(Set<DayOfWeek> eveningDays, boolean includeWeekends) {
        Map<DayOfWeek, int[]> map = new EnumMap<>(DayOfWeek.class);
        for (DayOfWeek day : eveningDays) {
            map.put(day, new int[]{17, 23});
        }
        if (includeWeekends) {
            map.put(DayOfWeek.SATURDAY, new int[]{8, 22});
            map.put(DayOfWeek.SUNDAY, new int[]{8, 22});
        }
        return map;
    }

    private static Map<DayOfWeek, int[]> weekendPlus(DayOfWeek... eveningDays) {
        return weekly(EnumSet.copyOf(Arrays.asList(eveningDays)), true);
    }

    private String availabilityJson(Map<DayOfWeek, int[]> weekly, Set<Integer> blockedOffsets,
                                    LocalDate today) throws JsonProcessingException {
        List<TimeSlotDTO> slots = new ArrayList<>();
        for (int d = 0; d <= 8; d++) {
            if (blockedOffsets.contains(d)) {
                continue;
            }
            LocalDate date = today.plusDays(d);
            int[] window = weekly.get(date.getDayOfWeek());
            if (window == null) {
                continue;
            }
            TimeSlotDTO slot = new TimeSlotDTO();
            slot.setStartTime(date.atTime(window[0], 0));
            slot.setEndTime(date.atTime(window[1], 0));
            slot.setAvailable(true);
            slots.add(slot);
        }
        return objectMapper.writeValueAsString(slots);
    }
}
