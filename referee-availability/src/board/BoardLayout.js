import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import "./BoardLayout.css";
import BouncingBall from "../components/BouncingBall";
import { BoardIcon, getGroupIcon, getLinkIcon } from "./icons/BoardIcons";
import { useAuth } from "../auth/AuthContext";
import { DEMO_ROLES, ROLE_LABELS, isAdmin } from "../auth/roles";

/** @param {string | null | undefined} role @param {{ roles?: string[] }} link */
function canSeeLink(role, link) {
  if (!role) return false;
  if (!link.roles || link.roles.length === 0) return true;
  return isAdmin(role) || link.roles.includes(role);
}

const NAV_DEFINITION = [
  {
    title: "Public",
    links: [
      { to: "/board/public/executive-team", label: "Executive & Team" },
      { to: "/board/public/locations", label: "Locations" },
    ],
  },
  {
    title: "Members",
    links: [
      { to: "/board/admin/account", label: "My account" },
      { to: "/board/members/updates", label: "OVBABO Updates" },
      { to: "/board/members/rules", label: "Rules & Mechanics" },
      { to: "/board/members/policies", label: "Policies & Procedures" },
      { to: "/board/members/list", label: "Members" },
      { to: "/board/members/referee-coach-list", label: "Referee Coach List" },
    ],
  },
  {
    title: "Games",
    links: [
      { to: "/board/games/my-games", label: "My Games" },
      { to: "/board/games/availability", label: "Availability" },
      { to: "/board/games/tournaments", label: "Tournaments" },
      { to: "/board/games/training", label: "Training" },
      { to: "/board/games/today", label: "Today's Games" },
      {
        to: "/board/games/manage",
        label: "Manage Games",
        roles: [DEMO_ROLES.ADMIN, DEMO_ROLES.GAME_ASSIGNER],
      },
    ],
  },
  {
    title: "Evaluations",
    links: [
      {
        to: "/board/evaluations/my-games",
        label: "My Games (Evaluate)",
        roles: [DEMO_ROLES.ADMIN, DEMO_ROLES.REFEREE_COACH],
      },
      {
        to: "/board/evaluations/docs",
        label: "Evaluation Docs",
        roles: [DEMO_ROLES.ADMIN, DEMO_ROLES.REFEREE_COACH],
      },
    ],
  },
  {
    title: "Reports",
    links: [
      { to: "/board/reports/lateness", label: "Lateness" },
      { to: "/board/reports/absence", label: "Absence" },
      { to: "/board/reports/incident", label: "Incident" },
      { to: "/board/reports/executive-minutes", label: "Executive Minutes" },
      { to: "/board/reports/constitution", label: "Constitution" },
    ],
  },
  {
    title: "Admin",
    links: [
      {
        to: "/board/admin/questions",
        label: "Questions & Interpretations",
        roles: [DEMO_ROLES.ADMIN],
      },
      { to: "/board/admin/dues-fees", label: "Dues/Fees", roles: [DEMO_ROLES.ADMIN] },
      { to: "/board/admin/register", label: "Register", roles: [DEMO_ROLES.ADMIN] },
      { to: "/board/admin/password", label: "Password", roles: [DEMO_ROLES.ADMIN] },
      { to: "/board/admin/suspensions", label: "Suspensions", roles: [DEMO_ROLES.ADMIN] },
      {
        to: "/board/admin/auto-assign",
        label: "Auto-Assign",
        roles: [DEMO_ROLES.ADMIN, DEMO_ROLES.GAME_ASSIGNER],
      },
      {
        to: "/board/admin/referees",
        label: "Referees",
        roles: [DEMO_ROLES.ADMIN, DEMO_ROLES.GAME_ASSIGNER],
      },
      { to: "/board/admin/logout", label: "Logout", roles: [DEMO_ROLES.ADMIN] },
    ],
  },
];

const getSavedTheme = () => {
  try {
    return localStorage.getItem("theme") || "light";
  } catch {
    return "light";
  }
};

const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // ignore
  }
};

const Icon = ({ name }) => {
  switch (name) {
    case "moon":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      );
    default:
      return null;
  }
};

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BoardLayout = () => {
  const [theme, setThemeState] = useState(getSavedTheme());
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  const nav = useMemo(() => {
    return NAV_DEFINITION.map((group) => ({
      ...group,
      links: group.links.filter((l) => canSeeLink(role, l)),
    })).filter((g) => g.links.length > 0);
  }, [role]);

  const toggleTheme = () => setThemeState((t) => (t === "light" ? "dark" : "light"));

  const handleSwitchRole = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="board-shell">
      <div className="board-topbar">
        <div className="board-brand">
          <div className="board-brand-logo-zone">
            <img className="board-logo" src="/ovbabo-logo.png" alt="OVBABO logo" />
          </div>
          <div className="board-title">
            <strong>OVBABO Official Website</strong>
            <span>
              Internal website for members of Ottawa Valley Board of Approved Basketball Officials
            </span>
          </div>
        </div>

        <div className="board-actions">
          {role && (
            <span className="board-role-badge" title="Demo permission level">
              Role: {ROLE_LABELS[role] ?? role}
            </span>
          )}
          <button type="button" className="board-switch-role" onClick={handleSwitchRole}>
            Switch role
          </button>
          <Link
            className="board-icon-button board-avatar-button"
            to="/board/admin/account"
            aria-label="Open account"
            title="Account"
          >
            <span className="board-avatar">
              <UserIcon />
            </span>
          </Link>
          <button className="board-icon-button" onClick={toggleTheme} type="button">
            <Icon name={theme === "light" ? "moon" : "sun"} />
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </div>

      <div className="board-body">
        <aside className="board-sidebar" aria-label="Board navigation">
          {nav.map((group) => (
            <div key={group.title} className="board-nav-group">
              <div className="board-nav-group-title">
                <BoardIcon name={getGroupIcon(group.title)} className="board-nav-group-icon" />
                {group.title}
              </div>
              {group.links.map((l) => (
                <NavLink key={l.to} to={l.to} className="board-nav-link">
                  <BoardIcon name={getLinkIcon(l.to)} className="board-nav-link-icon" />
                  <span className="board-nav-link-label">{l.label}</span>
                  <BoardIcon name="chevron" className="board-nav-link-chevron" />
                </NavLink>
              ))}
            </div>
          ))}
        </aside>

        <main className="board-main">
          <Outlet />
        </main>
      </div>

      <BouncingBall size={26} variant="floating" />
    </div>
  );
};

export default BoardLayout;
