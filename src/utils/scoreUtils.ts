import { CellObj } from "./boardUtils";

export const calculateScore = (
  matches: { row: number; col: number; element: string }[],
  grid: CellObj[][],
  difficulty: 'easy' | 'medium' | 'hard',
  selectedTargetElement: string | null
): number => {
  if (difficulty === 'hard' && selectedTargetElement) {
    return matches.filter(({ row, col }) => grid[row][col].value === selectedTargetElement).length;
  }
  return matches.length;
};
