import { useState, useEffect } from "react";
import {
  swapCells,
  findMatches,
  removeMatches,
  collapseWithNewCells,
  hasPossibleMoves,
  fixGrid,
  CellObj,
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

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export const useGameLogic = ({ difficulty, elements, onGameOver }: UseGameLogicProps) => {
  const size = difficulty === "easy" ? 12 : 8;

  const [grid, setGrid] = useState<CellObj[][]>([]);
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

  useEffect(() => {
  if (!grid.length) return;

 
  if (!hasPossibleMoves(grid, elements)) {
    const newGrid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => elements[Math.floor(Math.random() * elements.length)])
    );
    setGrid(fixGrid(
      newGrid.map(row => row.map(val => ({ id: `${Date.now()}_${Math.random()}`, value: val }))),
      elements
    ));
  }
 }, [grid, elements, size]);

  useEffect(() => {
    switch (difficulty) {
      case "easy": setGoalScore(40); break;
      case "medium": setGoalScore(50); break;
      case "hard":
        setGoalScore(25);
        const idx = Math.floor(Math.random() * elements.length);
        setSelectedTargetElement(elements[idx]);
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
    const cellGrid = fixGrid(
      baseGrid.map(row => row.map(val => ({ id: `${Date.now()}_${Math.random()}`, value: val }))),
      elements
    );
    setGrid(cellGrid);
  }, [size, elements]);

  const areNeighbors = (a: SelectedCell, b: SelectedCell) =>
    (Math.abs(a.row - b.row) === 1 && a.col === b.col) || (Math.abs(a.col - b.col) === 1 && a.row === b.row);

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

    if (matches.length === 0) {
      if (difficulty === "easy") {
        setGrid(tempGrid);
      } else {
        setScore(prev => Math.max(prev - 5, 0));
        setAnimation(prev => ({ ...prev, shake: true }));
        setTimeout(() => setAnimation(prev => ({ ...prev, shake: false })), 500);
      }
      setSelectedCell(null);
      return;
    }

    const processChain = async (currentGrid: CellObj[][]) => {
    let totalScore = 0;

    setGrid(currentGrid);
    setAnimation({ matches: [], falling: [], newCells: [] });
    await sleep(120);

    let gridCopy = currentGrid;

    while (true) {
      const currentMatches = findMatches(gridCopy);
      if (!currentMatches.length) break;

      totalScore += calculateScore(
        currentMatches.map(m => ({ row: m.row, col: m.col, element: gridCopy[m.row][m.col].value })),
        gridCopy,
        difficulty,
        selectedTargetElement
      );

      setAnimation({ matches: currentMatches, falling: [], newCells: [] });
      await sleep(200); 

      const afterRemove = removeMatches(gridCopy, currentMatches);
      const { grid: collapsed, falling } = collapseWithNewCells(afterRemove, elements);

      gridCopy = collapsed;
      setGrid(collapsed);
      setAnimation({ matches: [], falling, newCells: [] }); 

      await sleep(100);
    }

    setScore(prev => {
      const newScore = prev + totalScore;
      if (newScore >= goalScore) {
        setTimeIsRunning(false);
        onGameOver(newScore, time);
      }
      return newScore;
    });

    setSelectedCell(null);
    setAnimation({ matches: [], falling: [], newCells: [] });
  };

      processChain(tempGrid);
    };

  const handleRefresh = () => {
    if (difficulty !== "easy") setScore(prev => Math.max(prev - 5, 0));
    const newGrid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => elements[Math.floor(Math.random() * elements.length)])
    );
    setGrid(fixGrid(
      newGrid.map(row => row.map(val => ({ id: `${Date.now()}_${Math.random()}`, value: val }))),
      elements
    ));
  };

  const resetGame = () => {
    setScore(0);
    setTime(0);
    setSelectedCell(null);
    setAnimation({ matches: [], falling: [], newCells: [] });
    const newGrid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => elements[Math.floor(Math.random() * elements.length)])
    );
    setGrid(fixGrid(
      newGrid.map(row => row.map(val => ({ id: `${Date.now()}_${Math.random()}`, value: val }))),
      elements
    ));
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
