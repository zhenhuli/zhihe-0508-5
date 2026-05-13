var CONFIG = {
  GRID_SIZE: 20,
  CANVAS_SIZE: 400,
  SPEEDS: {
    easy: 150,
    normal: 100,
    hard: 70,
    expert: 50
  },
  SKINS: {
    classic: { snake: '#00ff00', food: '#ff0000' },
    neon: { snake: '#00ffff', food: '#ff00ff' },
    gold: { snake: '#ffd700', food: '#ff6347' },
    retro: { snake: '#8b4513', food: '#dc143c' },
    candy: { snake: '#ff69b4', food: '#9370db' }
  },
  DIRECTIONS: {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
  }
};

var Storage = (function() {
  var HIGH_SCORE_KEY = 'snake_high_score';
  var SKIN_KEY = 'snake_skin';
  var DIFFICULTY_KEY = 'snake_difficulty';

  return {
    getHighScore: function() {
      var score = localStorage.getItem(HIGH_SCORE_KEY);
      return score ? parseInt(score, 10) : 0;
    },

    setHighScore: function(score) {
      var currentHigh = this.getHighScore();
      if (score > currentHigh) {
        localStorage.setItem(HIGH_SCORE_KEY, score.toString());
        return true;
      }
      return false;
    },

    getSkin: function() {
      return localStorage.getItem(SKIN_KEY) || 'classic';
    },

    setSkin: function(skin) {
      localStorage.setItem(SKIN_KEY, skin);
    },

    getDifficulty: function() {
      var difficulty = localStorage.getItem(DIFFICULTY_KEY);
      return difficulty ? parseInt(difficulty, 10) : 150;
    },

    setDifficulty: function(speed) {
      localStorage.setItem(DIFFICULTY_KEY, speed.toString());
    }
  };
})();

var Snake = (function() {
  function Snake() {
    this.reset();
  }

  Snake.prototype.reset = function() {
    this.body = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    this.direction = CONFIG.DIRECTIONS.RIGHT;
    this.nextDirection = CONFIG.DIRECTIONS.RIGHT;
    this.growing = false;
  };

  Snake.prototype.move = function() {
    this.direction = this.nextDirection;
    var head = this.body[0];
    var newHead = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y
    };
    this.body.unshift(newHead);

    if (!this.growing) {
      this.body.pop();
    } else {
      this.growing = false;
    }
  };

  Snake.prototype.grow = function() {
    this.growing = true;
  };

  Snake.prototype.changeDirection = function(newDirection) {
    var opposites = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT'
    };

    var currentDirName = null;
    for (var name in CONFIG.DIRECTIONS) {
      if (CONFIG.DIRECTIONS[name] === this.direction) {
        currentDirName = name;
        break;
      }
    }

    var newDirName = null;
    for (var name in CONFIG.DIRECTIONS) {
      if (CONFIG.DIRECTIONS[name] === newDirection) {
        newDirName = name;
        break;
      }
    }

    if (opposites[currentDirName] !== newDirName) {
      this.nextDirection = newDirection;
    }
  };

  Snake.prototype.checkCollision = function() {
    var head = this.body[0];

    if (head.x < 0 || head.x >= CONFIG.CANVAS_SIZE / CONFIG.GRID_SIZE ||
        head.y < 0 || head.y >= CONFIG.CANVAS_SIZE / CONFIG.GRID_SIZE) {
      return true;
    }

    for (var i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        return true;
      }
    }

    return false;
  };

  Snake.prototype.checkFoodCollision = function(food) {
    var head = this.body[0];
    return head.x === food.x && head.y === food.y;
  };

  return Snake;
})();

var Food = (function() {
  function Food() {
    this.position = { x: 0, y: 0 };
  }

  Food.prototype.generate = function(snakeBody) {
    var gridCount = CONFIG.CANVAS_SIZE / CONFIG.GRID_SIZE;
    var valid = false;

    while (!valid) {
      this.position.x = Math.floor(Math.random() * gridCount);
      this.position.y = Math.floor(Math.random() * gridCount);

      valid = true;
      for (var i = 0; i < snakeBody.length; i++) {
        if (snakeBody[i].x === this.position.x && snakeBody[i].y === this.position.y) {
          valid = false;
          break;
        }
      }
    }
  };

  Object.defineProperty(Food.prototype, 'x', {
    get: function() { return this.position.x; }
  });

  Object.defineProperty(Food.prototype, 'y', {
    get: function() { return this.position.y; }
  });

  return Food;
})();

