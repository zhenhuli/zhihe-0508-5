export const CELL_TYPES = {
  WALL: 0,
  PATH: 1,
  START: 2,
  END: 3,
  VISITED: 4,
  PATH_FOUND: 5
};

export class MazeGenerator {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.maze = [];
  }

  generate() {
    this.maze = Array(this.rows).fill().map(() => Array(this.cols).fill(CELL_TYPES.WALL));
    
    const startRow = 1;
    const startCol = 1;
    this.maze[startRow][startCol] = CELL_TYPES.PATH;
    
    this.carve(startRow, startCol);
    
    this.setStartAndEnd();
    
    return this.maze;
  }

  carve(row, col) {
    const directions = this.shuffle([
      [0, 2], [2, 0], [0, -2], [-2, 0]
    ]);
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (this.isValidCell(newRow, newCol) && this.maze[newRow][newCol] === CELL_TYPES.WALL) {
        this.maze[row + dr / 2][col + dc / 2] = CELL_TYPES.PATH;
        this.maze[newRow][newCol] = CELL_TYPES.PATH;
        this.carve(newRow, newCol);
      }
    }
  }

  isValidCell(row, col) {
    return row > 0 && row < this.rows - 1 && col > 0 && col < this.cols - 1;
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  setStartAndEnd() {
    this.maze[1][1] = CELL_TYPES.START;
    
    let endRow = this.rows - 2;
    let endCol = this.cols - 2;
    
    while (this.maze[endRow][endCol] !== CELL_TYPES.PATH) {
      endCol--;
      if (endCol <= 0) {
        endCol = this.cols - 2;
        endRow--;
      }
    }
    
    this.maze[endRow][endCol] = CELL_TYPES.END;
  }

  createEmptyMaze() {
    this.maze = Array(this.rows).fill().map(() => Array(this.cols).fill(CELL_TYPES.PATH));
    
    for (let i = 0; i < this.rows; i++) {
      this.maze[i][0] = CELL_TYPES.WALL;
      this.maze[i][this.cols - 1] = CELL_TYPES.WALL;
    }
    for (let j = 0; j < this.cols; j++) {
      this.maze[0][j] = CELL_TYPES.WALL;
      this.maze[this.rows - 1][j] = CELL_TYPES.WALL;
    }
    
    this.maze[1][1] = CELL_TYPES.START;
    this.maze[this.rows - 2][this.cols - 2] = CELL_TYPES.END;
    
    return this.maze;
  }
}
