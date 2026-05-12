import { MazeGenerator, CELL_TYPES } from './maze-generator.js';
import { PathFinder } from './path-finder.js';

const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');

const CELL_SIZE = 20;
let maze = [];
let rows = 21;
let cols = 21;
let isDrawing = false;
let isRunning = false;
let isPaused = false;
let animationId = null;
let currentStep = 0;
let steps = [];
let path = [];

const COLORS = {
  [CELL_TYPES.WALL]: '#343a40',
  [CELL_TYPES.PATH]: '#f8f9fa',
  [CELL_TYPES.START]: '#28a745',
  [CELL_TYPES.END]: '#dc3545',
  [CELL_TYPES.VISITED]: '#17a2b8',
  [CELL_TYPES.PATH_FOUND]: '#ffc107'
};

function initCanvas() {
  canvas.width = cols * CELL_SIZE;
  canvas.height = rows * CELL_SIZE;
}

function drawCell(row, col, type) {
  ctx.fillStyle = COLORS[type] || COLORS[CELL_TYPES.PATH];
  ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawMaze() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      drawCell(i, j, maze[i][j]);
    }
  }
}

function generateMaze() {
  rows = parseInt(document.getElementById('rows').value);
  cols = parseInt(document.getElementById('cols').value);
  
  if (rows % 2 === 0) rows++;
  if (cols % 2 === 0) cols++;
  
  initCanvas();
  
  const generator = new MazeGenerator(rows, cols);
  maze = generator.generate();
  
  drawMaze();
  updateStatus('迷宫已生成，点击"开始求解"');
  resetState();
}

function emptyMaze() {
  rows = parseInt(document.getElementById('rows').value);
  cols = parseInt(document.getElementById('cols').value);
  
  if (rows % 2 === 0) rows++;
  if (cols % 2 === 0) cols++;
  
  initCanvas();
  
  const generator = new MazeGenerator(rows, cols);
  maze = generator.createEmptyMaze();
  
  drawMaze();
  updateStatus('迷宫已清空，可以手动绘制');
  resetState();
}

function resetState() {
  isRunning = false;
  isPaused = false;
  currentStep = 0;
  steps = [];
  path = [];
  
  if (animationId) {
    clearTimeout(animationId);
    animationId = null;
  }
  
  document.getElementById('startBtn').disabled = false;
  document.getElementById('pauseBtn').disabled = true;
  document.getElementById('pauseBtn').textContent = '暂停';
}

function updateStatus(message) {
  statusEl.textContent = message;
}

function getCellFromEvent(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const col = Math.floor(x / CELL_SIZE);
  const row = Math.floor(y / CELL_SIZE);
  return { row, col };
}

function getDrawMode() {
  const radios = document.querySelectorAll('input[name="drawMode"]');
  for (const radio of radios) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return 'path';
}

function handleDraw(e) {
  const { row, col } = getCellFromEvent(e);
  
  if (row < 0 || row >= rows || col < 0 || col >= cols) return;
  
  const drawMode = getDrawMode();
  let cellType;
  
  switch (drawMode) {
    case 'wall':
      cellType = CELL_TYPES.WALL;
      break;
    case 'path':
      cellType = CELL_TYPES.PATH;
      break;
    case 'start':
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (maze[i][j] === CELL_TYPES.START) {
            maze[i][j] = CELL_TYPES.PATH;
            drawCell(i, j, CELL_TYPES.PATH);
          }
        }
      }
      cellType = CELL_TYPES.START;
      break;
    case 'end':
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (maze[i][j] === CELL_TYPES.END) {
            maze[i][j] = CELL_TYPES.PATH;
            drawCell(i, j, CELL_TYPES.PATH);
          }
        }
      }
      cellType = CELL_TYPES.END;
      break;
    default:
      cellType = CELL_TYPES.PATH;
  }
  
  maze[row][col] = cellType;
  drawCell(row, col, cellType);
}

