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
