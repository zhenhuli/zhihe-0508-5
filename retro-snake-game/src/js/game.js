var Game = (function() {
  function Game() {
    this.snake = new Snake();
    this.food = new Food();
    this.renderer = new Renderer('gameCanvas');
    this.score = 0;
    this.speed = Storage.getDifficulty();
    this.gameLoop = null;
    this.isRunning = false;
    this.isPaused = false;
  }

  Game.prototype.init = function() {
    UI.init();
    this.setupEventListeners();
    this.loadSettings();
    this.reset();
    UI.showOverlay('按开始键', 'PRESS START TO PLAY', true);
    UI.updateStatus('准备就绪');
  };

  Game.prototype.loadSettings = function() {
    var savedSkin = Storage.getSkin();
    var savedDifficulty = Storage.getDifficulty();
    
    this.renderer.setSkin(savedSkin);
    this.speed = savedDifficulty;
    
    UI.setActiveSkin(savedSkin);
    UI.setActiveDifficulty(savedDifficulty);
    UI.updateHighScore(Storage.getHighScore());
  };

  Game.prototype.setupEventListeners = function() {
    var self = this;

    document.addEventListener('keydown', function(e) {
      self.handleKeyPress(e);
    });

    UI.onStartClick(function() {
      self.start();
    });

    UI.onDifficultyChange(function(speed) {
      self.setDifficulty(speed);
    });

    UI.onSkinChange(function(skin) {
      self.setSkin(skin);
    });
  };

  Game.prototype.handleKeyPress = function(e) {
    if (!this.isRunning) return;

    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault();
        this.snake.changeDirection(CONFIG.DIRECTIONS.UP);
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.snake.changeDirection(CONFIG.DIRECTIONS.DOWN);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.snake.changeDirection(CONFIG.DIRECTIONS.LEFT);
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.snake.changeDirection(CONFIG.DIRECTIONS.RIGHT);
        break;
      case ' ':
        e.preventDefault();
        this.togglePause();
        break;
    }
  };

  Game.prototype.start = function() {
    this.reset();
    this.isRunning = true;
    this.isPaused = false;
    UI.hideOverlay();
    UI.updateStatus('游戏进行中');
    this.startGameLoop();
  };

  Game.prototype.reset = function() {
    this.snake.reset();
    this.food.generate(this.snake.body);
    this.score = 0;
    UI.updateScore(0);
    this.renderer.render(this.snake, this.food);
  };

  Game.prototype.startGameLoop = function() {
    var self = this;
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }
    this.gameLoop = setInterval(function() {
      self.update();
    }, this.speed);
  };

  Game.prototype.update = function() {
    if (this.isPaused) return;

    this.snake.move();

    if (this.snake.checkCollision()) {
      this.gameOver();
      return;
    }

    if (this.snake.checkFoodCollision(this.food)) {
      this.snake.grow();
      this.score += 10;
      UI.updateScore(this.score);
      this.food.generate(this.snake.body);

      if (Storage.setHighScore(this.score)) {
        UI.updateHighScore(this.score);
      }
    }

    this.renderer.render(this.snake, this.food);
  };

  Game.prototype.togglePause = function() {
    this.isPaused = !this.isPaused;
    UI.updateStatus(this.isPaused ? '已暂停 - 按空格继续' : '游戏进行中');
  };

  Game.prototype.gameOver = function() {
    this.isRunning = false;
    clearInterval(this.gameLoop);
    
    var isNewHigh = Storage.setHighScore(this.score);
    var title = isNewHigh ? '新纪录！' : '游戏结束';
    var message = '得分: ' + this.score + ' | 按开始重新游戏';
    
    UI.showOverlay(title, message, true);
    UI.updateStatus('游戏结束');
  };

  Game.prototype.setDifficulty = function(speed) {
    this.speed = speed;
    Storage.setDifficulty(speed);
    UI.setActiveDifficulty(speed);
    
    if (this.isRunning && !this.isPaused) {
      this.startGameLoop();
    }
  };

  Game.prototype.setSkin = function(skin) {
    this.renderer.setSkin(skin);
    Storage.setSkin(skin);
    UI.setActiveSkin(skin);
    this.renderer.render(this.snake, this.food);
  };

  return Game;
})();
