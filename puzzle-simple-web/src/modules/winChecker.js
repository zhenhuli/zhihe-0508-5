export class WinChecker {
  checkWin(tiles) {
    return tiles.every((tile, index) => tile.originalIndex === index)
  }

  getCorrectCount(tiles) {
    return tiles.filter((tile, index) => tile.originalIndex === index).length
  }

  getProgress(tiles) {
    const correct = this.getCorrectCount(tiles)
    return (correct / tiles.length) * 100
  }
}
