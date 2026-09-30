import React from "react";
import { BoardIcon } from "../icons/BoardIcons";
import { TOURNAMENTS } from "../data/tournamentsData";

const formatDate = (iso) => {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const TournamentsPage = () => {
  return (
    <section className="board-page">
      <div className="board-page-header">
        <div className="board-page-header-icon">
          <BoardIcon name="trophy" />
        </div>
        <div>
          <h1>Tournaments</h1>
          <p className="subtle" style={{ marginBottom: 0 }}>
            Tournament assignments and details.
          </p>
        </div>
      </div>

      <table className="board-table" aria-label="Tournaments schedule">
        <thead>
          <tr>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Location</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {TOURNAMENTS.map((row) => (
            <tr key={`${row.startDate}-${row.description}`}>
              <td>{formatDate(row.startDate)}</td>
              <td>{formatDate(row.endDate)}</td>
              <td>{row.location}</td>
              <td>{row.type}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default TournamentsPage;
