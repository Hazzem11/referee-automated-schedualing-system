import React from "react";
import { BoardIcon } from "../icons/BoardIcons";

const SectionPlaceholderPage = ({ title, subtitle, icon = "link", notes = [] }) => {
  return (
    <section className="board-page">
      <div className="board-page-header">
        <div className="board-page-header-icon">
          <BoardIcon name={icon} />
        </div>
        <div>
          <h1>{title}</h1>
          <p className="subtle" style={{ marginBottom: 0 }}>
            {subtitle || "This section is available in the navigation and ready for feature wiring."}
          </p>
        </div>
      </div>

      {notes.length > 0 && (
        <div className="board-card-grid">
          {notes.map((note) => (
            <div key={note} className="board-card">
              <p>{note}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SectionPlaceholderPage;
