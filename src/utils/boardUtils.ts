
export type CellObj = { id: string; value: string };

const makeId = (() => {
  let n = 0;
  return (prefix = "") => `${prefix}${Date.now().toString(36)}_${n++}`;
})();

export const makeCellGrid = (grid: string[][]): CellObj[][] =>
  grid.map(row => row.map(val => ({ id: makeId("cell_"), value: val })));

export const fixGrid = (grid: CellObj[][], elements: string[]): CellObj[][] => {
  const size = grid.length;
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));

  const hasMatchAt = (row: number, col: number, value: string) =>
    (col >= 2 && newGrid[row][col - 1].value === value && newGrid[row][col - 2].value === value) ||
    (row >= 2 && newGrid[row - 1][col].value === value && newGrid[row - 2][col].value === value);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      let val = newGrid[row][col].value;
      while (hasMatchAt(row, col, val)) {
        val = elements[Math.floor(Math.random() * elements.length)];
        newGrid[row][col].value = val;
      }
    }
  }

  return newGrid;
};

export const swapCells = (
  grid: CellObj[][],
  cell1: { row: number; col: number },
  cell2: { row: number; col: number }
): CellObj[][] => {
  const newGrid = grid.map(r => r.map(c => ({ ...c })));
  const temp = newGrid[cell1.row][cell1.col];
  newGrid[cell1.row][cell1.col] = newGrid[cell2.row][cell2.col];
  newGrid[cell2.row][cell2.col] = temp;
  return newGrid;
};

export const findMatches = (grid: CellObj[][]) => {
  const size = grid.length;
  const matches: { row: number; col: number }[] = [];


  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size - 2; col++) {
      const v = grid[row][col].value;
      if (v && v === grid[row][col + 1].value && v === grid[row][col + 2].value) {
        matches.push({ row, col }, { row, col: col + 1 }, { row, col: col + 2 });
      }
    }
  }


  for (let col = 0; col < size; col++) {
    for (let row = 0; row < size - 2; row++) {
      const v = grid[row][col].value;
      if (v && v === grid[row + 1][col].value && v === grid[row + 2][col].value) {
        matches.push({ row, col }, { row: row + 1, col }, { row: row + 2, col });
      }
    }
  }

  return matches.filter(
    (m, i, arr) => i === arr.findIndex(x => x.row === m.row && x.col === m.col)
  );
};

export const removeMatches = (grid: CellObj[][], matches: { row: number; col: number }[]) => {
  const newGrid = grid.map(r => r.map(c => ({ ...c })));
  matches.forEach(({ row, col }) => {
    newGrid[row][col] = { ...newGrid[row][col], value: '' };
  });
  return newGrid;
};

export const collapseWithNewCells = (grid: CellObj[][], elements: string[]) => {
  const size = grid.length;
  const newGrid = grid.map(row => row.map(c => ({ ...c })));
  const falling: { row: number; col: number; distance: number; isNew?: boolean }[] = [];
  const newCells: { row: number; col: number }[] = [];

  for (let col = 0; col < size; col++) {
    let writeRow = size - 1;

    for (let row = size - 1; row >= 0; row--) {
      if (newGrid[row][col].value !== '') {
        if (row !== writeRow) {
          newGrid[writeRow][col] = { ...newGrid[row][col] };
          falling.push({ row: writeRow, col, distance: writeRow - row, isNew: false });
          newGrid[row][col] = { id: '', value: '' };
        }
        writeRow--;
      }
    }
    for (let r = writeRow; r >= 0; r--) {
      const newCell: CellObj = {
        id: makeId("cell_"),
        value: elements[Math.floor(Math.random() * elements.length)],
      };
      newGrid[r][col] = newCell;
      falling.push({ row: r, col, distance: writeRow - r + 1, isNew: true });
      newCells.push({ row: r, col });
    }
  }

  return { grid: newGrid, falling, newCells };
};

export const hasPossibleMoves = (grid: CellObj[][], elements: string[]) => {
  const size = grid.length;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = { row, col };
      const neighbors = [
        { row, col: col + 1 },
        { row, col: col - 1 },
        { row: row + 1, col },
        { row: row - 1, col },
      ];

      for (const n of neighbors) {
        if (n.row < 0 || n.row >= size || n.col < 0 || n.col >= size) continue;

        const tempGrid = swapCells(grid, cell, n);
        if (findMatches(tempGrid).length > 0) return true;
      }
    }
  }

  return false;
};

export const isMatchingCell = (
  matches: { row: number; col: number }[],
  row: number,
  col: number
) => matches.some(m => m.row === row && m.col === col);

export const findFallingCell = (
  falling: { row: number; col: number; distance: number; isNew?: boolean }[],
  row: number,
  col: number
) => falling.find(f => f.row === row && f.col === col);


export const getCellStyle = (fall?: { distance: number }) =>
  fall
    ? {
        transform: `translateY(-${fall.distance * 100}%)`,
        transition: "transform 0.6s cubic-bezier(0.2, 0.8, 0.4, 1)",
      }
    : undefined;

