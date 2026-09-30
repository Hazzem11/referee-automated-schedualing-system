import React from "react";
import "./DuesFeesPage.css";

const FEES = [
  { type: "INV - 4 x 8 Stopped(JUEL)", fee: 65.0 },
  { type: "INV - 4 x 8 Stopped - TILE", fee: 65.0 },
  { type: "INV - 4 x 8 Stopped", fee: 60.0 },
  { type: "INV - 4 x 10 Stopped", fee: 75.0 },
  { type: "INV - 4 x 10 Running", fee: 50.0 },
  { type: "INV - Hourly Rate - TILE", fee: 55.0 },
  { type: "INV - Hourly Rate", fee: 50.0 },
  { type: "INV - 4 x 8 Elite", fee: 80.0 },
  { type: "INV - OCAA-SS", fee: 115.0 },
  { type: "INV - 4 x 10 Elite", fee: 100.0 },
  { type: "INV - College-Univ", fee: 125.0 },
  { type: "CASH - 4 x 8 Stopped", fee: 60.0 },
  { type: "CASH - 4 x 8 Stopped - TILE", fee: 65.0 },
  { type: "CASH - 4 x 10 Stopped", fee: 75.0 },
  { type: "CASH - 4 x 10 Stopped - TILE", fee: 80.0 },
  { type: "CASH - 4 x 10 Running -TILE", fee: 55.0 },
  { type: "CASH - 4 x 10 Running", fee: 50.0 },
  { type: "CASH - Hourly Rate -TILE", fee: 55.0 },
  { type: "CASH - Hourly Rate", fee: 50.0 },
  { type: "CASH - OCAA-SS", fee: 115.0 },
  { type: "CASH - 4 x 8 Elite", fee: 80.0 },
  { type: "CASH - 4 x 10 Elite", fee: 100.0 },
  { type: "CASH - College-Univ", fee: 125.0 },
  { type: "NoFee - 4 x 8 Stopped", fee: 0.0 },
];

const formatFee = (amount) => `$ ${amount.toFixed(2)}`;

const DuesFeesPage = () => {
  return (
    <section className="board-page dues-fees-page">
      <h1>Current Game Fees</h1>
      <p className="subtle">Assignment pay rates per game (mileage not included).</p>

      <div className="dues-fees-table-wrap">
        <table className="board-table dues-fees-table" aria-label="Current game fees">
          <thead>
            <tr>
              <th>Assignment Type</th>
              <th className="dues-fees-amount-col">Fee per Game (Does not include Mileage)</th>
            </tr>
          </thead>
          <tbody>
            {FEES.map((row) => (
              <tr key={row.type}>
                <td>{row.type}</td>
                <td className="dues-fees-amount-col">{formatFee(row.fee)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DuesFeesPage;
