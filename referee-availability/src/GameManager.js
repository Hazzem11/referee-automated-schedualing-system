import React, { useState, useEffect, useRef } from "react";
import "./GameManager.css";
import api from "./api";
import PlaceAutocomplete from "./components/PlaceAutocomplete";

const EMPTY_FORM = {
  date: "",
  time: "",
  location: "",
  locationPlaceId: "",
  locationLat: null,
  locationLng: null,
  numberOfGames: "",
  level: "",
  type: "",
  requiredReferees: 3,
};

const GameManager = ({ embedded = false }) => {
  const [gameData, setGameData] = useState(EMPTY_FORM);
  const [games, setGames] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleImportFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    try {
      const text = await file.text();
      const { data } = await api.post("/api/games/import", text, {
        headers: { "Content-Type": "text/plain" },
      });
      setImportResult(data);
      fetchGames();
    } catch (error) {
      console.error("Error importing games:", error);
      setImportResult({ imported: 0, skipped: 0, errors: ["Import failed — backend unreachable."] });
    }
    setImporting(false);
    e.target.value = "";
  };

  const fetchGames = async () => {
    try {
      const { data } = await api.get("/api/games");
      setGames(data);
    } catch (error) {
      console.error("Error loading games:", error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const startEdit = (game) => {
    const start = new Date(game.startTime);
    const pad = (n) => String(n).padStart(2, "0");
    setGameData({
      date: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`,
      time: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
      location: game.location || "",
      locationPlaceId: "",
      locationLat: null,
      locationLng: null,
      numberOfGames: game.numberOfGames ?? 1,
      level: String(game.gameLevel ?? ""),
      type: game.type || "",
      requiredReferees: game.requiredReferees ?? 3,
    });
    setEditingId(game.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setGameData(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !gameData.date ||
      !gameData.time ||
      !gameData.location ||
      !gameData.numberOfGames ||
      !gameData.level ||
      !gameData.type
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const payload = {
      date: gameData.date,
      time: gameData.time,
      location: gameData.location,
      locationPlaceId: gameData.locationPlaceId,
      locationLat: gameData.locationLat,
      locationLng: gameData.locationLng,
      numberOfGames: Number(gameData.numberOfGames),
      gameLevel: Number(gameData.level),
      level: "",
      type: gameData.type,
      requiredReferees: Number(gameData.requiredReferees) || 3,
    };

    try {
      if (editingId) {
        await api.put(`/api/games/${editingId}`, payload);
        alert("Game updated — assigned referees will be notified of any venue/time change.");
      } else {
        await api.post("/api/games", payload);
        alert("Game added successfully!");
      }
      setEditingId(null);
      setGameData(EMPTY_FORM);
      fetchGames();
    } catch (error) {
      console.error("Error saving game:", error);
      alert(editingId ? "Failed to update game." : "Failed to add game.");
    }
  };

  const formatDateTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div className={`game-manager${embedded ? " embedded" : ""}`}>
      <h1>Game Manager</h1>
      <form onSubmit={handleSubmit} className="game-form">
        {editingId && <p className="editing-notice">Editing game #{editingId}</p>}
        <label>
          Date:
          <input
            type="date"
            value={gameData.date}
            onChange={(e) => setGameData({ ...gameData, date: e.target.value })}
          />
        </label>
        <label>
          Time:
          <input
            type="time"
            value={gameData.time}
            onChange={(e) => setGameData({ ...gameData, time: e.target.value })}
          />
        </label>
        <label>
          Location:
          <PlaceAutocomplete
            value={gameData.location}
            onChange={(location) =>
              setGameData({
                ...gameData,
                location,
                locationPlaceId: "",
                locationLat: null,
                locationLng: null,
              })
            }
            onPick={({ label, placeId, lat, lng }) =>
              setGameData({
                ...gameData,
                location: label,
                locationPlaceId: placeId,
                locationLat: lat ?? null,
                locationLng: lng ?? null,
              })
            }
            placeholder="Start typing an address or venue..."
          />
        </label>
        <label>
          Number of Games:
          <input
            type="number"
            value={gameData.numberOfGames}
            onChange={(e) => setGameData({ ...gameData, numberOfGames: e.target.value })}
          />
        </label>
        <label>
          Match difficulty (1–6; higher = tougher; referee experience must be ≥ this):
          <input
            type="number"
            value={gameData.level}
            onChange={(e) => setGameData({ ...gameData, level: e.target.value })}
          />
        </label>
        <label>
          Type (e.g., 4 x 8min Stopped Time):
          <input
            type="text"
            value={gameData.type}
            onChange={(e) => setGameData({ ...gameData, type: e.target.value })}
          />
        </label>
        <button type="submit">{editingId ? "Update Game" : "Add Game"}</button>
        {editingId && (
          <button type="button" className="cancel-button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <h2>Existing Games</h2>

      <div className="import-row">
        <button
          type="button"
          className="import-button"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          disabled={importing}
        >
          {importing ? "Importing..." : "Import Schedule (CSV)"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          style={{ display: "none" }}
          onChange={handleImportFile}
        />
        <span className="import-hint">
          Columns: date (YYYY-MM-DD), time (HH:MM), location, gameLevel (1–6), type, numberOfGames, requiredReferees
        </span>
      </div>

      {importResult && (
        <div className={`import-result${importResult.imported === 0 && importResult.errors.length > 0 ? " error" : ""}`}>
          <strong>{importResult.imported} imported</strong>
          {importResult.skipped > 0 && <>, {importResult.skipped} skipped</>}
          {importResult.errors.length > 0 && (
            <ul>
              {importResult.errors.slice(0, 5).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
              {importResult.errors.length > 5 && <li>…and {importResult.errors.length - 5} more</li>}
            </ul>
          )}
        </div>
      )}

      <ul className="game-list">
        {games.map((game) => (
          <li key={game.id} className="game-item">
            <p>
              <strong>{formatDateTime(game.startTime)}</strong>
            </p>
            <p>{game.location}</p>
            <p>
              Number of Games: <strong>{game.numberOfGames ?? "—"}</strong>
            </p>
            <p>
              Level: <strong>{game.gameLevel}</strong> — Type: <strong>{game.type ?? "—"}</strong>
            </p>
            <p>
              Status: <strong>{game.status}</strong>
            </p>
            <button type="button" className="edit-button" onClick={() => startEdit(game)}>
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameManager;
