import React, { useMemo, useState } from "react";
import "./App.css";

/**
 * Tic Tac Toe UI scaffold.
 * This file intentionally keeps all UI in App.js for now; game logic will be added in later steps.
 */

// PUBLIC_INTERFACE
function App() {
  /** Placeholder board state (no gameplay logic yet). */
  const [squares, setSquares] = useState(() => Array(9).fill(null));

  /** Placeholder status (later: Next/Winner/Draw). */
  const statusText = useMemo(() => {
    const anyMarked = squares.some((v) => v !== null);
    return anyMarked ? "Next: X" : "Next: X";
  }, [squares]);

  const handleSquareClick = (index) => {
    // Placeholder interaction so buttons feel interactive.
    // Next step will implement turn-taking, win/draw detection, and preventing overwrites.
    setSquares((prev) => {
      const next = [...prev];
      next[index] = next[index] === "X" ? null : "X";
      return next;
    });
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    /** Reset to empty board. */
    setSquares(Array(9).fill(null));
  };

  return (
    <div className="App">
      <main className="App-header">
        <section aria-label="Game status">
          <h1 className="title">Tic Tac Toe</h1>
          <p className="subtitle" role="status" aria-live="polite">
            {statusText}
          </p>
        </section>

        <section
          className="ttt-board"
          aria-label="Tic Tac Toe board"
          role="grid"
        >
          {squares.map((value, index) => {
            const row = Math.floor(index / 3) + 1;
            const col = (index % 3) + 1;

            return (
              <button
                key={index}
                type="button"
                className="ttt-square"
                onClick={() => handleSquareClick(index)}
                aria-label={`Square row ${row} column ${col}${
                  value ? `, ${value}` : ", empty"
                }`}
              >
                {value ?? ""}
              </button>
            );
          })}
        </section>

        <div className="ttt-actions">
          <button type="button" className="btn btn-large" onClick={handleRestart}>
            Restart
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
