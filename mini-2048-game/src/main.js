import {
  createEmptyGrid,
  addRandomTile,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  checkWin,
  checkGameOver,
  copyGrid
} from './gameLogic.js';

import {
  initGrid,
  renderTiles,
  updateScore,
  updateBestScore,
  showWinMessage,
  showGameOverMessage,
  hideMessage
} from './renderer.js';

import './style.css';

class Game {
  constructor() {
    this.grid = createEmptyGrid();
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
    this.hasWon = false;
    this.keepPlaying = false;
    
    this.initElements();
    this.initEventListeners();
    this.startNewGame();
  }
  
  initElements() {
    this.gridContainer = document.getElementById('grid-container');
    this.tileContainer = document.getElementById('tile-container');
    this.scoreElement = document.getElementById('score');
    this.bestScoreElement = document.getElementById('best-score');
    this.restartBtn = document.getElementById('restart-btn');
    this.gameMessage = document.getElementById('game-message');
    this.messageText = document.getElementById('message-text');
    this.messageBtn = document.getElementById('message-btn');
  }
  
  initEventListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    this.restartBtn.addEventListener('click', () => this.startNewGame());
    this.messageBtn.addEventListener('click', () => this.handleMessageBtnClick());
  }
  
  startNewGame() {
    this.grid = createEmptyGrid();
    this.score = 0;
    this.hasWon = false;
    this.keepPlaying = false;
    
    addRandomTile(this.grid);
    addRandomTile(this.grid);
    
    initGrid(this.gridContainer);
    this.render();
    hideMessage(this.gameMessage);
  }
  
  handleKeyDown(e) {
    const keyMap = {
      ArrowUp: moveUp,
      ArrowDown: moveDown,
      ArrowLeft: moveLeft,
      ArrowRight: moveRight
    };
    
    const moveFunction = keyMap[e.key];
    if (!moveFunction) return;
    
    e.preventDefault();
    
    if (this.hasWon && !this.keepPlaying) return;
    
    const { moved, score } = moveFunction(this.grid);
    
    if (moved) {
      this.score += score;
      addRandomTile(this.grid);
      this.render();
      this.checkGameState();
    }
  }
  
  handleMessageBtnClick() {
    if (this.hasWon && !this.keepPlaying) {
      this.keepPlaying = true;
      hideMessage(this.gameMessage);
    } else {
      this.startNewGame();
    }
  }
  
  checkGameState() {
    if (!this.hasWon && checkWin(this.grid)) {
      this.hasWon = true;
      showWinMessage(this.gameMessage, this.messageText, this.messageBtn);
    } else if (checkGameOver(this.grid)) {
      showGameOverMessage(this.gameMessage, this.messageText, this.messageBtn);
    }
  }
  
  render() {
    renderTiles(this.grid, this.tileContainer);
    updateScore(this.scoreElement, this.score);
    
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('bestScore', this.bestScore);
    }
    updateBestScore(this.bestScoreElement, this.bestScore);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Game();
});
