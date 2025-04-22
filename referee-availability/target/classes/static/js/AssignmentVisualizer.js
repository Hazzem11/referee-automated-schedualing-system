import React, { useState, useEffect } from 'react';
import './AssignmentVisualizer.css';

const AssignmentVisualizer = () => {
    const [solution, setSolution] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchSolution = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/assignments/current');
            const data = await response.json();
            setSolution(data);
        } catch (error) {
            console.error('Error fetching solution:', error);
        }
        setLoading(false);
    };

    const solve = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/assignments/solve', { method: 'POST' });
            const data = await response.json();
            setSolution(data);
        } catch (error) {
            console.error('Error solving:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSolution();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!solution) {
        return <div className="no-solution">No solution available</div>;
    }

    return (
        <div className="assignment-visualizer">
            <div className="header">
                <h2>Referee Assignments</h2>
                <button onClick={solve} className="solve-button">
                    Solve
                </button>
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

            <div className="assignments">
                {solution.assignments.map((assignment, index) => (
                    <div key={index} className="assignment-card">
                        <h3>{assignment.game.name}</h3>
                        <div className="game-details">
                            <p>Level: {assignment.game.gameLevel}</p>
                            <p>Location: {assignment.game.location}</p>
                            <p>Time: {new Date(assignment.game.startTime).toLocaleString()} - 
                                {new Date(assignment.game.endTime).toLocaleString()}</p>
                        </div>
                        <div className="referee-details">
                            <h4>Assigned Referee</h4>
                            {assignment.referee ? (
                                <>
                                    <p>Name: {assignment.referee.name}</p>
                                    <p>Experience: {assignment.referee.experienceLevel}</p>
                                    <p>Home Location: {assignment.referee.homeLocation}</p>
                                    <p>Max Travel: {assignment.referee.maxTravelDistance} km</p>
                                </>
                            ) : (
                                <p>No referee assigned</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssignmentVisualizer; 