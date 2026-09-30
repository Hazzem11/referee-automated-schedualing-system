import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";
import Scheduler from "./Scheduler";
import GameManager from "./GameManager";
import AssignmentVisualizer from "./components/AssignmentVisualizer";
import RefereeList from "./components/RefereeList";
import BoardLayout from "./board/BoardLayout";
import UpdatesPage from "./board/pages/UpdatesPage";
import MyGamesPage from "./board/pages/MyGamesPage";
import RulesPage from "./board/pages/RulesPage";
import SectionPlaceholderPage from "./board/pages/SectionPlaceholderPage";
import ExecutiveTeamPage from "./board/pages/ExecutiveTeamPage";
import LocationsPage from "./board/pages/LocationsPage";
import ExecutiveMinutesPage from "./board/pages/ExecutiveMinutesPage";
import TodayGamesPage from "./board/pages/TodayGamesPage";
import TournamentsPage from "./board/pages/TournamentsPage";
import TrainingPage from "./board/pages/TrainingPage";
import AccountPage from "./board/pages/AccountPage";
import QuestionsPage from "./board/pages/QuestionsPage";
import DuesFeesPage from "./board/pages/DuesFeesPage";
import ReportFormPage from "./board/pages/ReportFormPage";
import MemberDirectoryPage from "./board/pages/MemberDirectoryPage";
import { MEMBERS, REFEREE_COACHES } from "./board/data/membersData";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./auth/AuthProvider";
import { useAuth } from "./auth/AuthContext";
import { RequireAuth } from "./auth/RequireAuth";
import { RequireRole } from "./auth/RequireRole";
import { DEMO_ROLES } from "./auth/roles";

const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Navigate
      to={isAuthenticated ? "/board/members/updates" : "/login"}
      replace
    />
  );
};

