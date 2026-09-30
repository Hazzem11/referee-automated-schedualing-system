import React, { useMemo, useState } from "react";
import { rulesDocs } from "../docsConfig";

const RulesPage = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set(rulesDocs.map((d) => d.category).filter(Boolean));
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, []);

  const docs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rulesDocs.filter((d) => {
      if (category !== "all" && d.category !== category) return false;
      if (!q) return true;
      return `${d.title} ${d.category || ""}`.toLowerCase().includes(q);
    });
  }, [query, category]);

  return (
    <section className="board-page">
      <h1>Rules & Mechanics</h1>
      <p className="subtle">Quick access to rules, mechanics references, and training material.</p>

      <div className="board-actions-row">
        <div className="board-pills" style={{ margin: 0 }}>
          {categories.slice(0, 6).map((c) => (
            <button
              key={c}
              type="button"
              className={`board-pill ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
        <input
          className="board-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search rules…"
          aria-label="Search rules documents"
        />
      </div>

      <table className="board-table" aria-label="Rules and mechanics documents">
        <thead>
          <tr>
            <th>Document</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((d) => (
            <tr key={d.title}>
              <td>
                <a href={d.href} onClick={(e) => e.preventDefault()}>
                  {d.title}
                </a>
                <div className="muted">Link placeholders for now (we’ll wire real URLs).</div>
              </td>
              <td>{d.category || "—"}</td>
            </tr>
          ))}
          {docs.length === 0 && (
            <tr>
              <td colSpan={2}>No documents match your filters.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default RulesPage;

