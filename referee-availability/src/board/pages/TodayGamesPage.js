import React from "react";
import { BoardIcon } from "../icons/BoardIcons";

const TodayGamesPage = () => {
  return (
    <section className="board-page">
      <div className="board-page-header">
        <div className="board-page-header-icon">
          <BoardIcon name="calendar-day" />
        </div>
        <div>
          <h1>Today&apos;s Games</h1>
          <p className="subtle" style={{ marginBottom: 0 }}>
            Daily schedule view for assigned referees.
          </p>
        </div>
      </div>

      <p className="subtle" style={{ marginBottom: 0 }}>
        No games for today
      </p>
    </section>
  );
};

export default TodayGamesPage;
