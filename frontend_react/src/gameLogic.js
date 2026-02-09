/**
 * Pure, framework-agnostic game logic utilities for Tic Tac Toe.
 */

/**
 * All winning line triplets (rows, columns, diagonals) for a 3x3 board.
 * Indexes correspond to the 9-element squares array.
 */
const WIN_LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * PUBLIC_INTERFACE
 * Calculate the winner for a given board.
 *
 * @param {(null|"X"|"O")[]} squares - A 9-element array representing the board.
 * @returns {("X"|"O"|null)} Returns "X" or "O" if there is a winner; otherwise null.
 */
export function calculateWinner(squares) {
  for (const [a, b, c] of WIN_LINES) {
    const value = squares[a];
    if (value && value === squares[b] && value === squares[c]) {
      return value;
    }
  }
  return null;
}

/**
 * PUBLIC_INTERFACE
 * Determine if the game is a draw (all squares filled and no winner).
 *
 * @param {(null|"X"|"O")[]} squares - A 9-element array representing the board.
 * @returns {boolean} True if the board is full and there is no winner.
 */
export function calculateIsDraw(squares) {
  // Draw requires a full board AND no winner.
  if (calculateWinner(squares)) return false;
  return squares.every((v) => v !== null);
}
