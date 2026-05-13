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
