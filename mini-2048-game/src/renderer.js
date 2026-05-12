const GRID_SIZE = 4;
const TILE_COLORS = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e'
};

const TEXT_COLORS = {
  2: '#776e65',
  4: '#776e65',
  8: '#f9f6f2',
  16: '#f9f6f2',
  32: '#f9f6f2',
  64: '#f9f6f2',
  128: '#f9f6f2',
  256: '#f9f6f2',
  512: '#f9f6f2',
  1024: '#f9f6f2',
  2048: '#f9f6f2'
};

export function initGrid(gridContainer) {
  gridContainer.innerHTML = '';
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      gridContainer.appendChild(cell);
    }
  }
}

export function renderTiles(grid, tileContainer) {
  tileContainer.innerHTML = '';
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const value = grid[i][j];
      if (value !== 0) {
        const tile = createTile(value, i, j);
        tileContainer.appendChild(tile);
      }
    }
  }
}

function createTile(value, row, col) {
  const tile = document.createElement('div');
  tile.className = 'tile tile-new';
  tile.style.setProperty('--row', row);
  tile.style.setProperty('--col', col);
  tile.style.backgroundColor = TILE_COLORS[value] || '#3c3a32';
  tile.style.color = TEXT_COLORS[value] || '#f9f6f2';
  
  const inner = document.createElement('div');
  inner.className = 'tile-inner';
  inner.textContent = value;
  tile.appendChild(inner);
  
  return tile;
}

export function updateScore(scoreElement, score) {
  scoreElement.textContent = score;
  scoreElement.classList.add('score-pop');
  setTimeout(() => {
    scoreElement.classList.remove('score-pop');
  }, 200);
}

export function updateBestScore(bestScoreElement, bestScore) {
  bestScoreElement.textContent = bestScore;
}

export function showWinMessage(messageElement, messageTextElement, messageBtn) {
  messageTextElement.textContent = '恭喜你！赢得游戏！';
  messageBtn.textContent = '继续游戏';
  messageElement.classList.add('show', 'win');
}

export function showGameOverMessage(messageElement, messageTextElement, messageBtn) {
  messageTextElement.textContent = '游戏结束！再试一次？';
  messageBtn.textContent = '重新开始';
  messageElement.classList.add('show', 'lose');
}

export function hideMessage(messageElement) {
  messageElement.classList.remove('show', 'win', 'lose');
}
