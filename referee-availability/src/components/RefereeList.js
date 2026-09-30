import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './RefereeList.css';

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

const RefereeList = ({
    backHref = "/",
    secondaryHref = "/assignments",
    secondaryLabel = "View Assignments",
}) => {
    const [referees, setReferees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const fileInputRef = useRef(null);

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

    useEffect(() => {
        fetchReferees();
    }, []);

    const handleImportFile = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        setImporting(true);
        setImportResult(null);
        try {
            const text = await file.text();
            const response = await fetch('/api/referees/import', { method: 'POST', body: text });
            if (response.ok) {
                setImportResult(await response.json());
                fetchReferees();
            } else {
                setImportResult({ imported: 0, skipped: 0, errors: ['Import failed — server error.'] });
            }
        } catch (error) {
            console.error('Error importing referees:', error);
            setImportResult({ imported: 0, skipped: 0, errors: ['Import failed — backend unreachable.'] });
        }
        setImporting(false);
        e.target.value = '';
    };

    if (loading) {
        return <div className="loading">Loading referees...</div>;
    }

    return (
        <div className="referee-list-container">
            <div className="nav-bar">
                <Link to={backHref} className="back-button">Back</Link>
                <Link to={secondaryHref} className="nav-button">{secondaryLabel}</Link>
            </div>

            <h2>Referee Roster</h2>

            <div className="import-row">
                <button
                    type="button"
                    className="import-button"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    disabled={importing}
                >
                    {importing ? "Importing..." : "Import Referees (CSV)"}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    style={{ display: 'none' }}
                    onChange={handleImportFile}
                />
                <span className="import-hint">
                    Columns: name, email, experienceLevel, homeLocation, maxTravelDistance, preferredLocations, maxGamesPerWeek
                </span>
            </div>

            {importResult && (
                <div className={`import-result${importResult.imported === 0 && importResult.errors.length > 0 ? ' error' : ''}`}>
                    <strong>{importResult.imported} imported</strong>
                    {importResult.skipped > 0 && <>, {importResult.skipped} skipped</>}
                    {importResult.errors.length > 0 && (
                        <ul>
                            {importResult.errors.slice(0, 5).map((err, i) => <li key={i}>{err}</li>)}
                            {importResult.errors.length > 5 && <li>…and {importResult.errors.length - 5} more</li>}
                        </ul>
                    )}
                </div>
            )}

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