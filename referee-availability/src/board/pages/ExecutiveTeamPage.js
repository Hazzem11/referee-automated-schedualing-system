import React from "react";
import { BoardIcon } from "../icons/BoardIcons";
import { EXECUTIVE_TEAM } from "../data/executiveTeamData";
import "./ExecutiveTeamPage.css";

const MemberAvatar = ({ name }) => {
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="executive-avatar" aria-hidden="true">
      <span>{initials}</span>
    </div>
  );
};

const ExecutiveTeamPage = () => {
  return (
    <section className="board-page executive-team-page">
      <div className="board-page-header">
        <div className="board-page-header-icon">
          <BoardIcon name="users" />
        </div>
        <div>
          <h1>Executive & Team</h1>
          <p className="subtle" style={{ marginBottom: 0 }}>
            Board executive contacts and committee roles.
          </p>
        </div>
      </div>

      <ul className="executive-team-list">
        {EXECUTIVE_TEAM.map((member) => (
          <li key={member.email} className="executive-team-row">
            <MemberAvatar name={member.name} />
            <div className="executive-team-details">
              <span className="executive-role">{member.role}</span>
              <strong className="executive-name">{member.name}</strong>
              <a className="executive-email" href={`mailto:${member.email}`}>
                {member.email}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ExecutiveTeamPage;
