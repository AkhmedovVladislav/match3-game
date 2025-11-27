import React from "react";
import Cell from "./Cell";
import "../styles/Board.css";
import { isMatchingCell, findFallingCell, getCellStyle } from "../utils/boardUtils"; // используем существующий файл

interface CellObj { id: string; value: string }

interface BoardProps {
  grid: CellObj[][];
  onCellClick: (row: number, col: number) => void;
  selected: { row: number; col: number } | null;
  size: number;
  animation: {
    matches: { row: number; col: number }[];
    falling: { row: number; col: number; distance: number; isNew?: boolean }[];
    newCells: { row: number; col: number }[];
    shake?: boolean;
  };
}

export default function Board({ grid, onCellClick, selected, size, animation }: BoardProps) {
  return (
    <div
      className={`board-grid ${animation.shake ? "shake" : ""}`}
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const matchClass = isMatchingCell(animation.matches, r, c) ? "match" : "";
          const fall = findFallingCell(animation.falling, r, c);
          const extraClass = [matchClass, fall ? "falling" : ""].filter(Boolean).join(" ");

          return (
            <div key={cell.id} className="cell-wrapper">
              <Cell
                value={cell.value}
                onClick={() => onCellClick(r, c)}
                isSelected={selected?.row === r && selected?.col === c}
                extraClass={extraClass}
                style={getCellStyle(fall)}
              />
            </div>
          );
        })
      )}
    </div>
  );
}