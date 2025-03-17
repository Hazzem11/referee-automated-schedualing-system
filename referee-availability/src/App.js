import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Scheduler from "./Scheduler";
import GameManager from "./GameManager";

const Home = () => (
  <div className="home-page">
    <h1>Welcome to the Referee Availability Manager</h1>
    <p>Assign Games with ease!</p>
    <div className="home-links">
      <Link to="/scheduler" className="home-link">
        Submit Availability
      </Link>
      <Link to="/games" className="home-link">
        Manage Games
      </Link>
      <Link to="/scheduler" className="home-link">
        Manage Referee
      </Link>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scheduler" element={<Scheduler />} />
        <Route path="/games" element={<GameManager />} />
      </Routes>
    </Router>
  );
};

export default App;
