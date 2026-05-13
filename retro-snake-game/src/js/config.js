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