var Renderer = (function() {
  function Renderer(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.skin = 'classic';
  }

  Renderer.prototype.setSkin = function(skin) {
    this.skin = skin;
  };

  Renderer.prototype.clear = function() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, CONFIG.CANVAS_SIZE, CONFIG.CANVAS_SIZE);
  };

  Renderer.prototype.drawGrid = function() {
    this.ctx.strokeStyle = '#111111';
    this.ctx.lineWidth = 1;

    for (var i = 0; i <= CONFIG.CANVAS_SIZE; i += CONFIG.GRID_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, CONFIG.CANVAS_SIZE);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(CONFIG.CANVAS_SIZE, i);
      this.ctx.stroke();
    }
  };

  Renderer.prototype.drawSnake = function(snakeBody) {
    var colors = CONFIG.SKINS[this.skin];
    var size = CONFIG.GRID_SIZE;

    for (var i = 0; i < snakeBody.length; i++) {
      var segment = snakeBody[i];
      var x = segment.x * size;
      var y = segment.y * size;

      if (i === 0) {
        this.ctx.fillStyle = colors.snake;
        this.ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
        
        this.ctx.fillStyle = '#000';
        var eyeSize = 4;
        this.ctx.fillRect(x + 4, y + 4, eyeSize, eyeSize);
        this.ctx.fillRect(x + size - 8, y + 4, eyeSize, eyeSize);
      } else {
        var alpha = 1 - (i / snakeBody.length) * 0.5;
        this.ctx.fillStyle = this.adjustBrightness(colors.snake, 1 - i * 0.05);
        this.ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
      }
    }
  };

  Renderer.prototype.drawFood = function(food) {
    var colors = CONFIG.SKINS[this.skin];
    var size = CONFIG.GRID_SIZE;
    var x = food.x * size;
    var y = food.y * size;

    this.ctx.beginPath();
    this.ctx.arc(x + size / 2, y + size / 2, size / 2 - 2, 0, Math.PI * 2);
    this.ctx.fillStyle = colors.food;
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(x + size / 2 - 3, y + size / 2 - 3, 3, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.fill();
  };

  Renderer.prototype.adjustBrightness = function(hex, factor) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);

    r = Math.floor(r * factor);
    g = Math.floor(g * factor);
    b = Math.floor(b * factor);

    return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  };

  Renderer.prototype.render = function(snake, food) {
    this.clear();
    this.drawGrid();
    this.drawFood(food);
    this.drawSnake(snake.body);
  };

  return Renderer;
})();

var UI = (function() {
  var elements = {};

  function initElements() {
    elements.currentScore = document.getElementById('currentScore');
    elements.highScore = document.getElementById('highScore');
    elements.gameOverlay = document.getElementById('gameOverlay');
    elements.overlayTitle = document.getElementById('overlayTitle');
    elements.overlayMessage = document.getElementById('overlayMessage');
    elements.startBtn = document.getElementById('startBtn');
    elements.gameStatus = document.getElementById('gameStatus');
    elements.difficultyBtns = document.querySelectorAll('.difficulty-btn');
    elements.skinBtns = document.querySelectorAll('.skin-btn');
  }

  return {
    init: function() {
      initElements();
    },

    updateScore: function(score) {
      elements.currentScore.textContent = score;
    },

    updateHighScore: function(score) {
      elements.highScore.textContent = score;
    },

    showOverlay: function(title, message, showButton) {
      elements.overlayTitle.textContent = title;
      elements.overlayMessage.textContent = message;
      elements.startBtn.style.display = showButton ? 'inline-block' : 'none';
      elements.gameOverlay.style.display = 'flex';
    },

    hideOverlay: function() {
      elements.gameOverlay.style.display = 'none';
    },

    updateStatus: function(status) {
      elements.gameStatus.textContent = status;
    },

    setActiveDifficulty: function(speed) {
      elements.difficultyBtns.forEach(function(btn) {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.speed) === speed) {
          btn.classList.add('active');
        }
      });
    },

    setActiveSkin: function(skinName) {
      elements.skinBtns.forEach(function(btn) {
        btn.classList.remove('active');
        if (btn.dataset.skin === skinName) {
          btn.classList.add('active');
        }
      });
    },

    onStartClick: function(callback) {
      elements.startBtn.addEventListener('click', callback);
    },

    onDifficultyChange: function(callback) {
      elements.difficultyBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var speed = parseInt(this.dataset.speed);
          callback(speed);
        });
      });
    },

    onSkinChange: function(callback) {
      elements.skinBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var skin = this.dataset.skin;
          callback(skin);
        });
      });
    }
  };
})();

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

(function() {
  var game = new Game();
  game.init();
})();
