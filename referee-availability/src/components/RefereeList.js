import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RefereeList.css';

const RefereeList = () => {
    const [referees, setReferees] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock referee data for testing
    const mockReferees = [
        {
            id: 1,
            name: "John Smith",
            experienceLevel: 3,
            homeLocation: "Downtown",
            maxTravelDistance: 50,
            preferredLocations: ["Downtown", "North Side"],
            maxGamesPerWeek: 3,
            currentAssignments: 2
        },
        {
            id: 2,
            name: "Jane Doe",
            experienceLevel: 2,
            homeLocation: "North Side",
            maxTravelDistance: 30,
            preferredLocations: ["North Side", "East Side"],
            maxGamesPerWeek: 2,
            currentAssignments: 1
        },
        {
            id: 3,
            name: "Mike Johnson",
            experienceLevel: 1,
            homeLocation: "East Side",
            maxTravelDistance: 20,
            preferredLocations: ["East Side", "Downtown"],
            maxGamesPerWeek: 2,
            currentAssignments: 0
        },
        {
            id: 4,
            name: "Sarah Williams",
            experienceLevel: 3,
            homeLocation: "West Side",
            maxTravelDistance: 40,
            preferredLocations: ["West Side", "Downtown"],
            maxGamesPerWeek: 3,
            currentAssignments: 3
        },
        {
            id: 5,
            name: "David Brown",
            experienceLevel: 2,
            homeLocation: "South Side",
            maxTravelDistance: 35,
            preferredLocations: ["South Side", "East Side"],
            maxGamesPerWeek: 2,
            currentAssignments: 1
        }
    ];

    useEffect(() => {
        // Attempt to fetch referees from the API
        const fetchReferees = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/referees');
                if (response.ok) {
                    const data = await response.json();
                    setReferees(data);
                } else {
                    // Use mock data if API fails
                    console.log("Using mock referee data");
                    setReferees(mockReferees);
                }
            } catch (error) {
                console.error('Error fetching referees:', error);
                // Use mock data if API fails
                setReferees(mockReferees);
            }
            setLoading(false);
        };

        fetchReferees();
    }, [mockReferees]);

    if (loading) {
        return <div className="loading">Loading referees...</div>;
    }

    return (
        <div className="referee-list-container">
            <div className="nav-bar">
                <Link to="/" className="back-button">Back to Home</Link>
                <Link to="/assignments" className="nav-button">View Assignments</Link>
            </div>

            <h2>Referee Roster</h2>
            
            <div className="stats-summary">
                <div className="stat-card">
                    <span className="stat-number">{referees.length}</span>
                    <span className="stat-label">Total Referees</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">
                        {referees.filter(ref => ref.experienceLevel === 3).length}
                    </span>
                    <span className="stat-label">Senior Referees</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">
                        {referees.reduce((sum, ref) => sum + ref.currentAssignments, 0)}
                    </span>
                    <span className="stat-label">Total Assignments</span>
                </div>
            </div>

            <div className="table-container">
                <table className="referee-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Experience Level</th>
                            <th>Home Location</th>
                            <th>Max Travel</th>
                            <th>Preferred Locations</th>
                            <th>Max Games / Week</th>
                            <th>Current Assignments</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {referees.map(referee => (
                            <tr key={referee.id} className={referee.currentAssignments >= referee.maxGamesPerWeek ? 'fully-booked' : ''}>
                                <td>{referee.name}</td>
                                <td>
                                    <div className="experience-level">
                                        <div className={`level-indicator level-${referee.experienceLevel}`}></div>
                                        {referee.experienceLevel === 3 ? 'Senior' : 
                                        referee.experienceLevel === 2 ? 'Intermediate' : 'Junior'}
                                    </div>
                                </td>
                                <td>{referee.homeLocation}</td>
                                <td>{referee.maxTravelDistance} km</td>
                                <td>{referee.preferredLocations.join(', ')}</td>
                                <td>{referee.maxGamesPerWeek}</td>
                                <td>{referee.currentAssignments}</td>
                                <td>
                                    <span className={`status-badge ${referee.currentAssignments >= referee.maxGamesPerWeek ? 'status-full' : 'status-available'}`}>
                                        {referee.currentAssignments >= referee.maxGamesPerWeek ? 'Fully Booked' : 'Available'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RefereeList; 