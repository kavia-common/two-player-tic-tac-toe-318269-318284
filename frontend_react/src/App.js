import React, { useMemo, useState } from "react";
import "./App.css";

/**
 * Tic Tac Toe UI scaffold + basic game state.
 * This file intentionally keeps all logic in App.js for now; win/draw detection is wired as placeholders.
 */

// PUBLIC_INTERFACE
function App() {
  /**
   * 9-cell board state.
   * Each cell is one of: null | "X" | "O"
   */
  const [squares, setSquares] = useState(() => Array(9).fill(null));

  /**
   * Current player whose turn it is.
   * Starts with "X" by requirement.
   */
  const [currentPlayer, setCurrentPlayer] = useState("X");

  /**
   * Outcome placeholder: later steps will compute winner/draw.
   * Keep these here so status/restart behavior is already wired to "game finished".
   */
  const winner = null; // placeholder to be wired next
  const isDraw = false; // placeholder to be wired next
  const isFinished = Boolean(winner) || isDraw;

  /** Status area: show Next: X|O or final outcome placeholders (winner/draw). */
  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "Draw";
    return `Next: ${currentPlayer}`;
  }, [currentPlayer, winner, isDraw]);

  const handleSquareClick = (index) => {
    // Ignore clicks if the game is finished or the target square is already occupied.
    if (isFinished) return;

    setSquares((prev) => {
      if (prev[index] !== null) return prev;

      const next = [...prev];
      next[index] = currentPlayer;
      return next;
    });

    // Turn alternation after a valid move.
    // Note: winner/draw detection will be added next; for now, always alternate on a valid click.
    setCurrentPlayer((p) => (p === "X" ? "O" : "X"));
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    /** Reset to empty board and reset turn/outcome. */
    setSquares(Array(9).fill(null));
    setCurrentPlayer("X");
    // winner/isDraw are placeholders (computed later), so no setter needed yet.
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
          <button
            type="button"
            className="btn btn-large"
            onClick={handleRestart}
          >
            Restart
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
