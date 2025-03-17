import "./Scheduler.css";
import { addOrUpdateAvailability } from "./db";
import React, { useState } from "react";
import "./App.css";

const hours = Array.from({ length: 17 }, (_, i) => 7 + i);
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Function to get the Sunday of the current week
const getCurrentWeekSunday = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const difference = currentDay; // Sunday is 0, so we subtract currentDay to get to Sunday
  currentDate.setDate(currentDate.getDate() - difference);
  return currentDate;
};

const Scheduler = () => {
  const [refereeName, setRefereeName] = useState("");
  const [availability, setAvailability] = useState({});
  const startDate = getCurrentWeekSunday(); // Start date is the Sunday of the current week

  const getNextWeeks = (startDate, numWeeks) => {
    const weeks = [];
    let currentStartDate = new Date(startDate);
    for (let i = 0; i < numWeeks; i++) {
      weeks.push(new Date(currentStartDate));
      currentStartDate.setDate(currentStartDate.getDate() + 7); // Move to the next week
    }
    return weeks;
  };

  const weeks = getNextWeeks(startDate, 5);

  const toggleAvailability = (weekStart, day, hour) => {
    const slot = `${weekStart}-${day}-${hour}`; // Correct slot format
    setAvailability((prev) => ({
      ...prev,
      [slot]: !prev[slot], // Toggle the slot's availability
    }));
  };
  
  const handleSubmit = async (e, weekStart) => {
    e.preventDefault();
  
    if (!refereeName) {
      alert("Please enter your referee name.");
      return;
    }
  
    const weekAvailability = Object.keys(availability)
      .filter((slot) => slot.startsWith(weekStart) && availability[slot]); // Include only highlighted slots
  
    const availabilitySlots = weekAvailability.map((slot) => {
      const day = slot.split("-")[3]; // Extract the day
      const hour = parseInt(slot.split("-")[4], 10); // Extract and parse the hour as an integer
      return `${day} ${hour}:00-${hour + 1}:00`; // Format as "Day Start-End"
    });
  
    console.log("Filtered Week Availability:", weekAvailability);
    console.log("Formatted Availability Slots:", availabilitySlots);
  
    try {
      await addOrUpdateAvailability(refereeName, weekStart, availabilitySlots);
      alert("Availability submitted successfully!");
    } catch (error) {
      console.error("Error submitting availability:", error);
      alert(`There was an error submitting your availability: ${error.message}`);
    }
  };
  
  
  return (
    <div className="scheduler-page">
      <h1>Referee Availability</h1>
      <form>
        <div className="form-group">
          <label htmlFor="refereeName">Referee Name:</label>
          <input
            type="text"
            id="refereeName"
            value={refereeName}
            onChange={(e) => setRefereeName(e.target.value)}
            required
          />
        </div>
        <div className="scheduler-container">
          {weeks.map((weekStart) => (
            <div key={weekStart.toISOString()} className="week-container">
              <h2>Weekly Availability Sheet for the Week starting {weekStart.toDateString()}:</h2>
              <div className="scheduler">
                {days.map((day, dayIndex) => {
                  const currentDate = new Date(weekStart);
                  currentDate.setDate(currentDate.getDate() + dayIndex); // Calculate the correct date for each day
                  const dayString = day; // Use the day name (e.g., "Monday")
                  return (
                    <div key={day} className="day-column">
                      <h3>{day} {currentDate.getDate()}</h3>
                      {hours.map((hour) => (
                        <div
                          key={hour}
                          className={`hour-slot ${availability[`${weekStart.toISOString().split('T')[0]}-${dayString}-${hour}`] ? "selected" : ""}`}
                          onClick={() => toggleAvailability(weekStart.toISOString().split('T')[0], dayString, hour)}
                        >
                          {hour}:00 - {hour + 1}:00
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
              <button onClick={(e) => handleSubmit(e, weekStart.toISOString().split('T')[0])}>Submit Availability</button>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default Scheduler;
