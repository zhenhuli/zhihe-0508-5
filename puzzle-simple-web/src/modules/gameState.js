export class GameState {
  constructor() {
    this.tiles = []
    this.gridSize = 3
    this.moves = 0
    this.seconds = 0
    this.isPlaying = false
    this.timerInterval = null
    this.onStateChange = null
    this.onWin = null
  }

  init(gridSize, tiles) {
    this.gridSize = gridSize
    this.tiles = tiles
    this.moves = 0
    this.seconds = 0
    this.isPlaying = true
    this.startTimer()
    this.notifyStateChange()
  }

  reset() {
    this.stopTimer()
    this.tiles = []
    this.moves = 0
    this.seconds = 0
    this.isPlaying = false
    this.notifyStateChange()
  }

  swapTiles(index1, index2) {
    if (!this.isPlaying) return false
    
    ;[this.tiles[index1], this.tiles[index2]] = [this.tiles[index2], this.tiles[index1]]
    this.moves++
    this.notifyStateChange()
    
    return true
  }

  startTimer() {
    this.stopTimer()
    this.timerInterval = setInterval(() => {
      this.seconds++
      this.notifyStateChange()
    }, 1000)
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
  }

  win() {
    this.stopTimer()
    this.isPlaying = false
    if (this.onWin) {
      this.onWin({
        moves: this.moves,
        time: this.seconds,
        gridSize: this.gridSize
      })
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  getFormattedTime() {
    return this.formatTime(this.seconds)
  }

  getMoves() {
    return this.moves
  }

  getGridSize() {
    return this.gridSize
  }

  getTiles() {
    return [...this.tiles]
  }

  notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange({
        moves: this.moves,
        time: this.seconds,
        gridSize: this.gridSize,
        tiles: this.getTiles(),
        formattedTime: this.getFormattedTime()
      })
    }
  }
}
