import React from "react";
import { BoardIcon } from "../icons/BoardIcons";
import { EXECUTIVE_MINUTES } from "../data/executiveMinutesData";

const ExecutiveMinutesPage = () => {
  const [latest, ...archive] = EXECUTIVE_MINUTES;

  return (
    <section className="board-page">
      <div className="board-page-header">
        <div className="board-page-header-icon">
          <BoardIcon name="file-text" />
        </div>
        <div>
          <h1>Executive Minutes</h1>
          <p className="subtle" style={{ marginBottom: 0 }}>
            Executive meeting minutes and archives.
          </p>
        </div>
      </div>

      {latest && (
        <div className="board-card" style={{ marginBottom: "1rem" }}>
          <h3 style={{ margin: "0 0 0.5rem 0" }}>Latest meeting</h3>
          <a href={latest.href} target="_blank" rel="noopener noreferrer">
            {latest.title}
          </a>
        </div>
      )}

      {archive.length > 0 && (
        <>
          <h2 style={{ fontSize: "1rem", margin: "0 0 0.75rem 0" }}>Archive</h2>
          <table className="board-table" aria-label="Executive minutes archive">
            <thead>
              <tr>
                <th>Date</th>
                <th>Document</th>
              </tr>
            </thead>
            <tbody>
              {archive.map((doc) => (
                <tr key={doc.href}>
                  <td className="muted">{doc.date}</td>
                  <td>
                    <a href={doc.href} target="_blank" rel="noopener noreferrer">
                      {doc.title}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
};

export default ExecutiveMinutesPage;