const Home = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
              <span>Dark Mode</span>
            </>
          ) : (
            <>
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
              <span>Light Mode</span>
            </>
          )}
        </button>
        <h1>Referee Availability Manager</h1>
        <p className="subtitle">Streamline your game assignments with our automated scheduling system</p>
      </header>

      <div className="features-grid">
        <div className="feature-card">
          <div className="icon-container">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2>Submit Availability</h2>
          <p>Manage your schedule and submit your availability for upcoming games</p>
          <Link to="/scheduler" className="action-button">
            Get Started
          </Link>
        </div>

        <div className="feature-card">
          <div className="icon-container">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2>View Assignments</h2>
          <p>See the optimized referee assignments for all games</p>
          <Link to="/assignments" className="action-button">
            View Assignments
          </Link>
        </div>

        <div className="feature-card">
          <div className="icon-container">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h2>Manage Referees</h2>
          <p>Access referee profiles, experience levels, and performance metrics</p>
          <Link to="/referees" className="action-button">
            Manage Team
          </Link>
        </div>

        <div className="feature-card">
          <div className="icon-container">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 10h16M4 14h10M4 18h16" />
            </svg>
          </div>
          <h2>Manage Games</h2>
          <p>Add matches that need officials; data feeds the automated scheduler</p>
          <Link to="/games" className="action-button">
            Open Game Manager
          </Link>
        </div>
      </div>
    </div>
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<RootRedirect />} />

    <Route path="/legacy" element={<Home />} />
    <Route path="/scheduler" element={<Scheduler />} />
    <Route path="/games" element={<GameManager />} />
    <Route path="/assignments" element={<AssignmentVisualizer backHref="/legacy" />} />
    <Route path="/referees" element={<RefereeList backHref="/legacy" />} />

    <Route
      path="/board"
      element={
        <RequireAuth>
          <BoardLayout />
        </RequireAuth>
      }
    >
      <Route index element={<Navigate to="/board/members/updates" replace />} />

      <Route path="public/executive-team" element={<ExecutiveTeamPage />} />
      <Route path="public/locations" element={<LocationsPage />} />

      <Route path="members/updates" element={<UpdatesPage />} />
      <Route path="members/rules" element={<RulesPage />} />
      <Route
        path="members/policies"
        element={
          <SectionPlaceholderPage
            title="Policies & Procedures"
            subtitle="Member policies, procedures, and governance references."
          />
        }
      />
      <Route
        path="members/list"
        element={
          <MemberDirectoryPage
            title="Members"
            subtitle="Member directory with contact information."
            members={MEMBERS}
          />
        }
      />
      <Route
        path="members/referee-coach-list"
        element={
          <MemberDirectoryPage
            title="Referee Coach List"
            subtitle="Referee coach contacts and assignment details."
            members={REFEREE_COACHES}
            showRole
          />
        }
      />

      <Route path="games">
        <Route path="my-games" element={<MyGamesPage />} />
        <Route path="availability" element={<Scheduler embedded />} />
        <Route path="tournaments" element={<TournamentsPage />} />
        <Route path="training" element={<TrainingPage />} />
        <Route path="today" element={<TodayGamesPage />} />
        <Route
          path="manage"
          element={
            <RequireRole allow={[DEMO_ROLES.GAME_ASSIGNER]}>
              <GameManager embedded />
            </RequireRole>
          }
        />
      </Route>

      <Route
        path="evaluations/my-games"
        element={
          <RequireRole allow={[DEMO_ROLES.REFEREE_COACH]}>
            <SectionPlaceholderPage title="My Games (Evaluate)" subtitle="Evaluation-specific game list for referees." />
          </RequireRole>
        }
      />
      <Route
        path="evaluations/docs"
        element={
          <RequireRole allow={[DEMO_ROLES.REFEREE_COACH]}>
            <SectionPlaceholderPage title="Evaluation Docs" subtitle="Evaluation forms, guides, and reference documents." />
          </RequireRole>
        }
      />

      <Route path="reports/lateness" element={<ReportFormPage reportType="lateness" />} />
      <Route path="reports/absence" element={<ReportFormPage reportType="absence" />} />
      <Route path="reports/incident" element={<ReportFormPage reportType="incident" />} />
      <Route path="reports/executive-minutes" element={<ExecutiveMinutesPage />} />
      <Route
        path="reports/constitution"
        element={<SectionPlaceholderPage title="Constitution" subtitle="Constitution documents and amendments." />}
      />

      <Route path="admin">
        <Route path="account" element={<AccountPage />} />
        <Route
          path="questions"
          element={
            <RequireRole allow={[DEMO_ROLES.ADMIN]}>
              <QuestionsPage />
            </RequireRole>
          }
        />
        <Route
          path="dues-fees"
          element={
            <RequireRole allow={[DEMO_ROLES.ADMIN]}>
              <DuesFeesPage />
            </RequireRole>
          }
        />
        <Route
          path="register"
          element={
            <RequireRole allow={[DEMO_ROLES.ADMIN]}>
              <SectionPlaceholderPage title="Register" subtitle="Registration workflows for members and events." />
            </RequireRole>
          }
        />
        <Route
          path="password"
          element={
            <RequireRole allow={[DEMO_ROLES.ADMIN]}>
              <SectionPlaceholderPage title="Password" subtitle="Password reset and account security settings." />
            </RequireRole>
          }
        />
        <Route
          path="suspensions"
          element={
            <RequireRole allow={[DEMO_ROLES.ADMIN]}>
              <SectionPlaceholderPage title="Suspensions" subtitle="Suspension records and status tracking." />
            </RequireRole>
          }
        />
        <Route
          path="auto-assign"
          element={
            <RequireRole allow={[DEMO_ROLES.GAME_ASSIGNER]}>
              <AssignmentVisualizer
                backHref="/board/members/updates"
                secondaryHref="/board/admin/referees"
                secondaryLabel="Referees"
              />
            </RequireRole>
          }
        />
        <Route
          path="referees"
          element={
            <RequireRole allow={[DEMO_ROLES.GAME_ASSIGNER]}>
              <RefereeList
                backHref="/board/members/updates"
                secondaryHref="/board/admin/auto-assign"
                secondaryLabel="Auto-Assign"
              />
            </RequireRole>
          }
        />
        <Route
          path="logout"
          element={
            <RequireRole allow={[DEMO_ROLES.ADMIN]}>
              <SectionPlaceholderPage title="Logout" subtitle="Demo logout entry point (auth flow to be wired)." />
            </RequireRole>
          }
        />
      </Route>
    </Route>
  </Routes>
);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
