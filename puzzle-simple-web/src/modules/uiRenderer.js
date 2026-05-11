export class UIRenderer {
  constructor() {
    this.elements = {
      puzzleGrid: document.getElementById('puzzleGrid'),
      placeholder: document.getElementById('placeholder'),
      previewImage: document.getElementById('previewImage'),
      placeholderPreview: document.getElementById('placeholderPreview'),
      timer: document.getElementById('timer'),
      moves: document.getElementById('moves'),
      difficulty: document.getElementById('difficulty'),
      winModal: document.getElementById('winModal'),
      winTime: document.getElementById('winTime'),
      winMoves: document.getElementById('winMoves'),
      winDifficulty: document.getElementById('winDifficulty')
    }
  }

  renderGrid(tiles, gridSize, imageUrl) {
    const grid = this.elements.puzzleGrid
    grid.innerHTML = ''
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`
    grid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`
    
    tiles.forEach((tile, index) => {
      const tileElement = document.createElement('div')
      tileElement.className = 'tile'
      tileElement.dataset.index = index
      tileElement.dataset.originalIndex = tile.originalIndex
      tileElement.style.backgroundImage = `url(${imageUrl})`
      tileElement.style.backgroundPosition = tile.backgroundPosition
      
      if (tile.originalIndex === index) {
        tileElement.classList.add('correct')
      }
      
      grid.appendChild(tileElement)
    })
    
    this.elements.placeholder.classList.add('hidden')
  }

  clearGrid() {
    this.elements.puzzleGrid.innerHTML = ''
    this.elements.placeholder.classList.remove('hidden')
  }

  updateStats(moves, formattedTime, gridSize) {
    this.elements.timer.textContent = formattedTime
    this.elements.moves.textContent = moves.toString()
    this.elements.difficulty.textContent = `${gridSize}×${gridSize}`
  }

  updatePreview(imageUrl) {
    this.elements.previewImage.src = imageUrl
    this.elements.placeholderPreview.classList.add('hidden')
  }

  clearPreview() {
    this.elements.previewImage.src = ''
    this.elements.placeholderPreview.classList.remove('hidden')
  }

  showWinModal(time, moves, gridSize) {
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    
    this.elements.winTime.textContent = formatTime(time)
    this.elements.winMoves.textContent = moves.toString()
    this.elements.winDifficulty.textContent = `${gridSize}×${gridSize}`
    this.elements.winModal.classList.remove('hidden')
  }

  hideWinModal() {
    this.elements.winModal.classList.add('hidden')
  }

  updateTileCorrectness(tiles) {
    if (!tiles || tiles.length === 0) return
    
    const tileElements = this.elements.puzzleGrid.querySelectorAll('.tile')
    tileElements.forEach((element, index) => {
      if (tiles[index] && tiles[index].originalIndex === index) {
        element.classList.add('correct')
      } else {
        element.classList.remove('correct')
      }
    })
  }
}
