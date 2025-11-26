
// Гарантирует, что на старте не будет готовых рядов по 3 и более
export const fixGrid = (grid: string[][], elements: string[]): string[][] => {
  const size = grid.length;
  const newGrid = grid.map(row => [...row]);

  const hasMatchat = (row: number, col: number, value: string): boolean => {
    if (col >= 2 && newGrid[row][col - 1] === value && newGrid[row][col - 2] === value) return true;
    if (row >= 2 && newGrid[row - 1][col] === value && newGrid[row - 2][col] === value) return true;
    return false;
  }

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      let newValue = newGrid[row][col];
      while (hasMatchat(row, col, newValue)) {
        newValue = elements[Math.floor(Math.random() * elements.length)];
        newGrid[row][col] = newValue;
      }
    }
  }

  return newGrid;
};

//Меняет местами предметы
export const swapCells = (grid: string[][], cell1: { row: number; col: number }, cell2: { row: number; col: number }) => {
  const newGrid = grid.map(r => [...r]);
  const temp = newGrid[cell1.row][cell1.col];
  newGrid[cell1.row][cell1.col] = newGrid[cell2.row][cell2.col];
  newGrid[cell2.row][cell2.col] = temp;
  return newGrid;
};

//Ищет все последовательности совпадающих клеток
export const findMatches = (grid: string[][]) => {
  const size = grid.length;
  const matches: { row: number; col: number }[] = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size - 2; col++) {
      const v = grid[row][col];
      if (v && v === grid[row][col + 1] && v === grid[row][col + 2]) {
        matches.push({ row, col }, { row, col: col + 1 }, { row, col: col + 2 });
      }
    }
  }

  for (let col = 0; col < size; col++) {
    for (let row = 0; row < size - 2; row++) {
      const v = grid[row][col];
      if (v && v === grid[row + 1][col] && v === grid[row + 2][col]) {
        matches.push({ row, col }, { row: row + 1, col }, { row: row + 2, col });
      }
    }
  }

  return matches.filter((match, index, self) =>
    index === self.findIndex(m => m.row === match.row && m.col === match.col)
  );
};

//Удаляет совпадающие элементы с поля
export const removeMatches = (grid: string[][], matches: { row: number; col: number }[]) => {
  const newGrid = grid.map(row => [...row]);
  matches.forEach(({ row, col }) => {
    newGrid[row][col] = '';
  });
  return newGrid;
};
//Смещает элементы вниз на образовавшиеся пустоты
export const collapseGrid = (grid: string[][], elements: string[]) => {
  const size = grid.length;
  const newGrid = grid.map(row => [...row]);

  for (let col = 0; col < size; col++) {
    const column: string[] = [];
    for (let row = 0; row < size; row++) {
      if (newGrid[row][col] !== '') column.push(newGrid[row][col]);
    }
    const missing = size - column.length;
    const newColumn = Array.from({ length: missing }, () => elements[Math.floor(Math.random() * elements.length)]).concat(column);
    for (let row = 0; row < size; row++) {
      newGrid[row][col] = newColumn[row];
    }
  }

  return newGrid;
};
//Проверяет, есть ли возможные ходы
export const hasPossibleMoves = (grid: string[][], elements: string[]) => {
  const size = grid.length;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = { row, col };
      const neighbors = [
        { row, col: col + 1 },
        { row, col: col - 1 },
        { row: row + 1, col },
        { row: row - 1, col }
      ];

      for (const n of neighbors) {
        if (n.row >= 0 && n.row < size && n.col >= 0 && n.col < size) {
          const tempGrid = swapCells(grid, cell, n);
          if (findMatches(tempGrid).length > 0) return true;
        }
      }
    }
  }

  return false;
};
