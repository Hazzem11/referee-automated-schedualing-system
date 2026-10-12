import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
import "./LoginPage.css";
import BouncingBall from "../components/BouncingBall";
import { ROLE_LABELS } from "../auth/roles";

const AcceptInvitePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setInvalid(true);
      setLoading(false);
      return;
    }
    api
      .get("/api/auth/invite-info", { params: { token } })
      .then(({ data }) => setInvite(data))
      .catch(() => setInvalid(true))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/api/auth/accept-invite", { token, password });
      setDone(true);
    } catch (err) {
      setError(err?.response?.data?.error || "Could not activate your account. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <BouncingBall size={32} variant="hero" />
        <h1>OVBABO Official Website</h1>

        {loading && <p className="login-sub">Checking your invite…</p>}

        {!loading && invalid && (
          <>
            <p className="login-sub">This invite link is invalid or has expired.</p>
            <p className="login-sub">Ask your assigner to resend the invite.</p>
          </>
        )}

        {!loading && done && (
          <>
            <p className="login-sub">Your password is set — your account is active.</p>
            <Link className="login-continue login-continue-link" to="/login">
              Continue to sign in
            </Link>
          </>
        )}

        {!loading && invite && !done && (
          <>
            <p className="login-sub">
              Welcome, <strong>{invite.name}</strong> — set a password for your{" "}
              {ROLE_LABELS[invite.role] ?? invite.role} account ({invite.email}).
            </p>
            <form className="login-form" onSubmit={handleSubmit}>
              <label className="login-field">
                <span>Password (min 8 characters)</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>
              <label className="login-field">
                <span>Confirm password</span>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>

              {error && <p className="login-error">{error}</p>}

              <button type="submit" className="login-continue" disabled={submitting}>
                {submitting ? "Activating…" : "Set password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitePage;
