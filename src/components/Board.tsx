import React from "react";
import Cell from "./Cell";
import "../styles/Cell.css";

interface BoardProps {
  grid: string[][];
  onCellClick: (row: number, col: number) => void;
  selected: { row: number; col: number } | null;
  size: number;
  animation: {
    matches: { row: number; col: number }[];
    falling: { row: number; col: number; distance: number }[];
    newCells: { row: number; col: number }[];
    shake?: boolean;
  };
}

export default function Board({ grid, onCellClick, selected, size, animation }: BoardProps) {
  const isMatching = (r: number, c: number) =>
    animation.matches.some(m => m.row === r && m.col === c);

  const isFalling = (r: number, c: number) =>
    animation.falling.some(f => f.row === r && f.col === c);

  const getFallDistance = (r: number, c: number) => {
    const fall = animation.falling.find(f => f.row === r && f.col === c);
    return fall ? fall.distance : 0;
  };

  const isNew = (r: number, c: number) =>
    animation.newCells.some(n => n.row === r && n.col === c);

  return (
    <div
  className={`board-grid ${animation.shake ? "shake" : ""}`}
  style={{
    display: "grid",
    gridTemplateColumns: `repeat(${size}, 1fr)`,
    gridTemplateRows: `repeat(${size}, 1fr)`, 
    gap: "clamp(1.5px, 0.4vw, 3px)",  
    width: "min(96vw, 560px)",  
    aspectRatio: "1 / 1",  
    margin: "0 auto", 
    padding: "6px",
    boxSizing: "border-box",
    maxWidth: "100%",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "14px",
    boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
  } as React.CSSProperties}
>
      {grid.map((row, r) =>
        row.map((value, c) => {
          const extraClass = [
            isMatching(r, c) ? "match" : "",
            isFalling(r, c) ? "falling" : "",
            isNew(r, c) ? "new" : "",
          ].filter(Boolean).join(" ");

          const fallDistance = getFallDistance(r, c);

          return (
            <div key={`${r}-${c}`} style={{ position: "relative", overflow: "hidden" }}>
              <Cell
                value={value}
                onClick={() => onCellClick(r, c)}
                isSelected={selected?.row === r && selected?.col === c}
                extraClass={extraClass}
                style={
                  isFalling(r, c)
                    ? {
                        transform: `translateY(-${fallDistance * 100}%)`,
                        transition: "transform 0.6s cubic-bezier(0.2, 0.8, 0.4, 1)",
                      }
                    : undefined
                }
              />
            </div>
          );
        })
      )}
    </div>
  );
}