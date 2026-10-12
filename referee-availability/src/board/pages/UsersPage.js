import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../api";
import { useAuth } from "../../auth/AuthContext";
import { DEMO_ROLES, ROLE_LABELS } from "../../auth/roles";
import { BoardIcon } from "../icons/BoardIcons";

const INVITABLE_BY_ASSIGNER = [DEMO_ROLES.REFEREE, DEMO_ROLES.REFEREE_COACH];
const ALL_ROLES = Object.values(DEMO_ROLES);

const UsersPage = () => {
  const { role: myRole } = useAuth();
  const invitableRoles = useMemo(
    () => (myRole === DEMO_ROLES.ADMIN ? ALL_ROLES : INVITABLE_BY_ASSIGNER),
    [myRole]
  );

  const [users, setUsers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [referees, setReferees] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(DEMO_ROLES.REFEREE);
  const [refereeId, setRefereeId] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [usersRes, invitesRes] = await Promise.all([
        api.get("/api/users"),
        api.get("/api/users/invites"),
      ]);
      setUsers(usersRes.data);
      setInvites(invitesRes.data);
    } catch {
      setError("Could not load accounts.");
    }
  }, []);

  useEffect(() => {
    refresh();
    api.get("/api/referees").then(({ data }) => setReferees(data)).catch(() => {});
  }, [refresh]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setBusy(true);
    setNotice(null);
    setError(null);
    try {
      await api.post("/api/users/invite", {
        name,
        email,
        role,
        refereeId: refereeId ? Number(refereeId) : null,
      });
      setNotice(`Invite emailed to ${email}.`);
      setName("");
      setEmail("");
      setRole(DEMO_ROLES.REFEREE);
      setRefereeId("");
      refresh();
    } catch (err) {
      setError(err?.response?.data?.error || "Invite failed.");
    }
    setBusy(false);
  };

  const handleResend = async (id) => {
    await api.post(`/api/users/invites/${id}/resend`).catch(() => {});
    refresh();
  };

  const handleCancelInvite = async (id) => {
    await api.delete(`/api/users/invites/${id}`).catch(() => {});
    refresh();
  };

  const handleDeleteUser = async (id, userEmail) => {
    if (!window.confirm(`Delete the account for ${userEmail}?`)) return;
    try {
      await api.delete(`/api/users/${id}`);
      refresh();
    } catch (err) {
      setError(err?.response?.data?.error || "Delete failed.");
    }
  };

  return (
    <section className="board-page">
      <div className="board-page-header">
        <div className="board-page-header-icon">
          <BoardIcon name="shield" />
        </div>
        <div>
          <h1 style={{ marginBottom: 4 }}>Accounts</h1>
          <p className="subtle" style={{ marginBottom: 0 }}>
            Invite members and manage sign-in accounts.
          </p>
        </div>
      </div>

      <div className="board-card-grid">
        <div className="board-card">
          <h3>Invite a member</h3>
          <p className="muted">They'll receive an email with a link to set their password.</p>
          <form className="users-invite-form" onSubmit={handleInvite}>
            <input
              className="board-search"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="board-search"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <select className="board-search" value={role} onChange={(e) => setRole(e.target.value)}>
              {invitableRoles.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r] ?? r}
                </option>
              ))}
            </select>
            <select
              className="board-search"
              value={refereeId}
              onChange={(e) => setRefereeId(e.target.value)}
              title="Optionally link this account to a referee record"
            >
              <option value="">No referee link</option>
              {referees.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <button type="submit" className="users-button" disabled={busy}>
              {busy ? "Sending…" : "Send invite"}
            </button>
          </form>
          {notice && <p className="users-notice">{notice}</p>}
          {error && <p className="users-error">{error}</p>}
        </div>

        <div className="board-card">
          <h3>Pending invites</h3>
          <table className="board-table" aria-label="Pending invites">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invites.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.name}</td>
                  <td>{inv.email}</td>
                  <td>{ROLE_LABELS[inv.role] ?? inv.role}</td>
                  <td>
                    <button type="button" className="users-link-button" onClick={() => handleResend(inv.id)}>
                      Resend
                    </button>
                    <button type="button" className="users-link-button" onClick={() => handleCancelInvite(inv.id)}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
              {invites.length === 0 && (
                <tr>
                  <td colSpan={4}>No pending invites.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="board-card" style={{ marginTop: "0.75rem" }}>
        <h3>Active accounts</h3>
        <table className="board-table" aria-label="Accounts">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{ROLE_LABELS[u.role] ?? u.role}</td>
                <td>
                  {myRole === DEMO_ROLES.ADMIN && (
                    <button
                      type="button"
                      className="users-link-button danger"
                      onClick={() => handleDeleteUser(u.id, u.email)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UsersPage;
