import React, { useMemo, useState } from "react";
import "./App.css";
import { calculateIsDraw, calculateWinner } from "./gameLogic";

/**
 * Tic Tac Toe UI scaffold + game state.
 * Winner/draw detection is computed from the board state via pure utilities.
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

  /** Compute outcome from current board (pure derivation). */
  const winner = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(() => calculateIsDraw(squares), [squares]);
  const isFinished = Boolean(winner) || isDraw;

  /** Status area: show Winner / Draw / Next. */
  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "Draw";
    return `Next: ${currentPlayer}`;
  }, [currentPlayer, winner, isDraw]);

  const handleSquareClick = (index) => {
    // Ignore clicks if the game is finished or the target square is already occupied.
    if (isFinished) return;

    // Only apply a move if the square is empty.
    if (squares[index] !== null) return;

    const nextSquares = [...squares];
    nextSquares[index] = currentPlayer;

    setSquares(nextSquares);

    // Alternate turn after a valid move.
    setCurrentPlayer((p) => (p === "X" ? "O" : "X"));
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    /** Reset to empty board and reset turn. */
    setSquares(Array(9).fill(null));
    setCurrentPlayer("X");
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

        <section className="ttt-board" aria-label="Tic Tac Toe board" role="grid">
          {squares.map((value, index) => {
            const row = Math.floor(index / 3) + 1;
            const col = (index % 3) + 1;
            const isDisabled = isFinished || value !== null;

            return (
              <button
                key={index}
                type="button"
                className="ttt-square"
                onClick={() => handleSquareClick(index)}
                disabled={isDisabled}
                aria-disabled={isDisabled}
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