function getAlgorithm() {
  const radios = document.querySelectorAll('input[name="algorithm"]');
  for (const radio of radios) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return 'dfs';
}

function startSolving() {
  if (isRunning && !isPaused) return;
  
  if (!isPaused) {
    const algorithm = getAlgorithm();
    const finder = new PathFinder(maze);
    
    let result;
    const algorithmNames = {
      'dfs': 'DFS (深度优先)',
      'bfs': 'BFS (广度优先)',
      'dijkstra': 'Dijkstra 算法',
      'astar': 'A* 算法',
      'bidirectional': '双向 BFS',
      'bestfirst': 'Best-First Search'
    };
    
    switch (algorithm) {
      case 'dfs':
        result = finder.dfs();
        break;
      case 'bfs':
        result = finder.bfs();
        break;
      case 'dijkstra':
        result = finder.dijkstra();
        break;
      case 'astar':
        result = finder.aStar();
        break;
      case 'bidirectional':
        result = finder.bidirectionalBFS();
        break;
      case 'bestfirst':
        result = finder.bestFirstSearch();
        break;
      default:
        result = finder.bfs();
    }
    
    updateStatus(`使用 ${algorithmNames[algorithm] || algorithm} 求解中...`);
    
    steps = result.steps;
    path = result.path;
    currentStep = 0;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (maze[i][j] === CELL_TYPES.VISITED || maze[i][j] === CELL_TYPES.PATH_FOUND) {
          maze[i][j] = CELL_TYPES.PATH;
        }
      }
    }
    drawMaze();
  }
  
  isRunning = true;
  isPaused = false;
  document.getElementById('startBtn').disabled = true;
  document.getElementById('pauseBtn').disabled = false;
  document.getElementById('pauseBtn').textContent = '暂停';
  
  animateSteps();
}

function animateSteps() {
  if (!isRunning || isPaused) return;
  
  const speed = parseInt(document.getElementById('speed').value);
  
  if (currentStep < steps.length) {
    const { row, col } = steps[currentStep];
    maze[row][col] = CELL_TYPES.VISITED;
    drawCell(row, col, CELL_TYPES.VISITED);
    currentStep++;
    animationId = setTimeout(animateSteps, speed);
  } else if (path.length > 0) {
    for (const [row, col] of path) {
      if (maze[row][col] !== CELL_TYPES.START && maze[row][col] !== CELL_TYPES.END) {
        maze[row][col] = CELL_TYPES.PATH_FOUND;
        drawCell(row, col, CELL_TYPES.PATH_FOUND);
      }
    }
    isRunning = false;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    updateStatus(`求解完成！路径长度: ${path.length}`);
  } else {
    isRunning = false;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    updateStatus('无法找到路径！');
  }
}

function pauseSolving() {
  if (!isRunning) return;
  
  if (isPaused) {
    isPaused = false;
    document.getElementById('pauseBtn').textContent = '暂停';
    animateSteps();
  } else {
    isPaused = true;
    document.getElementById('pauseBtn').textContent = '继续';
    if (animationId) {
      clearTimeout(animationId);
    }
  }
}

function resetMaze() {
  resetState();
  drawMaze();
  updateStatus('已重置，点击"开始求解"');
}

canvas.addEventListener('mousedown', (e) => {
  if (isRunning) return;
  isDrawing = true;
  handleDraw(e);
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing || isRunning) return;
  handleDraw(e);
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

canvas.addEventListener('mouseleave', () => {
  isDrawing = false;
});

document.getElementById('generateBtn').addEventListener('click', generateMaze);
document.getElementById('emptyBtn').addEventListener('click', emptyMaze);
document.getElementById('startBtn').addEventListener('click', startSolving);
document.getElementById('pauseBtn').addEventListener('click', pauseSolving);
document.getElementById('resetBtn').addEventListener('click', resetMaze);

generateMaze();
