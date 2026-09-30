import React, { useMemo, useState } from "react";
import { BoardIcon } from "../icons/BoardIcons";
import locations from "../data/locations.json";

const LocationsPage = () => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter((loc) => {
      const haystack = `${loc.name} ${loc.address} ${loc.phone || ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  return (
    <section className="board-page">
      <div className="board-page-header">
        <div className="board-page-header-icon">
          <BoardIcon name="map-pin" />
        </div>
        <div>
          <h1>Locations</h1>
          <p className="subtle" style={{ marginBottom: 0 }}>
            Gym and venue directory with maps and notes.
          </p>
        </div>
      </div>

      <div className="board-actions-row">
        <input
          className="board-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, address, or phone…"
          aria-label="Search locations"
        />
        <span className="subtle" style={{ margin: 0, whiteSpace: "nowrap" }}>
          {filtered.length} location{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      <table className="board-table" aria-label="Locations directory">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={3}>No locations match your search.</td>
            </tr>
          ) : (
            filtered.map((loc) => (
              <tr key={`${loc.name}-${loc.address}`}>
                <td>
                  <strong>{loc.name}</strong>
                </td>
                <td>{loc.address}</td>
                <td className="muted">{loc.phone || "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
};

export default LocationsPage;
