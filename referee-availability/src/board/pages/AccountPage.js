import React, { useEffect, useMemo, useState } from "react";

const DEFAULT_USER = {
  name: "John Smith",
  email: "john@example.com",
  memberId: "OVB-0001",
  level: 5,
};

const PAY_BY_LEVEL = {
  1: 25,
  2: 35,
  3: 50,
  4: 60,
  5: 70,
  6: 80,
};

const yearOf = (d) => {
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt.getFullYear();
};

const AccountPage = () => {
  const [user] = useState(DEFAULT_USER);
  const [loading, setLoading] = useState(true);
  const [solution, setSolution] = useState(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/assignments/current");
        if (res.ok) {
          setSolution(await res.json());
        } else {
          setSolution(null);
        }
      } catch {
        setSolution(null);
      }
      setLoading(false);
    };
    run();
  }, []);

  const nowYear = new Date().getFullYear();

  const rows = useMemo(() => {
    const assignments = solution?.assignments || [];
    return assignments
      .filter((a) => a?.referee?.name === user.name)
      .filter((a) => yearOf(a?.game?.startTime) === nowYear)
      .map((a) => {
        const level = Number(a?.game?.gameLevel || 0);
        const pay = PAY_BY_LEVEL[level] ?? 0;
        return {
          id: a.id,
          gameName: a?.game?.name || "—",
          when: a?.game?.startTime,
          location: a?.game?.location || "—",
          level,
          pay,
        };
      });
  }, [solution, user.name, nowYear]);

  const totals = useMemo(() => {
    const totalPay = rows.reduce((sum, r) => sum + (r.pay || 0), 0);
    return { games: rows.length, totalPay };
  }, [rows]);

  return (
    <section className="board-page">
      <h1>Account</h1>
      <p className="subtle">Your profile and yearly pay summary (demo values until auth is wired).</p>

      <div className="board-card-grid">
        <div className="board-card">
          <h3>Account details</h3>
          <p>
            <strong>Name:</strong> {user.name}
            <br />
            <strong>Email:</strong> {user.email}
            <br />
            <strong>Member ID:</strong> {user.memberId}
            <br />
            <strong>Level:</strong> {user.level}
          </p>
        </div>

        <div className="board-card">
          <h3>{nowYear} pay summary</h3>
          <p>
            <strong>Games refereed:</strong> {totals.games}
            <br />
            <strong>Total pay:</strong> ${totals.totalPay}
          </p>
          <div className="muted" style={{ marginTop: "0.5rem" }}>
            Pay is computed from the latest assignment solution: per-game rate by game level.
          </div>
        </div>
      </div>

      <div className="board-actions-row" style={{ marginTop: "1.25rem" }}>
        <h2 style={{ margin: 0 }}>Games refereed this year</h2>
      </div>

      {loading ? (
        <div className="muted">Loading…</div>
      ) : (
        <table className="board-table" aria-label="Yearly pay details">
          <thead>
            <tr>
              <th>Game</th>
              <th>When</th>
              <th>Location</th>
              <th>Level</th>
              <th>Pay</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.gameName}</td>
                <td>{r.when ? new Date(r.when).toLocaleString() : "—"}</td>
                <td>{r.location}</td>
                <td>{r.level || "—"}</td>
                <td>${r.pay}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5}>No games found for {user.name} in {nowYear} (solve assignments first).</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default AccountPage;

