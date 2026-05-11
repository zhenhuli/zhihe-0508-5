export class DragHandler {
  constructor() {
    this.selectedTile = null
    this.selectedIndex = null
    this.swapCallback = null
    this.container = null
    this.dragClone = null
    this.offsetX = 0
    this.offsetY = 0
    this.tileRect = null
    this.isDragging = false
  }

  init(container, swapCallback) {
    this.container = container
    this.swapCallback = swapCallback
    
    container.addEventListener('mousedown', this.handleMouseDown.bind(this))
    container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false })
    
    document.addEventListener('mousemove', this.handleMouseMove.bind(this))
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false })
    
    document.addEventListener('mouseup', this.handleMouseUp.bind(this))
    document.addEventListener('touchend', this.handleTouchEnd.bind(this))
  }

  handleMouseDown(e) {
    const tile = this.getTile(e.target)
    if (tile) {
      e.preventDefault()
      this.startDrag(tile, e.clientX, e.clientY)
    }
  }

  handleTouchStart(e) {
    const tile = this.getTile(e.target)
    if (tile && e.touches.length === 1) {
      e.preventDefault()
      const touch = e.touches[0]
      this.startDrag(tile, touch.clientX, touch.clientY)
    }
  }

  handleMouseMove(e) {
    if (this.isDragging) {
      e.preventDefault()
      this.updateDragPosition(e.clientX, e.clientY)
    }
  }

  handleTouchMove(e) {
    if (this.isDragging && e.touches.length === 1) {
      e.preventDefault()
      const touch = e.touches[0]
      this.updateDragPosition(touch.clientX, touch.clientY)
    }
  }

  handleMouseUp(e) {
    if (this.isDragging) {
      this.endDrag(e.clientX, e.clientY)
    }
  }

  handleTouchEnd(e) {
    if (this.isDragging) {
      const touch = e.changedTouches[0]
      this.endDrag(touch.clientX, touch.clientY)
    }
  }

  startDrag(tile, clientX, clientY) {
    this.selectedTile = tile
    this.selectedIndex = this.getTileIndex(tile)
    this.isDragging = true
    
    this.tileRect = tile.getBoundingClientRect()
    this.offsetX = clientX - this.tileRect.left
    this.offsetY = clientY - this.tileRect.top
    
    this.createDragClone(tile, clientX, clientY)
    
    tile.classList.add('dragging')
    tile.style.opacity = '0.3'
  }

  createDragClone(tile, clientX, clientY) {
    this.dragClone = tile.cloneNode(true)
    
    const rect = tile.getBoundingClientRect()
    
    this.dragClone.style.position = 'fixed'
    this.dragClone.style.left = `${clientX - this.offsetX}px`
    this.dragClone.style.top = `${clientY - this.offsetY}px`
    this.dragClone.style.width = `${rect.width}px`
    this.dragClone.style.height = `${rect.height}px`
    this.dragClone.style.zIndex = '9999'
    this.dragClone.style.pointerEvents = 'none'
    this.dragClone.style.opacity = '0.9'
    this.dragClone.style.transform = 'scale(1.05)'
    this.dragClone.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)'
    this.dragClone.style.borderRadius = '4px'
    
    document.body.appendChild(this.dragClone)
  }

  updateDragPosition(clientX, clientY) {
    if (!this.dragClone) return
    
    this.dragClone.style.left = `${clientX - this.offsetX}px`
    this.dragClone.style.top = `${clientY - this.offsetY}px`
    
    this.highlightAdjacentTiles(clientX, clientY)
  }

  highlightAdjacentTiles(clientX, clientY) {
    const allTiles = this.container.querySelectorAll('.tile')
    
    allTiles.forEach((tile, index) => {
      if (tile === this.selectedTile) {
        tile.classList.remove('drop-target')
        return
      }
      
      if (this.isAdjacent(this.selectedIndex, index)) {
        const rect = tile.getBoundingClientRect()
        const isOver = clientX >= rect.left && clientX <= rect.right &&
                       clientY >= rect.top && clientY <= rect.bottom
        
        if (isOver) {
          tile.classList.add('drop-target')
        } else {
          tile.classList.remove('drop-target')
        }
      } else {
        tile.classList.remove('drop-target')
      }
    })
  }

  endDrag(clientX, clientY) {
    this.clearDropTargets()
    
    const targetTile = this.getTileAtPosition(clientX, clientY)
    
    if (targetTile && targetTile !== this.selectedTile) {
      this.trySwap(targetTile)
    }
    
    this.cleanupDrag()
  }

  getTileAtPosition(clientX, clientY) {
    const elements = document.elementsFromPoint(clientX, clientY)
    for (const element of elements) {
      const tile = this.getTile(element)
      if (tile && tile !== this.dragClone) {
        return tile
      }
    }
    return null
  }

  clearDropTargets() {
    const allTiles = this.container.querySelectorAll('.tile')
    allTiles.forEach(tile => {
      tile.classList.remove('drop-target')
    })
  }

  cleanupDrag() {
    if (this.dragClone) {
      this.dragClone.remove()
      this.dragClone = null
    }
    
    if (this.selectedTile) {
      this.selectedTile.classList.remove('dragging')
      this.selectedTile.style.opacity = ''
    }
    
    this.selectedTile = null
    this.selectedIndex = null
    this.isDragging = false
    this.tileRect = null
  }

  getTile(element) {
    if (!element) return null
    if (element.classList.contains('tile')) return element
    return element.closest('.tile')
  }

  getTileIndex(tile) {
    const tiles = Array.from(this.container.querySelectorAll('.tile'))
    return tiles.indexOf(tile)
  }

  trySwap(targetTile) {
    const targetIndex = this.getTileIndex(targetTile)
    
    if (this.isAdjacent(this.selectedIndex, targetIndex)) {
      if (this.swapCallback) {
        this.swapCallback(this.selectedIndex, targetIndex)
      }
    }
  }

  isAdjacent(index1, index2) {
    const tiles = this.container.querySelectorAll('.tile')
    const gridSize = Math.sqrt(tiles.length)
    
    const row1 = Math.floor(index1 / gridSize)
    const col1 = index1 % gridSize
    const row2 = Math.floor(index2 / gridSize)
    const col2 = index2 % gridSize
    
    const rowDiff = Math.abs(row1 - row2)
    const colDiff = Math.abs(col1 - col2)
    
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
  }

  destroy() {
    if (this.container) {
      this.container.removeEventListener('mousedown', this.handleMouseDown.bind(this))
      this.container.removeEventListener('touchstart', this.handleTouchStart.bind(this))
    }
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this))
    document.removeEventListener('touchmove', this.handleTouchMove.bind(this))
    document.removeEventListener('mouseup', this.handleMouseUp.bind(this))
    document.removeEventListener('touchend', this.handleTouchEnd.bind(this))
  }
}
