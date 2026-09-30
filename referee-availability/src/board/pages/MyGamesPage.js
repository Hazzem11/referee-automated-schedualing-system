import React, { useEffect, useMemo, useState } from "react";
import api from "../../api";

const toDate = (iso) => {
  try {
    return iso ? new Date(iso) : null;
  } catch {
    return null;
  }
};

const formatDateTime = (iso) => {
  const d = toDate(iso);
  if (!d) return "—";
  return d.toLocaleString();
};

const MyGamesPage = () => {
  const [filter, setFilter] = useState("future");
  const [query, setQuery] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmations, setConfirmations] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/api/games");
        setGames(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load games:", e);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const rows = useMemo(() => {
    const now = new Date();
    return games
      .slice()
      .sort((a, b) => (toDate(a.startTime)?.getTime() || 0) - (toDate(b.startTime)?.getTime() || 0))
      .filter((g) => {
        if (filter === "all") return true;
        const start = toDate(g.startTime);
        return start ? start >= now : true;
      })
      .filter((g) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        const haystack = `${g.location || ""} ${g.type || ""} ${g.gameLevel ?? ""}`.toLowerCase();
        return haystack.includes(q);
      });
  }, [games, filter, query]);

  const toggleConfirm = (id) => {
    setConfirmations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const confirmAllVisible = () => {
    const next = { ...confirmations };
    rows.forEach((g) => {
      next[g.id] = true;
    });
    setConfirmations(next);
  };

  return (
    <section className="board-page">
      <h1>My Games</h1>
      <p className="subtle">
        A modernized view of your assigned games. For the demo, this is powered by the existing{" "}
        <code>/api/games</code> feed; confirmation is local UI state until we add a backend endpoint.
      </p>

      <div className="board-actions-row">
        <div className="board-pills" role="tablist" aria-label="Game filter" style={{ margin: 0 }}>
          <button
            type="button"
            className={`board-pill ${filter === "future" ? "active" : ""}`}
            onClick={() => setFilter("future")}
          >
            Future games
          </button>
          <button
            type="button"
            className={`board-pill ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All games
          </button>
        </div>

        <input
          className="board-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by location, type, or level…"
          aria-label="Search games"
        />

        <button type="button" className="board-button-primary" onClick={confirmAllVisible}>
          Confirm all visible
        </button>
      </div>

      {loading ? (
        <div>Loading games…</div>
      ) : (
        <table className="board-table" aria-label="My games table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Date</th>
              <th>Assignment</th>
              <th># Games</th>
              <th>Member</th>
              <th>Confirmation</th>
              <th>Potential partners</th>
              <th>Potential evaluator</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8}>No games to show.</td>
              </tr>
            ) : (
              rows.map((g) => (
                <tr key={g.id}>
                  <td>{g.location || "—"}</td>
                  <td>{formatDateTime(g.startTime)}</td>
                  <td>
                    {g.type || "—"}
                    <div className="muted">Level {g.gameLevel ?? "—"}</div>
                  </td>
                  <td>{g.numberOfGames ?? "—"}</td>
                  <td className="muted">Signed-in user (demo)</td>
                  <td>
                    {confirmations[g.id] ? (
                      <span className="board-badge good">Confirmed</span>
                    ) : (
                      <button type="button" className="board-pill" onClick={() => toggleConfirm(g.id)}>
                        Confirm
                      </button>
                    )}
                  </td>
                  <td className="muted">—</td>
                  <td className="muted">—</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default MyGamesPage;

