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
