import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

/**
 * Helper to get all 9 squares as button elements.
 * We rely on accessible name (aria-label) patterns from App.js, not on CSS classes.
 */
function getSquares() {
  return Array.from({ length: 9 }, (_, i) => {
    const row = Math.floor(i / 3) + 1;
    const col = (i % 3) + 1;
    return screen.getByRole("button", {
      name: new RegExp(`Square row ${row} column ${col}`, "i"),
    });
  });
}

describe("Tic Tac Toe gameplay", () => {
  test("Initial render shows status 'Next: X' and an empty board", () => {
    render(<App />);

    expect(screen.getByRole("status")).toHaveTextContent("Next: X");

    const squares = getSquares();
    expect(squares).toHaveLength(9);

    // Empty board: no X/O text, and aria-label indicates "empty"
    for (const square of squares) {
      expect(square).toHaveTextContent(/^$/);
      expect(square).toHaveAccessibleName(/empty/i);
      expect(square).toBeEnabled();
    }
  });

  test("Clicking squares alternates turns: X then O", async () => {
    const user = userEvent.setup();
    render(<App />);

    const squares = getSquares();

    await user.click(squares[0]);
    expect(squares[0]).toHaveTextContent("X");
    expect(screen.getByRole("status")).toHaveTextContent("Next: O");

    await user.click(squares[1]);
    expect(squares[1]).toHaveTextContent("O");
    expect(screen.getByRole("status")).toHaveTextContent("Next: X");
  });

  test("Prevents overwriting an occupied square", async () => {
    const user = userEvent.setup();
    render(<App />);

    const squares = getSquares();

    await user.click(squares[0]);
    expect(squares[0]).toHaveTextContent("X");
    expect(screen.getByRole("status")).toHaveTextContent("Next: O");

    // Attempt to click the same square again; it should remain X and turn should not change.
    await user.click(squares[0]);
    expect(squares[0]).toHaveTextContent("X");
    expect(screen.getByRole("status")).toHaveTextContent("Next: O");
  });

  test("Detects a winner and shows status 'Winner: X' (and disables further moves)", async () => {
    const user = userEvent.setup();
    render(<App />);

    const squares = getSquares();

    // X wins on top row: [0,1,2]
    // X:0, O:3, X:1, O:4, X:2
    await user.click(squares[0]); // X
    await user.click(squares[3]); // O
    await user.click(squares[1]); // X
    await user.click(squares[4]); // O
    await user.click(squares[2]); // X wins

    expect(screen.getByRole("status")).toHaveTextContent("Winner: X");

    // After win, all squares become disabled (per App.js isFinished logic).
    for (const square of squares) {
      expect(square).toBeDisabled();
    }
  });

  test("Detects a draw when board is full and shows status 'Draw'", async () => {
    const user = userEvent.setup();
    render(<App />);

    const squares = getSquares();

    /**
     * Fill the board with a known draw sequence:
     * X O X
     * X O O
     * O X X
     *
     * Indices: 0 1 2 / 3 4 5 / 6 7 8
     * Move order (alternating automatically starting with X):
     * 0(X),1(O),2(X),4(O),3(X),5(O),7(X),6(O),8(X)
     */
    const drawMoves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
    for (const idx of drawMoves) {
      await user.click(squares[idx]);
    }

    expect(screen.getByRole("status")).toHaveTextContent("Draw");

    // Board is full
    for (const square of squares) {
      expect(square).not.toHaveTextContent(/^$/);
      expect(square).toBeDisabled();
    }
  });

  test("Restart button resets board and status", async () => {
    const user = userEvent.setup();
    render(<App />);

    const squares = getSquares();

    // Make a couple moves
    await user.click(squares[0]); // X
    await user.click(squares[1]); // O
    expect(squares[0]).toHaveTextContent("X");
    expect(squares[1]).toHaveTextContent("O");
    expect(screen.getByRole("status")).toHaveTextContent("Next: X");

    // Restart resets everything
    await user.click(screen.getByRole("button", { name: /restart/i }));

    expect(screen.getByRole("status")).toHaveTextContent("Next: X");
    const squaresAfter = getSquares();
    for (const square of squaresAfter) {
      expect(square).toHaveTextContent(/^$/);
      expect(square).toHaveAccessibleName(/empty/i);
      expect(square).toBeEnabled();
    }
  });
});
