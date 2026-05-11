export class Shuffler {
  shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  shuffleTiles(tiles, gridSize) {
    let shuffled = this.shuffleArray(tiles)
    let attempts = 0
    
    while (!this.isSolvable(shuffled, gridSize) && attempts < 100) {
      shuffled = this.shuffleArray(tiles)
      attempts++
    }
    
    if (attempts >= 100) {
      return this.makeSolvable(shuffled, gridSize)
    }
    
    return shuffled
  }

  isSolvable(tiles, gridSize) {
    let inversions = 0
    const totalTiles = tiles.length
    
    for (let i = 0; i < totalTiles - 1; i++) {
      for (let j = i + 1; j < totalTiles; j++) {
        if (tiles[i].originalIndex > tiles[j].originalIndex) {
          inversions++
        }
      }
    }
    
    if (gridSize % 2 === 1) {
      return inversions % 2 === 0
    } else {
      const emptyRow = Math.floor(tiles.findIndex(t => t.isBlank) / gridSize)
      const emptyRowFromBottom = gridSize - emptyRow
      return (emptyRowFromBottom % 2 === 1) === (inversions % 2 === 0)
    }
  }

  makeSolvable(tiles, gridSize) {
    const isEven = this.isSolvable(tiles, gridSize)
    if (!isEven) {
      ;[tiles[0], tiles[1]] = [tiles[1], tiles[0]]
    }
    return tiles
  }

  isSame(tiles1, tiles2) {
    if (tiles1.length !== tiles2.length) return false
    return tiles1.every((tile, index) => tile.id === tiles2[index].id)
  }
}
