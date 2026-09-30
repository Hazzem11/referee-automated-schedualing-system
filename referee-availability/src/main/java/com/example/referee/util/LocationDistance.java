package com.example.referee.util;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Distance helpers.
 *
 * - If coordinates are available, use geodesic distance (km).
 * - Otherwise fall back to a simple named-grid approximation.
 */
public final class LocationDistance {

    private static final Map<String, int[]> GRID_KM = new HashMap<>();

    static {
        put("downtown", 0, 0);
        put("north side", 0, 12);
        put("east side", 10, 5);
        put("west side", -8, 4);
        put("south side", 2, -14);
    }

    private LocationDistance() {
    }

    private static void put(String name, int x, int y) {
        GRID_KM.put(name, new int[]{x, y});
    }

    private static int[] coords(String location) {
        if (location == null || location.isBlank()) {
            return new int[]{0, 0};
        }
        String key = location.toLowerCase(Locale.ROOT).trim();
        return GRID_KM.getOrDefault(key, new int[]{0, 0});
    }

    /**
     * Approximate travel distance in km (Manhattan on a small grid).
     */
    public static int kmBetween(String from, String to) {
        int[] a = coords(from);
        int[] b = coords(to);
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    }

    /**
     * Haversine distance in km between two coordinate points.
     */
    public static int kmBetween(Double lat1, Double lng1, Double lat2, Double lng2) {
        if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) {
            return 0;
        }
        double r = 6371.0; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
            * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (int) Math.round(r * c);
    }
}
