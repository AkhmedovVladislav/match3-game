import { useState, useEffect } from "react";
import {
  fixGrid,
  swapCells,
  findMatches,
  removeMatches,
  hasPossibleMoves,
} from "../utils/boardUtils";
import { calculateScore } from "../utils/scoreUtils";

type Difficulty = "easy" | "medium" | "hard";

interface SelectedCell {
  row: number;
  col: number;
}

interface AnimationState {
  matches: { row: number; col: number }[];
  falling: { row: number; col: number; distance: number }[];
  newCells: { row: number; col: number }[];
  shake?: boolean;
}

interface UseGameLogicProps {
  difficulty: Difficulty;
  elements: string[];
  onGameOver: (score: number, time: number) => void;
}

export const useGameLogic = ({ difficulty, elements, onGameOver }: UseGameLogicProps) => {
  const size = difficulty === "easy" ? 12 : 8;

  const [grid, setGrid] = useState<string[][]>([]);
  const [score, setScore] = useState(0);
  const [goalScore, setGoalScore] = useState(0);
  const [time, setTime] = useState(0);
  const [timeIsRunning, setTimeIsRunning] = useState(true);
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
  const [selectedTargetElement, setSelectedTargetElement] = useState<string | null>(null);
  const [animation, setAnimation] = useState<AnimationState>({
    matches: [],
    falling: [],
    newCells: [],
  });

  // === Инициализация ===
  useEffect(() => {
    switch (difficulty) {
      case "easy": setGoalScore(40); break;
      case "medium": setGoalScore(50); break;
      case "hard":
        setGoalScore(25);
        const randomIndex = Math.floor(Math.random() * elements.length);
        setSelectedTargetElement(elements[randomIndex]);
        break;
    }
  }, [difficulty, elements]);

  useEffect(() => {
    if (!timeIsRunning) return;
    const interval = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [timeIsRunning]);

  useEffect(() => {
    const baseGrid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => elements[Math.floor(Math.random() * elements.length)])
    );
    setGrid(fixGrid(baseGrid, elements));
  }, [size]);

  const areNeighbors = (a: SelectedCell, b: SelectedCell) => {
    const dx = Math.abs(a.col - b.col);
    const dy = Math.abs(a.row - b.row);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  };

  
  const collapseWithNewCells = (grid: string[][], elements: string[]) => {
    const size = grid.length;
    const newGrid = grid.map(row => [...row]);
    const falling: { row: number; col: number; distance: number }[] = [];
    const newCells: { row: number; col: number }[] = [];

    for (let col = 0; col < size; col++) {
      let writeRow = size - 1;
      let emptyCount = 0;

      for (let row = size - 1; row >= 0; row--) {
        if (newGrid[row][col] === "") {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            falling.push({ row: writeRow, col, distance: emptyCount });
          }
          newGrid[writeRow][col] = newGrid[row][col];
          writeRow--;
        }
      }

      for (let row = writeRow; row >= 0; row--) {
        newGrid[row][col] = elements[Math.floor(Math.random() * elements.length)];
        newCells.push({ row, col });
      }
    }

    return { grid: newGrid, falling, newCells };
  };

  const handleCellClick = (row: number, col: number) => {
    if (!grid.length) return;

    if (selectedCell?.row === row && selectedCell?.col === col) {
      setSelectedCell(null);
      return;
    }

    if (!selectedCell) {
      setSelectedCell({ row, col });
      return;
    }

    const targetCell = { row, col };
    if (!areNeighbors(selectedCell, targetCell)) {
      setSelectedCell(targetCell);
      return;
    }

    const tempGrid = swapCells(grid, selectedCell, targetCell);
    const matches = findMatches(tempGrid);

    if (matches.length > 0) {
      setGrid(tempGrid);
      setAnimation(prev => ({ ...prev, matches }));

      setTimeout(() => {
        let currentGrid = tempGrid;
        let totalScore = 0;

        const processChain = () => {
          const currentMatches = findMatches(currentGrid);
          if (currentMatches.length === 0) {
            setSelectedCell(null);
            setAnimation({ matches: [], falling: [], newCells: [] });
            if (!hasPossibleMoves(currentGrid, elements)) {
              const fresh = Array.from({ length: size }, () =>
                Array.from({ length: size }, () => elements[Math.floor(Math.random() * elements.length)])
              );
              setGrid(fixGrid(fresh, elements));
            }
            return;
          }

          totalScore += calculateScore(currentMatches, currentGrid, difficulty, selectedTargetElement);
          currentGrid = removeMatches(currentGrid, currentMatches);
          const { grid: collapsed, falling, newCells } = collapseWithNewCells(currentGrid, elements);
          currentGrid = collapsed;

          setGrid(currentGrid);
          setAnimation(prev => ({ ...prev, falling, newCells, matches: [] }));

          setScore(prev => {
            const newScore = prev + totalScore;
            if (newScore >= goalScore) {
              setTimeIsRunning(false);
              onGameOver(newScore, time);
            }
            return newScore;
          });

          setTimeout(processChain, 620);
        };

        processChain();
      }, 550);
    } else {
      if (difficulty === "easy") {
        setGrid(tempGrid);
      } else {
        setScore(prev => Math.max(prev - 5, 0));
        setAnimation(prev => ({ ...prev, shake: true }));
        setTimeout(() => {
          setAnimation(prev => ({ ...prev, shake: false }));
          const fresh = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => elements[Math.floor(Math.random() * elements.length)])
          );
          setGrid(fixGrid(fresh, elements));
        }, 500);
      }
      setSelectedCell(null);
    }
  };

  const handleRefresh = () => {
    if (difficulty !== "easy") setScore(prev => Math.max(prev - 5, 0));
    const newGrid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => elements[Math.floor(Math.random() * elements.length)])
    );
    setGrid(fixGrid(newGrid, elements));
  };

  const resetGame = () => {
    setScore(0);
    setTime(0);
    setSelectedCell(null);
    setAnimation({ matches: [], falling: [], newCells: [] });
    const newGrid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => elements[Math.floor(Math.random() * elements.length)])
    );
    setGrid(fixGrid(newGrid, elements));
  };

  return {
    grid,
    score,
    time,
    selectedCell,
    selectedTargetElement,
    goalScore,
    handleCellClick,
    handleRefresh,
    resetGame,
    size,
    animation,
  };
};