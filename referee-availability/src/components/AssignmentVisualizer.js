import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AssignmentVisualizer.css';

// Define helper functions for date operations without modifying native prototypes
// Helper function to get week number
const getWeekNumber = (date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};

// Helper function to add weeks
const addWeeks = (date, weeks) => {
    const newDate = new Date(date.valueOf());
    newDate.setDate(newDate.getDate() + weeks * 7);
    return newDate;
};

const AssignmentVisualizer = () => {
    const [solution, setSolution] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(0); // 0 = current week, 1 = next week, etc.
    
    // Mock data for testing until backend is fully connected
    const mockSolution = {
        score: { hardScore: -3, softScore: 8 },
        assignments: [
            {
                id: 1,
                game: {
                    id: 1,
                    name: "Senior League Final",
                    startTime: new Date().setHours(new Date().getHours() + 1),
                    endTime: new Date().setHours(new Date().getHours() + 3),
                    location: "Downtown",
                    gameLevel: 3,
                    weekNumber: 0
                },
                referee: {
                    id: 1,
                    name: "John Smith",
                    experienceLevel: 3,
                    homeLocation: "Downtown",
                    maxTravelDistance: 50
                }
            },
            {
                id: 2,
                game: {
                    id: 2,
                    name: "Youth League Semi-Final",
                    startTime: new Date().setHours(new Date().getHours() + 4),
                    endTime: new Date().setHours(new Date().getHours() + 6),
                    location: "North Side",
                    gameLevel: 2,
                    weekNumber: 0
                },
                referee: {
                    id: 1,
                    name: "John Smith",
                    experienceLevel: 3,
                    homeLocation: "Downtown",
                    maxTravelDistance: 50
                }
            },
            {
                id: 3,
                game: {
                    id: 3,
                    name: "Junior League Quarter-Final",
                    startTime: new Date().setHours(new Date().getHours() + 2),
                    endTime: new Date().setHours(new Date().getHours() + 4),
                    location: "East Side",
                    gameLevel: 1,
                    weekNumber: 0
                },
                referee: {
                    id: 2,
                    name: "Jane Doe",
                    experienceLevel: 2,
                    homeLocation: "North Side",
                    maxTravelDistance: 30
                }
            },
            {
                id: 4,
                game: {
                    id: 4,
                    name: "Women's League Final",
                    startTime: new Date(new Date().setDate(new Date().getDate() + 7)).setHours(13),
                    endTime: new Date(new Date().setDate(new Date().getDate() + 7)).setHours(15),
                    location: "Downtown",
                    gameLevel: 3,
                    weekNumber: 1
                },
                referee: null // Unassigned game example
            }
        ]
    };

    const fetchSolution = async () => {
        setLoading(true);
        try {
            // Try to fetch from the API
            const response = await fetch('/api/assignments/current');
            if (response.ok) {
                const data = await response.json();
                setSolution(data);
            } else {
                // If API fails, use mock data for testing
                console.log("Using mock data as API is not available");
                setSolution(mockSolution);
            }
        } catch (error) {
            console.error('Error fetching solution:', error);
            // Use mock data if API fails
            setSolution(mockSolution);
        }
        setLoading(false);
    };

    const solve = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/assignments/solve', { method: 'POST' });
            if (response.ok) {
                const data = await response.json();
                setSolution(data);
            } else {
                // If API fails, use mock data for testing
                console.log("Using mock data as API is not available");
                setSolution(mockSolution);
            }
        } catch (error) {
            console.error('Error solving:', error);
            // Use mock data if API fails
            setSolution(mockSolution);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSolution();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // We intentionally want this to run only once on mount

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!solution) {
        return <div className="no-solution">No solution available</div>;
    }

    // Get the current week and week + n for comparison
    const currentDate = new Date();
    const targetDate = addWeeks(currentDate, currentWeek);
    
    // Filter assignments for the current view
    const filteredAssignments = solution.assignments.filter(assignment => {
        // Convert timestamp to Date if it's not already
        const gameDate = new Date(assignment.game.startTime);
        const gameWeek = Math.floor((gameDate - currentDate) / (7 * 24 * 60 * 60 * 1000));
        return gameWeek === currentWeek;
    });

    return (
        <div className="assignment-visualizer">
            <div className="nav-bar">
                <Link to="/" className="back-button">Back to Home</Link>
                <Link to="/referees" className="nav-button">View Referees</Link>
            </div>

            <div className="header">
                <h2>Game Assignments</h2>
                <div className="controls">
                    <div className="week-selector">
                        <button 
                            className="week-button" 
                            onClick={() => setCurrentWeek(currentWeek - 1)} 
                            disabled={currentWeek === 0}
                        >
                            &lt; Previous Week
                        </button>
                        <span className="current-week">
                            Week of {addWeeks(new Date(), currentWeek).toLocaleDateString()}
                        </span>
                        <button 
                            className="week-button" 
                            onClick={() => setCurrentWeek(currentWeek + 1)}
                        >
                            Next Week &gt;
                        </button>
                    </div>
                    <button onClick={solve} className="solve-button">
                        Re-optimize Assignments
                    </button>
                </div>
            </div>

            <div className="score-summary">
                <h3>Solution Score</h3>
                <div className="score">
                    <div className="hard-score">
                        Hard Constraints: {solution.score.hardScore}
                    </div>
                    <div className="soft-score">
                        Soft Constraints: {solution.score.softScore}
                    </div>
                </div>
            </div>

            <div className="games-table-container">
                <table className="games-table">
                    <thead>
                        <tr>
                            <th>Game</th>
                            <th>Level</th>
                            <th>Date & Time</th>
                            <th>Location</th>
                            <th>Main Referee</th>
                            <th>Assistant Referee</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssignments.length > 0 ? (
                            filteredAssignments.map((assignment, index) => {
                                const gameStartDate = new Date(assignment.game.startTime);
                                const gameEndDate = new Date(assignment.game.endTime);
                                const isAssigned = assignment.referee !== null;
                                
                                return (
                                    <tr key={index} className={isAssigned ? "assigned" : "unassigned"}>
                                        <td>{assignment.game.name}</td>
                                        <td>{assignment.game.gameLevel}</td>
                                        <td>
                                            {gameStartDate.toLocaleDateString()} <br />
                                            {gameStartDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                            {gameEndDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </td>
                                        <td>{assignment.game.location}</td>
                                        <td>
                                            {isAssigned ? (
                                                <div className="referee-info">
                                                    <div>{assignment.referee.name}</div>
                                                    <div className="referee-details">
                                                        Exp: {assignment.referee.experienceLevel}
                                                    </div>
                                                </div>
                                            ) : "Unassigned"}
                                        </td>
                                        <td>
                                            {/* This would be filled with assistant referee info in a full implementation */}
                                            Unassigned
                                        </td>
                                        <td>
                                            <span className={`status-badge ${isAssigned ? "status-assigned" : "status-unassigned"}`}>
                                                {isAssigned ? "Assigned" : "Needs Referee"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-games">
                                    No games scheduled for this week
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignmentVisualizer; 