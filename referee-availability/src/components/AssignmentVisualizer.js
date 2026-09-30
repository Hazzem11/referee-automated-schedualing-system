import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AssignmentVisualizer.css';

// Helper function to add weeks
const addWeeks = (date, weeks) => {
    const newDate = new Date(date.valueOf());
    newDate.setDate(newDate.getDate() + weeks * 7);
    return newDate;
};

const AssignmentVisualizer = ({
    backHref = "/",
    secondaryHref = "/referees",
    secondaryLabel = "View Referees",
}) => {
    const [solution, setSolution] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(0); // 0 = current week, 1 = next week, etc.
    const [publishing, setPublishing] = useState(false);
    const [publishResult, setPublishResult] = useState(null);
    
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

    const publish = async () => {
        setPublishing(true);
        setPublishResult(null);
        try {
            const response = await fetch('/api/assignments/publish', { method: 'POST' });
            if (response.ok) {
                setPublishResult(await response.json());
            } else {
                const text = await response.text();
                setPublishResult({ error: text || 'Publish failed.' });
            }
        } catch (error) {
            console.error('Error publishing:', error);
            setPublishResult({ error: 'Publish failed — backend unreachable.' });
        }
        setPublishing(false);
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

    const currentDate = new Date();

    // Filter assignments for the current view
    const filteredAssignments = solution.assignments.filter(assignment => {
        // Convert timestamp to Date if it's not already
        const gameDate = new Date(assignment.game.startTime);
        const gameWeek = Math.floor((gameDate - currentDate) / (7 * 24 * 60 * 60 * 1000));
        return gameWeek === currentWeek;
    });

    // One row per game: slot 0 is the main referee, slot 1 the assistant
    const groupedGames = Object.values(
        filteredAssignments.reduce((acc, assignment) => {
            const key = assignment.game.id;
            if (!acc[key]) {
                acc[key] = { game: assignment.game, referees: [] };
            }
            acc[key].referees.push(assignment.referee);
            return acc;
        }, {})
    );

    return (
        <div className="assignment-visualizer">
            <div className="nav-bar">
                <Link to={backHref} className="back-button">Back</Link>
                <Link to={secondaryHref} className="nav-button">{secondaryLabel}</Link>
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
                    <button onClick={publish} className="publish-button" disabled={publishing}>
                        {publishing ? "Publishing..." : "Publish Assignments"}
                    </button>
                </div>
            </div>

            {publishResult && (
                <div className={`publish-banner${publishResult.error ? " error" : ""}`}>
                    {publishResult.error ? (
                        publishResult.error
                    ) : (
                        <>
                            <strong>Published.</strong>{" "}
                            {publishResult.gamesFullyStaffed}/{publishResult.totalGames} games fully staffed ·{" "}
                            {publishResult.newAssignments} new assignment{publishResult.newAssignments === 1 ? "" : "s"} ·{" "}
                            {publishResult.refereesNotified} referee{publishResult.refereesNotified === 1 ? "" : "s"}{" "}
                            {publishResult.live ? "emailed" : "notified (log-only mode — see backend console)"}
                        </>
                    )}
                </div>
            )}

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
                        {groupedGames.length > 0 ? (
                            groupedGames.map(({ game, referees }) => {
                                const gameStartDate = new Date(game.startTime);
                                const gameEndDate = new Date(game.endTime);
                                const main = referees[0] || null;
                                const assistant = referees[1] || null;
                                const openSlots = referees.filter(r => r === null).length;
                                const isAssigned = openSlots === 0 && referees.length > 0;

                                const refereeCell = (referee) => referee ? (
                                    <div className="referee-info">
                                        <div>{referee.name}</div>
                                        <div className="referee-details">
                                            Exp: {referee.experienceLevel}
                                        </div>
                                    </div>
                                ) : "Unassigned";

                                return (
                                    <tr key={game.id} className={isAssigned ? "assigned" : "unassigned"}>
                                        <td>{game.name}</td>
                                        <td>{game.gameLevel}</td>
                                        <td>
                                            {gameStartDate.toLocaleDateString()} <br />
                                            {gameStartDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} -
                                            {gameEndDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </td>
                                        <td>{game.location}</td>
                                        <td>{refereeCell(main)}</td>
                                        <td>{refereeCell(assistant)}</td>
                                        <td>
                                            <span className={`status-badge ${isAssigned ? "status-assigned" : "status-unassigned"}`}>
                                                {isAssigned ? "Assigned" : `Needs ${openSlots} Referee${openSlots === 1 ? "" : "s"}`}
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