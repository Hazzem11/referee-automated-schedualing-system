import React, { useState, useEffect } from "react";
import "./GameManager.css";
import { db } from "./db";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";

const GameManager = () => {
  const [gameData, setGameData] = useState({
    date: "",
    time: "",
    location: "",
    numberOfGames: "",
    level: "",
    type: "",
  });
  const [games, setGames] = useState([]);
  const gamesCollectionRef = collection(db, "games");

  // Fetch games from Firestore
  useEffect(() => {
    const fetchGames = async () => {
      const querySnapshot = await getDocs(gamesCollectionRef);
      const gamesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGames(gamesList);
    };

    fetchGames();
  }, []);

  // Handle form submission
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

    try {
      await addDoc(gamesCollectionRef, {
        ...gameData,
        assigned: false,
        crewChief: "",
        umpire1: "",
        umpire2: "",
        confirmed: {
          crewChief: false,
          umpire1: false,
          umpire2: false,
        },
      });
      alert("Game added successfully!");
      setGameData({ date: "", time: "", location: "", numberOfGames: "", type: "", level: "" });
      // Refresh games list
      const querySnapshot = await getDocs(gamesCollectionRef);
      const gamesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGames(gamesList);
    } catch (error) {
      console.error("Error adding game:", error);
      alert("Failed to add game.");
    }
  };

  // Toggle assigned flag
  const toggleAssigned = async (id, currentStatus) => {
    try {
      const gameDoc = doc(db, "games", id);
      await updateDoc(gameDoc, { assigned: !currentStatus });
      setGames((prev) =>
        prev.map((game) => (game.id === id ? { ...game, assigned: !currentStatus } : game))
      );
    } catch (error) {
      console.error("Error updating game:", error);
      alert("Failed to update game.");
    }
  };

  return (
    <div className="game-manager">
      <h1>Game Manager</h1>
      <form onSubmit={handleSubmit} className="game-form">
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
          <input
            type="text"
            value={gameData.location}
            onChange={(e) => setGameData({ ...gameData, location: e.target.value })}
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
          Game Level (Levels 1-6 with 1 being highest):
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
        <button type="submit">Add Game</button>
      </form>

      <h2>Existing Games</h2>
      <ul className="game-list">
        {games.map((game) => (
          <li key={game.id} className="game-item">
            <p>
              <strong>{game.date}</strong> at <strong>{game.time}</strong>
            </p>
            <p>{game.location}</p>
            <p>Number of Games: <strong>{game.numberOfGames}</strong></p>
            <p>Type: <strong>{game.type}</strong></p>
            <p>Assigned: <strong>{game.assigned ? "Yes" : "No"}</strong></p>
            <p>
              Crew Chief: <strong>{game.crewChief || "Unassigned"}</strong>{" "}
              ({game.confirmed.crewChief ? "Confirmed" : "Not Confirmed"})
            </p>
            <p>
              Umpire 1: <strong>{game.umpire1 || "Unassigned"}</strong>{" "}
              ({game.confirmed.umpire1 ? "Confirmed" : "Not Confirmed"})
            </p>
            
            <button onClick={() => toggleAssigned(game.id, game.assigned)}>
              {game.assigned ? "Unassign" : "Assign"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameManager;
