import React from "react";
import { BoardIcon } from "../icons/BoardIcons";
import { TRAINING_SESSIONS } from "../data/trainingData";

const formatDate = (iso) => {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const isUrl = (value) => /^https?:\/\//i.test(value);

const DetailsCell = ({ details }) => {
  if (!details) return <span className="muted">—</span>;
  if (isUrl(details)) {
    return (
      <a href={details} target="_blank" rel="noopener noreferrer">
        Join Zoom meeting
      </a>
    );
  }
  return details;
};

const TrainingPage = () => {
  return (
    <section className="board-page">
      <div className="board-page-header">
        <div className="board-page-header-icon">
          <BoardIcon name="training" />
        </div>
        <div>
          <h1>Training</h1>
          <p className="subtle" style={{ marginBottom: 0 }}>
            Training sessions, clinics, and attendance tracking.
          </p>
        </div>
      </div>

      <table className="board-table" aria-label="Training sessions">
        <thead>
          <tr>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Location</th>
            <th>Type</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {TRAINING_SESSIONS.map((row) => (
            <tr key={`${row.startDate}-${row.type}-${row.location}`}>
              <td>{formatDate(row.startDate)}</td>
              <td>{formatDate(row.endDate)}</td>
              <td>{row.location}</td>
              <td>{row.type}</td>
              <td>
                <DetailsCell details={row.details} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default TrainingPage;
