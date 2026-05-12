const GRID_SIZE = 4;
const WINNING_TILE = 2048;

export function createEmptyGrid() {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
}

export function addRandomTile(grid) {
  const emptyCells = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === 0) {
        emptyCells.push({ row: i, col: j });
      }
    }
  }
  
  if (emptyCells.length === 0) return false;
  
  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  grid[row][col] = Math.random() < 0.9 ? 2 : 4;
  return true;
}

function slideAndMerge(row) {
  let filtered = row.filter(val => val !== 0);
  let score = 0;
  
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      score += filtered[i];
      filtered.splice(i + 1, 1);
    }
  }
  
  while (filtered.length < GRID_SIZE) {
    filtered.push(0);
  }
  
  return { result: filtered, score };
}

export function moveLeft(grid) {
  let totalScore = 0;
  let moved = false;
  
  for (let i = 0; i < GRID_SIZE; i++) {
    const original = [...grid[i]];
    const { result, score } = slideAndMerge(grid[i]);
    grid[i] = result;
    totalScore += score;
    if (JSON.stringify(original) !== JSON.stringify(result)) {
      moved = true;
    }
  }
  
  return { moved, score: totalScore };
}

export function moveRight(grid) {
  let totalScore = 0;
  let moved = false;
  
  for (let i = 0; i < GRID_SIZE; i++) {
    const original = [...grid[i]];
    const reversed = [...grid[i]].reverse();
    const { result, score } = slideAndMerge(reversed);
    grid[i] = result.reverse();
    totalScore += score;
    if (JSON.stringify(original) !== JSON.stringify(grid[i])) {
      moved = true;
    }
  }
  
  return { moved, score: totalScore };
}

export function moveUp(grid) {
  let totalScore = 0;
  let moved = false;
  
  for (let j = 0; j < GRID_SIZE; j++) {
    const column = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      column.push(grid[i][j]);
    }
    const original = [...column];
    const { result, score } = slideAndMerge(column);
    
    for (let i = 0; i < GRID_SIZE; i++) {
      grid[i][j] = result[i];
    }
    totalScore += score;
    
    if (JSON.stringify(original) !== JSON.stringify(result)) {
      moved = true;
    }
  }
  
  return { moved, score: totalScore };
}

export function moveDown(grid) {
  let totalScore = 0;
  let moved = false;
  
  for (let j = 0; j < GRID_SIZE; j++) {
    const column = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      column.push(grid[i][j]);
    }
    const original = [...column];
    
    const reversed = column.reverse();
    const { result, score } = slideAndMerge(reversed);
    const finalColumn = result.reverse();
    
    for (let i = 0; i < GRID_SIZE; i++) {
      grid[i][j] = finalColumn[i];
    }
    totalScore += score;
    
    if (JSON.stringify(original) !== JSON.stringify(finalColumn)) {
      moved = true;
    }
  }
  
  return { moved, score: totalScore };
}

export function checkWin(grid) {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === WINNING_TILE) {
        return true;
      }
    }
  }
  return false;
}

export function checkGameOver(grid) {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === 0) {
        return false;
      }
    }
  }
  
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const current = grid[i][j];
      if (j < GRID_SIZE - 1 && grid[i][j + 1] === current) {
        return false;
      }
      if (i < GRID_SIZE - 1 && grid[i + 1][j] === current) {
        return false;
      }
    }
  }
  
  return true;
}

export function copyGrid(grid) {
  return grid.map(row => [...row]);
}
