import './style.css'
import { ImageSplitter } from './modules/imageSplitter.js'
import { Shuffler } from './modules/shuffler.js'
import { DragHandler } from './modules/dragHandler.js'
import { WinChecker } from './modules/winChecker.js'
import { GameState } from './modules/gameState.js'
import { UIRenderer } from './modules/uiRenderer.js'
import { presetImages, PresetImageLoader } from './modules/presetImages.js'

class PuzzleGame {
  constructor() {
    this.imageSplitter = new ImageSplitter(400)
    this.shuffler = new Shuffler()
    this.dragHandler = new DragHandler()
    this.winChecker = new WinChecker()
    this.gameState = new GameState()
    this.uiRenderer = new UIRenderer()
    this.presetLoader = new PresetImageLoader()
    
    this.currentImage = null
    this.currentImageUrl = null
    
    this.initElements()
    this.initEvents()
    this.initStateCallbacks()
    this.initPresetImages()
  }

  initElements() {
    this.elements = {
      imageUpload: document.getElementById('imageUpload'),
      difficultySelect: document.getElementById('difficultySelect'),
      startBtn: document.getElementById('startBtn'),
      resetBtn: document.getElementById('resetBtn'),
      playAgainBtn: document.getElementById('playAgainBtn'),
      puzzleGrid: document.getElementById('puzzleGrid'),
      presetGrid: document.getElementById('presetGrid')
    }
  }

  initEvents() {
    this.elements.imageUpload.addEventListener('change', (e) => this.handleImageUpload(e))
    this.elements.startBtn.addEventListener('click', () => this.startGame())
    this.elements.resetBtn.addEventListener('click', () => this.resetGame())
    this.elements.playAgainBtn.addEventListener('click', () => this.handlePlayAgain())
    
    this.dragHandler.init(this.elements.puzzleGrid, (index1, index2) => {
      this.handleTileSwap(index1, index2)
    })
  }

  initPresetImages() {
    presetImages.forEach(preset => {
      const presetElement = document.createElement('div')
      presetElement.className = 'preset-item'
      presetElement.dataset.url = preset.url
      presetElement.title = preset.name
      
      const img = document.createElement('img')
      img.src = preset.url
      img.alt = preset.name
      
      const label = document.createElement('span')
      label.textContent = preset.name
      
      presetElement.appendChild(img)
      presetElement.appendChild(label)
      
      presetElement.addEventListener('click', () => {
        this.handlePresetSelect(preset)
      })
      
      this.elements.presetGrid.appendChild(presetElement)
    })
  }

  async handlePresetSelect(preset) {
    try {
      this.gameState.reset()
      this.uiRenderer.clearGrid()
      
      this.currentImage = await this.presetLoader.loadImage(preset.url)
      
      const gridSize = parseInt(this.elements.difficultySelect.value)
      const tiles = this.imageSplitter.createTiles(this.currentImage, gridSize)
      
      this.currentImageUrl = this.imageSplitter.getCanvasImageData()
      this.uiRenderer.updatePreview(this.currentImageUrl)
      
      this.uiRenderer.clearGrid()
      this.uiRenderer.renderGrid(tiles, gridSize, this.currentImageUrl)
      
    } catch (error) {
      console.error('预设图片加载失败:', error)
      alert('图片加载失败，请重试或选择其他图片')
    }
  }

  initStateCallbacks() {
    this.gameState.onStateChange = (state) => {
      this.uiRenderer.updateStats(state.moves, state.formattedTime, state.gridSize)
      this.uiRenderer.updateTileCorrectness(state.tiles)
    }
    
    this.gameState.onWin = (result) => {
      this.handleWin(result)
    }
  }

  async handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    
    try {
      this.currentImage = await this.imageSplitter.loadImage(file)
      
      const gridSize = parseInt(this.elements.difficultySelect.value)
      const tiles = this.imageSplitter.createTiles(this.currentImage, gridSize)
      
      this.currentImageUrl = this.imageSplitter.getCanvasImageData()
      this.uiRenderer.updatePreview(this.currentImageUrl)
      
      this.uiRenderer.clearGrid()
      this.uiRenderer.renderGrid(tiles, gridSize, this.currentImageUrl)
      
    } catch (error) {
      console.error('图片加载失败:', error)
      alert('图片加载失败，请选择其他图片')
    }
  }

  startGame() {
    if (!this.currentImage) {
      alert('请先上传一张图片！')
      return
    }
    
    const gridSize = parseInt(this.elements.difficultySelect.value)
    const tiles = this.imageSplitter.createTiles(this.currentImage, gridSize)
    const shuffledTiles = this.shuffler.shuffleTiles(tiles, gridSize)
    
    this.gameState.init(gridSize, shuffledTiles)
    
    this.uiRenderer.renderGrid(shuffledTiles, gridSize, this.currentImageUrl)
  }

  handleTileSwap(index1, index2) {
    if (!this.gameState.isPlaying) return
    
    this.gameState.swapTiles(index1, index2)
    
    const tiles = this.gameState.getTiles()
    const gridSize = this.gameState.getGridSize()
    
    this.uiRenderer.renderGrid(tiles, gridSize, this.currentImageUrl)
    
    if (this.winChecker.checkWin(tiles)) {
      this.gameState.win()
    }
  }

  handleWin(result) {
    this.uiRenderer.showWinModal(result.time, result.moves, result.gridSize)
  }

  resetGame() {
    this.gameState.reset()
    this.uiRenderer.clearGrid()
    
    if (this.currentImage) {
      const gridSize = parseInt(this.elements.difficultySelect.value)
      const tiles = this.imageSplitter.createTiles(this.currentImage, gridSize)
      this.uiRenderer.renderGrid(tiles, gridSize, this.currentImageUrl)
    }
  }

  handlePlayAgain() {
    this.uiRenderer.hideWinModal()
    this.startGame()
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PuzzleGame()
})
