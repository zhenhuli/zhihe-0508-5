export class ImageSplitter {
  constructor(containerSize = 400) {
    this.containerSize = containerSize
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  async loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = e.target.result
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  createTiles(image, gridSize) {
    const tileSize = this.containerSize / gridSize
    const tiles = []
    
    this.canvas.width = this.containerSize
    this.canvas.height = this.containerSize
    
    const imgSize = Math.min(image.width, image.height)
    const sx = (image.width - imgSize) / 2
    const sy = (image.height - imgSize) / 2
    
    this.ctx.drawImage(image, sx, sy, imgSize, imgSize, 0, 0, this.containerSize, this.containerSize)
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const originalIndex = row * gridSize + col
        
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = tileSize
        tempCanvas.height = tileSize
        const tempCtx = tempCanvas.getContext('2d')
        
        tempCtx.drawImage(
          this.canvas,
          col * tileSize, row * tileSize, tileSize, tileSize,
          0, 0, tileSize, tileSize
        )
        
        tiles.push({
          id: originalIndex,
          originalIndex: originalIndex,
          row: row,
          col: col,
          imageData: tempCanvas.toDataURL(),
          backgroundPosition: `-${col * tileSize}px -${row * tileSize}px`
        })
      }
    }
    
    return tiles
  }

  getCanvasImageData() {
    return this.canvas.toDataURL()
  }
}
