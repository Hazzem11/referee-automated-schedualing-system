import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { DEMO_ROLES, ROLE_LABELS } from "../auth/roles";
import "./LoginPage.css";
import BouncingBall from "../components/BouncingBall";
import { BoardIcon } from "../board/icons/BoardIcons";

const ROLE_OPTIONS = [
  {
    id: DEMO_ROLES.ADMIN,
    title: "Admin",
    icon: "shield",
    description: "Webmaster: site updates, documents, user accounts, and full admin tools.",
  },
  {
    id: DEMO_ROLES.GAME_ASSIGNER,
    title: "Game assigner",
    icon: "shuffle",
    description: "Run auto-assign, view all referee availability, and assign games.",
  },
  {
    id: DEMO_ROLES.REFEREE_COACH,
    title: "Referee coach",
    icon: "clipboard-check",
    description: "Evaluation tools and coach-only assignment views.",
  },
  {
    id: DEMO_ROLES.REFEREE,
    title: "Referee",
    icon: "user-circle",
    description: "Submit availability, see updates, and view your assignments.",
  },
];

const LoginPage = () => {
  const { setRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(DEMO_ROLES.REFEREE);

  if (isAuthenticated) {
    return <Navigate to="/board/members/updates" replace />;
  }

  const handleContinue = () => {
    setRole(selected);
    navigate("/board/members/updates", { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <BouncingBall size={32} variant="hero" />
        <h1>OVBABO Official Website</h1>
        <p className="login-sub">
          Choose a permission level for this session. No password — this is for demonstration only.
        </p>

        <div className="login-role-grid" role="radiogroup" aria-label="Permission level">
          {ROLE_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={`login-role-option ${selected === opt.id ? "selected" : ""}`}
            >
              <span className="login-role-icon" aria-hidden="true">
                <BoardIcon name={opt.icon} />
              </span>
              <input
                type="radio"
                name="demoRole"
                value={opt.id}
                checked={selected === opt.id}
                onChange={() => setSelected(opt.id)}
              />
              <span className="login-role-title">{opt.title}</span>
              <span className="login-role-desc">{opt.description}</span>
            </label>
          ))}
        </div>

        <button type="button" className="login-continue" onClick={handleContinue}>
          Continue as {ROLE_LABELS[selected]}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
