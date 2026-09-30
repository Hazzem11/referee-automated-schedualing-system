import React, { useState } from "react";
import { REPORT_CONFIGS, REPORT_FORM_OPTIONS } from "../data/reportFormConfig";
import "./ReportFormPage.css";

const SelectField = ({ id, label, value, onChange, options, placeholder = "Select…" }) => (
  <div className="report-form-row">
    <label htmlFor={id}>{label}</label>
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt || "empty"} value={opt}>
          {opt || placeholder}
        </option>
      ))}
    </select>
  </div>
);

const TextField = ({ id, label, value, onChange }) => (
  <div className="report-form-row">
    <label htmlFor={id}>{label}</label>
    <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const ReportFormPage = ({ reportType = "lateness" }) => {
  const config = REPORT_CONFIGS[reportType] || REPORT_CONFIGS.lateness;
  const opts = REPORT_FORM_OPTIONS;

  const [location, setLocation] = useState(opts.locations[0]);
  const [gameDate, setGameDate] = useState(opts.dates[0]);
  const [startTime, setStartTime] = useState(opts.times[0]);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [assignment, setAssignment] = useState(opts.assignments[0]);
  const [level, setLevel] = useState(opts.levels[0]);
  const [official1, setOfficial1] = useState("Hazzem Sukar");
  const [official2, setOfficial2] = useState("");
  const [official3, setOfficial3] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="board-page report-form-page">
      <h1>{config.title}</h1>
      <p className="report-form-intro">{config.intro}</p>

      {config.policySections.map((section) => (
        <div key={section.heading} className="report-form-policy">
          <h2>{section.heading}</h2>
          <p>{section.text}</p>
        </div>
      ))}

      <form className="report-form" onSubmit={handleSubmit}>
        <SelectField
          id="location"
          label="Location"
          value={location}
          onChange={setLocation}
          options={opts.locations}
        />
        <SelectField
          id="gameDate"
          label="Date of Game"
          value={gameDate}
          onChange={setGameDate}
          options={opts.dates}
        />
        <SelectField
          id="startTime"
          label="Start Time (of the game)"
          value={startTime}
          onChange={setStartTime}
          options={opts.times}
        />

        <fieldset className="report-form-fieldset">
          <legend>Teams Involved</legend>
          <TextField id="homeTeam" label="Home Team" value={homeTeam} onChange={setHomeTeam} />
          <TextField id="awayTeam" label="Away Team" value={awayTeam} onChange={setAwayTeam} />
        </fieldset>

        <SelectField
          id="assignment"
          label="Assignment"
          value={assignment}
          onChange={setAssignment}
          options={opts.assignments}
        />
        <SelectField id="level" label="Level of Play" value={level} onChange={setLevel} options={opts.levels} />

        <fieldset className="report-form-fieldset">
          <legend>Officials Involved</legend>
          <SelectField
            id="official1"
            label="Official #1"
            value={official1}
            onChange={setOfficial1}
            options={opts.officials.filter(Boolean)}
            placeholder="Select official…"
          />
          <SelectField
            id="official2"
            label="Official #2"
            value={official2}
            onChange={setOfficial2}
            options={opts.officials}
            placeholder="Select official…"
          />
          <SelectField
            id="official3"
            label="Official #3"
            value={official3}
            onChange={setOfficial3}
            options={opts.officials}
            placeholder="Select official…"
          />
        </fieldset>

        <div className="report-form-row report-form-row-full">
          <label htmlFor="details">DETAILS: Please add any details that might be pertinent.</label>
          <textarea
            id="details"
            rows={6}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        <div className="report-form-actions">
          <button type="submit" className="board-button-primary">
            Submit
          </button>
        </div>
      </form>
    </section>
  );
};

export default ReportFormPage;
