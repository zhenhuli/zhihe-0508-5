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
