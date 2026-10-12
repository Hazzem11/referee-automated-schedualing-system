import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api";
import "./LoginPage.css";
import BouncingBall from "../components/BouncingBall";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@ovbabo.demo" },
  { role: "Game assigner", email: "assigner@ovbabo.demo" },
  { role: "Referee coach", email: "coach@ovbabo.demo" },
  { role: "Referee", email: "referee@ovbabo.demo" },
];

const LoginPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    api
      .get("/api/auth/config")
      .then(({ data }) => setDemo(Boolean(data.demo)))
      .catch(() => setDemo(false));
  }, []);

  if (!loading && isAuthenticated) {
    return <Navigate to="/board/members/updates" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      const from = location.state?.from || "/board/members/updates";
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || "Sign-in failed. Please try again.");
      setSubmitting(false);
    }
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword("demo1234");
    setError(null);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <BouncingBall size={32} variant="hero" />
        <h1>OVBABO Official Website</h1>
        <p className="login-sub">Sign in with your board account.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-continue" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {demo && (
          <div className="login-demo-box">
            <strong>Demo accounts</strong> (password <code>demo1234</code>):
            <ul>
              {DEMO_ACCOUNTS.map((acc) => (
                <li key={acc.email}>
                  <button type="button" onClick={() => fillDemo(acc.email)}>
                    {acc.role}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
