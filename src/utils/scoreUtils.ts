//Считает набранные очки
export const calculateScore = (
  matches: { row: number; col: number }[],
  grid: string[][],
  difficulty: 'easy' | 'medium' | 'hard',
  selectedTargetElement: string | null
): number => {
  if (difficulty === 'hard' && selectedTargetElement) {
    return matches.filter(({ row, col }) => grid[row][col] === selectedTargetElement).length;
  }
  return matches.length;
};