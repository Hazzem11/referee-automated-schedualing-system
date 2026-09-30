import "./Scheduler.css";
import api from "./api";
import React, { useState } from "react";
import "./App.css";

const hours = Array.from({ length: 17 }, (_, i) => 7 + i);
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const getCurrentWeekSunday = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  currentDate.setDate(currentDate.getDate() - currentDay);
  return currentDate;
};

const formatWeekTabLabel = (weekStart) => {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const opts = { month: "short", day: "numeric" };
  return `${weekStart.toLocaleDateString(undefined, opts)} – ${end.toLocaleDateString(undefined, opts)}`;
};

const formatHourLabel = (hour, compact) =>
  compact ? `${hour}–${hour + 1}` : `${hour}:00 - ${hour + 1}:00`;

const Scheduler = ({ embedded = false }) => {
  const [refereeName, setRefereeName] = useState("");
  const [availability, setAvailability] = useState({});
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const startDate = getCurrentWeekSunday();

  const getNextWeeks = (start, numWeeks) => {
    const weeks = [];
    let currentStartDate = new Date(start);
    for (let i = 0; i < numWeeks; i++) {
      weeks.push(new Date(currentStartDate));
      currentStartDate.setDate(currentStartDate.getDate() + 7);
    }
    return weeks;
  };

  const weeks = getNextWeeks(startDate, 5);
  const activeWeek = weeks[activeWeekIndex];
  const activeWeekKey = activeWeek.toISOString().split("T")[0];

  const toggleAvailability = (weekStart, day, hour) => {
    const slot = `${weekStart}-${day}-${hour}`;
    setAvailability((prev) => ({
      ...prev,
      [slot]: !prev[slot],
    }));
  };

  const buildSlotsForWeek = (weekStart) => {
    const slots = [];
    const [y, mon, d] = weekStart.split("-").map(Number);
    days.forEach((day, dayIndex) => {
      hours.forEach((hour) => {
        const key = `${weekStart}-${day}-${hour}`;
        if (availability[key]) {
          const base = new Date(y, mon - 1, d + dayIndex);
          base.setHours(hour, 0, 0, 0);
          const end = new Date(base);
          end.setHours(hour + 1, 0, 0, 0);
          slots.push({
            startTime: base.toISOString(),
            endTime: end.toISOString(),
            isAvailable: true,
          });
        }
      });
    });
    return slots;
  };

  const handleSubmit = async (e, weekStart) => {
    e.preventDefault();

    if (!refereeName.trim()) {
      alert("Please enter your referee name.");
      return;
    }

    const slots = buildSlotsForWeek(weekStart);

    try {
      await api.post("/api/availability", {
        refereeName: refereeName.trim(),
        weekStart,
        slots,
      });
      alert("Availability submitted successfully!");
    } catch (error) {
      console.error("Error submitting availability:", error);
      const msg = error.response?.data?.message || error.message;
      alert(`There was an error submitting your availability: ${msg}`);
    }
  };

  return (
    <div className={`scheduler-page${embedded ? " embedded" : ""}`}>
      <h1>{embedded ? "Availability" : "Referee Availability"}</h1>
      <form>
        <div className={`form-group${embedded ? " form-group-inline" : ""}`}>
          <label htmlFor="refereeName">Referee Name:</label>
          <input
            type="text"
            id="refereeName"
            value={refereeName}
            onChange={(e) => setRefereeName(e.target.value)}
            required
          />
        </div>

        <div className="week-tabs" role="tablist" aria-label="Select week">
          {weeks.map((weekStart, index) => {
            const weekKey = weekStart.toISOString().split("T")[0];
            return (
              <button
                key={weekKey}
                type="button"
                role="tab"
                aria-selected={index === activeWeekIndex}
                className={`week-tab${index === activeWeekIndex ? " active" : ""}`}
                onClick={() => setActiveWeekIndex(index)}
              >
                {formatWeekTabLabel(weekStart)}
              </button>
            );
          })}
        </div>

        <div className="scheduler-container">
          <div className="week-container">
            <h2>Week starting {activeWeek.toDateString()}</h2>
            <div className="scheduler">
              {days.map((day, dayIndex) => {
                const currentDate = new Date(activeWeek);
                currentDate.setDate(currentDate.getDate() + dayIndex);
                const dayString = day;
                return (
                  <div key={day} className="day-column">
                    <h3>
                      {embedded ? day.slice(0, 3) : day} {currentDate.getDate()}
                    </h3>
                    <div className="hour-slots">
                      {hours.map((hour) => (
                        <div
                          key={hour}
                          className={`hour-slot ${
                            availability[`${activeWeekKey}-${dayString}-${hour}`] ? "selected" : ""
                          }`}
                          onClick={() => toggleAvailability(activeWeekKey, dayString, hour)}
                        >
                          {formatHourLabel(hour, embedded)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <button type="button" onClick={(e) => handleSubmit(e, activeWeekKey)}>
              Submit Availability
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Scheduler;
