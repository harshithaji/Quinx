// src/App.js
import React, { useState } from "react";
import "./App.css";

const initialGrid = Array(9).fill(Array(9).fill(""));

const App = () => {
  const [grid, setGrid] = useState(initialGrid);
  const [error, setError] = useState("");

  const handleChange = (row, col, value) => {
    if (value === "" || (/^[1-9]$/.test(value) && value.length === 1)) {
      const newGrid = grid.map((r, i) =>
        i === row ? r.map((cell, j) => (j === col ? value : cell)) : r
      );
      setGrid(newGrid);
    }
  };

  const isValid = (grid) => {
    for (let i = 0; i < 9; i++) {
      let rowSet = new Set();
      let colSet = new Set();
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] && rowSet.has(grid[i][j])) return false;
        rowSet.add(grid[i][j]);

        if (grid[j][i] && colSet.has(grid[j][i])) return false;
        colSet.add(grid[j][i]);
      }
    }
    for (let r = 0; r < 9; r += 3) {
      for (let c = 0; c < 9; c += 3) {
        let boxSet = new Set();
        for (let i = r; i < r + 3; i++) {
          for (let j = c; j < c + 3; j++) {
            if (grid[i][j] && boxSet.has(grid[i][j])) return false;
            boxSet.add(grid[i][j]);
          }
        }
      }
    }
    return true;
  };

  const validateGrid = () => {
    setError("");
    if (isValid(grid)) {
      alert("The grid is valid.");
    } else {
      setError("Invalid Sudoku grid.");
    }
  };

  const solveSudoku = (grid) => {
    const emptyCell = findEmpty(grid);
    if (!emptyCell) return true;

    const [row, col] = emptyCell;
    for (let num = 1; num <= 9; num++) {
      if (isSafe(grid, row, col, num.toString())) {
        grid[row][col] = num.toString();
        if (solveSudoku(grid)) return true;
        grid[row][col] = "";
      }
    }
    return false;
  };

  const findEmpty = (grid) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] === "") return [i, j];
      }
    }
    return null;
  };

  const isSafe = (grid, row, col, num) => {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }
    const boxRow = row - (row % 3);
    const boxCol = col - (col % 3);
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (grid[i][j] === num) return false;
      }
    }
    return true;
  };

  const handleSolve = () => {
    const newGrid = grid.map(row => [...row]);
    if (isValid(newGrid) && solveSudoku(newGrid)) {
      setGrid(newGrid);
      setError("");
    } else {
      setError("The grid is unsolvable.");
    }
  };

  return (
    <div>

      <section class="cd-intro">
        <div class="cd-intro-content bouncy">
          <h1 className="font_style">Quinx Assessment</h1>
        </div>
      </section>
      <div className="App">
        <h1>Sudoku Solver</h1>
        {error && <div className="error">{error}</div>}
        <div className="sudoku-grid">
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <input
                key={`${i}-${j}`}
                type="text"
                maxLength="1"
                value={cell}
                onChange={(e) => handleChange(i, j, e.target.value)}
              />
            ))
          )}
        </div>
        <div className="buttons">
          <button onClick={validateGrid}>Validate</button>
          <button onClick={handleSolve}>Solve</button>
        </div>
      </div>
    </div>
  );
};

export default App;
