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
