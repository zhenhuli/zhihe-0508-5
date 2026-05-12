import { CELL_TYPES } from './maze-generator.js';

class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    const item = { element, priority };
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (item.priority < this.items[i].priority) {
        this.items.splice(i, 0, item);
        added = true;
        break;
      }
    }
    if (!added) {
      this.items.push(item);
    }
  }

  dequeue() {
    return this.items.shift().element;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

export class PathFinder {
  constructor(maze) {
    this.maze = maze;
    this.rows = maze.length;
    this.cols = maze[0].length;
    this.visited = [];
    this.parent = [];
    this.steps = [];
  }

  findStartAndEnd() {
    let start = null;
    let end = null;
    
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.maze[i][j] === CELL_TYPES.START) {
          start = [i, j];
        } else if (this.maze[i][j] === CELL_TYPES.END) {
          end = [i, j];
        }
      }
    }
    
    return { start, end };
  }

  isWalkable(row, col) {
    return row >= 0 && row < this.rows && 
           col >= 0 && col < this.cols && 
           this.maze[row][col] !== CELL_TYPES.WALL;
  }

  heuristic(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  }

  dfs() {
    const { start, end } = this.findStartAndEnd();
    if (!start || !end) return { steps: [], path: [] };
    
    this.visited = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    this.parent = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
    this.steps = [];
    
    const stack = [start];
    this.visited[start[0]][start[1]] = true;
    
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    while (stack.length > 0) {
      const [row, col] = stack.pop();
      
      if (row === end[0] && col === end[1]) {
        break;
      }
      
      if (this.maze[row][col] === CELL_TYPES.PATH) {
        this.steps.push({ row, col, type: 'visit' });
      }
      
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (this.isWalkable(newRow, newCol) && !this.visited[newRow][newCol]) {
          this.visited[newRow][newCol] = true;
          this.parent[newRow][newCol] = [row, col];
          stack.push([newRow, newCol]);
        }
      }
    }
    
    const path = this.reconstructPath(end);
    return { steps: this.steps, path };
  }

  bfs() {
    const { start, end } = this.findStartAndEnd();
    if (!start || !end) return { steps: [], path: [] };
    
    this.visited = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    this.parent = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
    this.steps = [];
    
    const queue = [start];
    this.visited[start[0]][start[1]] = true;
    
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    while (queue.length > 0) {
      const [row, col] = queue.shift();
      
      if (row === end[0] && col === end[1]) {
        break;
      }
      
      if (this.maze[row][col] === CELL_TYPES.PATH) {
        this.steps.push({ row, col, type: 'visit' });
      }
      
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (this.isWalkable(newRow, newCol) && !this.visited[newRow][newCol]) {
          this.visited[newRow][newCol] = true;
          this.parent[newRow][newCol] = [row, col];
          queue.push([newRow, newCol]);
        }
      }
    }
    
    const path = this.reconstructPath(end);
    return { steps: this.steps, path };
  }

  dijkstra() {
    const { start, end } = this.findStartAndEnd();
    if (!start || !end) return { steps: [], path: [] };
    
    this.visited = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    this.parent = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
    this.steps = [];
    
    const distances = Array(this.rows).fill().map(() => 
      Array(this.cols).fill(Infinity)
    );
    distances[start[0]][start[1]] = 0;
    
    const pq = new PriorityQueue();
    pq.enqueue(start, 0);
    this.visited[start[0]][start[1]] = true;
    
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    while (!pq.isEmpty()) {
      const [row, col] = pq.dequeue();
      
      if (row === end[0] && col === end[1]) {
        break;
      }
      
      if (this.maze[row][col] === CELL_TYPES.PATH) {
        this.steps.push({ row, col, type: 'visit' });
      }
      
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (this.isWalkable(newRow, newCol)) {
          const newDist = distances[row][col] + 1;
          
          if (newDist < distances[newRow][newCol]) {
            distances[newRow][newCol] = newDist;
            this.parent[newRow][newCol] = [row, col];
            
            if (!this.visited[newRow][newCol]) {
              this.visited[newRow][newCol] = true;
              pq.enqueue([newRow, newCol], newDist);
            }
          }
        }
      }
    }
    
    const path = this.reconstructPath(end);
    return { steps: this.steps, path };
  }

  aStar() {
    const { start, end } = this.findStartAndEnd();
    if (!start || !end) return { steps: [], path: [] };
    
    this.visited = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    this.parent = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
    this.steps = [];
    
    const gScore = Array(this.rows).fill().map(() => 
      Array(this.cols).fill(Infinity)
    );
    const fScore = Array(this.rows).fill().map(() => 
      Array(this.cols).fill(Infinity)
    );
    
    gScore[start[0]][start[1]] = 0;
    fScore[start[0]][start[1]] = this.heuristic(start, end);
    
    const pq = new PriorityQueue();
    pq.enqueue(start, fScore[start[0]][start[1]]);
    this.visited[start[0]][start[1]] = true;
    
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    while (!pq.isEmpty()) {
      const [row, col] = pq.dequeue();
      
      if (row === end[0] && col === end[1]) {
        break;
      }
      
      if (this.maze[row][col] === CELL_TYPES.PATH) {
        this.steps.push({ row, col, type: 'visit' });
      }
      
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (this.isWalkable(newRow, newCol)) {
          const tentativeG = gScore[row][col] + 1;
          
          if (tentativeG < gScore[newRow][newCol]) {
            this.parent[newRow][newCol] = [row, col];
            gScore[newRow][newCol] = tentativeG;
            fScore[newRow][newCol] = tentativeG + this.heuristic([newRow, newCol], end);
            
            if (!this.visited[newRow][newCol]) {
              this.visited[newRow][newCol] = true;
              pq.enqueue([newRow, newCol], fScore[newRow][newCol]);
            }
          }
        }
      }
    }
    
    const path = this.reconstructPath(end);
    return { steps: this.steps, path };
  }

  bidirectionalBFS() {
    const { start, end } = this.findStartAndEnd();
    if (!start || !end) return { steps: [], path: [] };
    
    this.visited = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    this.parent = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
    const parentEnd = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
    this.steps = [];
    
    const visitedStart = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    const visitedEnd = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    
    const queueStart = [start];
    const queueEnd = [end];
    
    visitedStart[start[0]][start[1]] = true;
    visitedEnd[end[0]][end[1]] = true;
    
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    let meetingPoint = null;
    
    while (queueStart.length > 0 && queueEnd.length > 0) {
      const levelSize = queueStart.length;
      for (let i = 0; i < levelSize; i++) {
        const [row, col] = queueStart.shift();
        
        if (visitedEnd[row][col]) {
          meetingPoint = [row, col];
          break;
        }
        
        if (this.maze[row][col] === CELL_TYPES.PATH) {
          this.steps.push({ row, col, type: 'visit' });
        }
        
        for (const [dr, dc] of directions) {
          const newRow = row + dr;
          const newCol = col + dc;
          
          if (this.isWalkable(newRow, newCol) && !visitedStart[newRow][newCol]) {
            visitedStart[newRow][newCol] = true;
            this.parent[newRow][newCol] = [row, col];
            queueStart.push([newRow, newCol]);
          }
        }
      }
      
      if (meetingPoint) break;
      
      const levelSizeEnd = queueEnd.length;
      for (let i = 0; i < levelSizeEnd; i++) {
        const [row, col] = queueEnd.shift();
        
        if (visitedStart[row][col]) {
          meetingPoint = [row, col];
          break;
        }
        
        if (this.maze[row][col] === CELL_TYPES.PATH) {
          this.steps.push({ row, col, type: 'visit' });
        }
        
        for (const [dr, dc] of directions) {
          const newRow = row + dr;
          const newCol = col + dc;
          
          if (this.isWalkable(newRow, newCol) && !visitedEnd[newRow][newCol]) {
            visitedEnd[newRow][newCol] = true;
            parentEnd[newRow][newCol] = [row, col];
            queueEnd.push([newRow, newCol]);
          }
        }
      }
      
      if (meetingPoint) break;
    }
    
    if (!meetingPoint) {
      return { steps: this.steps, path: [] };
    }
    
    const path1 = [];
    let current = meetingPoint;
    while (current) {
      path1.unshift(current);
      current = this.parent[current[0]][current[1]];
    }
    
    const path2 = [];
    current = parentEnd[meetingPoint[0]][meetingPoint[1]];
    while (current) {
      path2.push(current);
      current = parentEnd[current[0]][current[1]];
    }
    
    const path = [...path1, ...path2];
    return { steps: this.steps, path };
  }

  bestFirstSearch() {
    const { start, end } = this.findStartAndEnd();
    if (!start || !end) return { steps: [], path: [] };
    
    this.visited = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    this.parent = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
    this.steps = [];
    
    const pq = new PriorityQueue();
    pq.enqueue(start, this.heuristic(start, end));
    this.visited[start[0]][start[1]] = true;
    
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    while (!pq.isEmpty()) {
      const [row, col] = pq.dequeue();
      
      if (row === end[0] && col === end[1]) {
        break;
      }
      
      if (this.maze[row][col] === CELL_TYPES.PATH) {
        this.steps.push({ row, col, type: 'visit' });
      }
      
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (this.isWalkable(newRow, newCol) && !this.visited[newRow][newCol]) {
          this.visited[newRow][newCol] = true;
          this.parent[newRow][newCol] = [row, col];
          pq.enqueue([newRow, newCol], this.heuristic([newRow, newCol], end));
        }
      }
    }
    
    const path = this.reconstructPath(end);
    return { steps: this.steps, path };
  }

  reconstructPath(end) {
    const path = [];
    let current = end;
    
    while (current !== null) {
      path.unshift(current);
      current = this.parent[current[0]][current[1]];
    }
    
    return path;
  }
}
