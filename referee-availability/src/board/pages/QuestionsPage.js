import React from "react";
import "./QuestionsPage.css";

const QUESTIONS = [
  {
    id: 1,
    submittedDate: "2026-05-23",
    firstName: "Michael",
    lastName: "Chagnon",
    scenario:
      "On a technical foul, I understand that one player, on the court or from the bench can take the free throw. If from the bench, is this player a 'substitute' that must stay on the floor for one tick of the clock? Or can the 'designated' free throw shooter just return to the bench?",
    response:
      "The designated free throw shooter must stay in the game until the ball becomes dead again after a game clock running period. See 19.2.4 A player who has become a substitute and a substitute who has become a player cannot respectively re-enter the game or leave the game until the ball becomes dead again after a game clock running period (…)",
    responseDate: "2026-05-25",
  },
  {
    id: 2,
    submittedDate: "2026-02-05",
    firstName: "Mike",
    lastName: "Doyle",
    scenario:
      "With 1:18 remaining in the 4th quarter Team A scores. Game clock is stopped and Team B takes the ball to the endline. Team B has a substitute waiting at the table. Official stops the game to allow the substitution. While performing the substitute, Team A now requests a time out. Shall the scorer award the time out to Team A?",
    response: "No, this is not a time-out opportunity for Team A as they are the team that scored.",
    responseDate: "2026-04-01",
  },
];

const QuestionsPage = () => {
  return (
    <section className="board-page questions-page">
      <h1>Questions &amp; Interpretations</h1>
      <p className="subtle">Rules clarifications submitted by members and board responses.</p>

      <div className="questions-list">
        {QUESTIONS.map((entry) => (
          <article key={entry.id} className="question-card">
            <header className="question-card-header">
              <div className="question-meta">
                <span className="question-meta-label">Submitted</span>
                <time dateTime={entry.submittedDate}>{entry.submittedDate}</time>
              </div>
              <div className="question-meta">
                <span className="question-meta-label">Member</span>
                <span>
                  {entry.firstName} {entry.lastName}
                </span>
              </div>
            </header>

            <div className="question-block">
              <h2>Scenario</h2>
              <p>{entry.scenario}</p>
            </div>

            <div className="question-block question-response">
              <div className="question-response-header">
                <h2>Response</h2>
                <time dateTime={entry.responseDate} className="question-response-date">
                  {entry.responseDate}
                </time>
              </div>
              <p>{entry.response}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default QuestionsPage;
