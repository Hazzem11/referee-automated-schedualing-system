import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BoardIcon } from "../icons/BoardIcons";
import { updatesDocs } from "../docsConfig";

const QUICK_LINKS = [
  { to: "/board/games/my-games", label: "My Games", icon: "calendar" },
  { to: "/board/games/availability", label: "Availability", icon: "clock" },
  { to: "/board/admin/auto-assign", label: "Auto-Assign", icon: "shuffle" },
  { to: "/board/games/manage", label: "Manage Games", icon: "wrench" },
  { to: "/board/members/rules", label: "Rules", icon: "book" },
  { to: "/board/members/updates", label: "Updates", icon: "bell" },
];

const isSameLocalDay = (iso, today) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
};

const slotOverlapsToday = (slot, today) => {
  const start = new Date(slot?.startTime);
  const end = new Date(slot?.endTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
  const dayStart = new Date(today);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(today);
  dayEnd.setHours(23, 59, 59, 999);
  return start <= dayEnd && end >= dayStart;
};

const UpdatesPage = () => {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState([]);
  const [referees, setReferees] = useState([]);
  const [loading, setLoading] = useState(true);

  const docs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return updatesDocs;
    return updatesDocs.filter((d) => d.title.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const [gamesRes, refsRes] = await Promise.all([fetch("/api/games"), fetch("/api/referees")]);
        if (gamesRes.ok) setGames(await gamesRes.json());
        if (refsRes.ok) setReferees(await refsRes.json());
      } catch {
        // ignore (dashboard will show empty states)
      }
      setLoading(false);
    };
    run();
  }, []);

  const today = useMemo(() => new Date(), []);
  const todaysGames = useMemo(() => (games || []).filter((g) => isSameLocalDay(g?.startTime, today)), [games, today]);

  const availabilitySummary = useMemo(() => {
    const list = referees || [];
    let availableRefs = 0;
    let totalSlots = 0;
    for (const r of list) {
      const slots = r?.availability || [];
      const todaysSlots = slots.filter((s) => s?.isAvailable !== false && slotOverlapsToday(s, today));
      if (todaysSlots.length > 0) availableRefs += 1;
      totalSlots += todaysSlots.length;
    }
    const totalRefs = list.length;
    const pct = totalRefs === 0 ? null : Math.round((availableRefs / totalRefs) * 100);
    const band = pct == null ? "none" : pct < 40 ? "low" : pct <= 50 ? "mid" : "high";
    return { availableRefs, totalSlots, totalRefs, pct, band };
  }, [referees, today]);

  return (
    <section className="board-page">
      <div className="board-page-header">
        <div className="board-page-header-icon">
          <BoardIcon name="bell" />
        </div>
        <div>
          <h1 style={{ marginBottom: 4 }}>Updates</h1>
          <p className="subtle" style={{ marginBottom: 0 }}>
            Your dashboard: quick links, today’s games, availability, and board updates.
          </p>
        </div>
      </div>

      <div className="board-card-grid">
        <div className="board-card" style={{ gridColumn: "1 / -1" }}>
          <h3>Quick links</h3>
          <p>Jump to the most used sections.</p>
          <div className="board-quick-links">
            {QUICK_LINKS.map((item) => (
              <Link key={item.to} className="board-quick-link" to={item.to}>
                <span className="board-quick-link-icon">
                  <BoardIcon name={item.icon} />
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="board-card">
          <h3>Today</h3>
          <p>
            <strong>Games:</strong> {loading ? "…" : todaysGames.length}
            <br />
            <strong>Availability:</strong>{" "}
            {loading ? (
              "…"
            ) : availabilitySummary.pct == null ? (
              "—"
            ) : (
              <span
                className={`availability-indicator availability-${availabilitySummary.band}`}
                title={`${availabilitySummary.availableRefs} of ${availabilitySummary.totalRefs} referees available today`}
              >
                <span className="availability-dot" aria-hidden="true" />
                {availabilitySummary.pct}%
              </span>
            )}
            <br />
            <strong>Open slots:</strong> {loading ? "…" : availabilitySummary.totalSlots}
          </p>
        </div>
      </div>

      <div className="board-card-grid" style={{ marginTop: "0.75rem" }}>
        <div className="board-card">
          <h3>Today’s games</h3>
          <p className="muted" style={{ marginBottom: "0.75rem" }}>
            Shows games whose start time is today (local time).
          </p>
          <table className="board-table" aria-label="Today's games">
            <thead>
              <tr>
                <th>When</th>
                <th>Location</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {todaysGames.slice(0, 6).map((g) => (
                <tr key={g.id}>
                  <td>{g.startTime ? new Date(g.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                  <td>{g.location || "—"}</td>
                  <td>{g.gameLevel ?? "—"}</td>
                </tr>
              ))}
              {!loading && todaysGames.length === 0 && (
                <tr>
                  <td colSpan={3}>No games scheduled for today.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="board-card">
          <h3>Today’s availability</h3>
          <p className="muted" style={{ marginBottom: "0.75rem" }}>
            Counts referee availability slots overlapping today (from submitted schedules).
          </p>
          <table className="board-table" aria-label="Today's availability">
            <thead>
              <tr>
                <th>Referee</th>
                <th>Open slots today</th>
              </tr>
            </thead>
            <tbody>
              {(referees || [])
                .map((r) => {
                  const slots = (r.availability || []).filter(
                    (s) => s?.isAvailable !== false && slotOverlapsToday(s, today)
                  );
                  return { id: r.id, name: r.name, count: slots.length };
                })
                .sort((a, b) => b.count - a.count)
                .slice(0, 6)
                .map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.count}</td>
                  </tr>
                ))}
              {!loading && (referees || []).length === 0 && (
                <tr>
                  <td colSpan={2}>No referees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="board-actions-row" style={{ marginTop: "1.25rem" }}>
        <h2 style={{ margin: 0 }}>Latest documents</h2>
        <input
          className="board-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search updates…"
          aria-label="Search updates documents"
        />
      </div>
      <table className="board-table" aria-label="Updates documents">
        <thead>
          <tr>
            <th>Document</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((u) => (
            <tr key={u.title}>
              <td>
                <a href={u.href} onClick={(e) => e.preventDefault()}>
                  {u.title}
                </a>
                <div className="muted">Link placeholders for now (we’ll wire real URLs).</div>
              </td>
              <td>{u.type || "—"}</td>
            </tr>
          ))}
          {docs.length === 0 && (
            <tr>
              <td colSpan={2}>No documents match your search.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default UpdatesPage;

