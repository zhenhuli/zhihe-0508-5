import './style.css'

const LEVEL_DATA = [
  {"size":11,"seed":12345},
  {"size":11,"seed":23456},
  {"size":11,"seed":34567},
  {"size":13,"seed":45678},
  {"size":13,"seed":56789},
  {"size":13,"seed":67890},
  {"size":15,"seed":78901},
  {"size":15,"seed":89012},
  {"size":15,"seed":90123},
  {"size":17,"seed":10111},
  {"size":17,"seed":11121},
  {"size":17,"seed":12131},
  {"size":19,"seed":13141},
  {"size":19,"seed":14151},
  {"size":19,"seed":15161},
  {"size":21,"seed":16171},
  {"size":21,"seed":17181},
  {"size":21,"seed":18191},
  {"size":23,"seed":19202},
  {"size":23,"seed":20212},
  {"size":23,"seed":21222},
  {"size":25,"seed":22232},
  {"size":25,"seed":23242},
  {"size":25,"seed":24252},
  {"size":27,"seed":25262},
  {"size":27,"seed":26272},
  {"size":29,"seed":27282},
  {"size":29,"seed":28292},
  {"size":31,"seed":29303},
  {"size":31,"seed":30313}
]

class SeededRandom {
  constructor(seed) {
    this.seed = seed
  }
  
  next() {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff
    return this.seed / 0x7fffffff
  }
}

class MazeGenerator {
  constructor() {
    this.currentLevel = 1
    this.completedLevels = JSON.parse(localStorage.getItem('mazeProgress') || '{}')
    this.rows = 21
    this.cols = 21
    this.speed = 50
    this.grid = []
    this.stack = []
    this.playerPos = { row: 1, col: 1 }
    this.isGenerating = false
    this.isSolving = false
    this.startPos = { row: 1, col: 1 }
    this.endPos = { row: 0, col: 0 }
    this.isGameMode = true
    
    this.init()
  }

  init() {
    this.renderUI()
    this.bindEvents()
    if (this.isGameMode) {
      this.loadLevel(this.currentLevel)
    } else {
      this.generateMaze()
    }
  }

  renderUI() {
    document.querySelector('#app').innerHTML = `
      <div class="top-bar">
        <button class="btn-mode ${this.isGameMode ? 'active' : ''}" id="gameModeBtn">🎯 闯关模式</button>
        <button class="btn-mode ${!this.isGameMode ? 'active' : ''}" id="randomModeBtn">🎲 随机模式</button>
      </div>

      <div class="level-select-bar" id="levelSelectBar" style="display: ${this.isGameMode ? 'flex' : 'none'}">
        <span class="level-label">选择关卡:</span>
        <select id="levelSelect" class="level-select">
          ${Array.from({length: 30}, (_, i) => 
            `<option value="${i + 1}">第 ${i + 1} 关 ${this.completedLevels[i + 1] ? '✓' : ''}</option>`
          ).join('')}
        </select>
        <div class="level-stars" id="levelStars">
          ${this.renderStars(1)}
        </div>
      </div>

      <h1>${this.isGameMode ? '🏆 迷宫大冒险' : '🎮 随机迷宫'}</h1>
      
      <div class="controls" id="randomControls" style="display: ${this.isGameMode ? 'none' : 'grid'}">
        <div class="control-group">
          <label>迷宫大小: <span id="sizeValue">21</span></label>
          <input type="range" id="sizeSlider" min="11" max="41" step="2" value="21">
        </div>
        <div class="control-group">
          <label>生成速度: <span id="speedValue">50</span>ms</label>
          <input type="range" id="speedSlider" min="10" max="200" step="10" value="50">
        </div>
      </div>

      <div class="buttons">
        <button class="btn-generate" id="generateBtn">${this.isGameMode ? '🔄 重新开始' : '🔄 生成迷宫'}</button>
        <button class="btn-path" id="solveBtn">🗺️ 提示路径</button>
        <button class="btn-reset" id="resetBtn">📍 重置位置</button>
      </div>

      <div class="maze-container">
        <div id="maze"></div>
      </div>

      <div class="virtual-controls">
        <div></div>
        <button class="virtual-btn" data-dir="up">↑</button>
        <div></div>
        <button class="virtual-btn" data-dir="left">←</button>
        <button class="virtual-btn" data-dir="reset">⟳</button>
        <button class="virtual-btn" data-dir="right">→</button>
        <div></div>
        <button class="virtual-btn" data-dir="down">↓</button>
        <div></div>
      </div>

      <div class="status" id="status">准备就绪</div>

      <div class="instructions">
        <strong>操作说明:</strong>
        电脑：使用 <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> 或 <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> 控制移动
        <br>手机/平板：点击下方虚拟方向按键控制移动，中间红色按钮可重置位置
        <br>从 <span style="color:#69db7c;font-weight:bold;">绿色起点</span> 走到 <span style="color:#ff8787;font-weight:bold;">红色终点</span>
        <br>${this.isGameMode ? '<strong>🎯 完成30个关卡即可通关！</strong>' : '<strong>🎲 自由调节迷宫大小和生成速度！</strong>'}
      </div>
    `
    document.getElementById('levelSelect').value = this.currentLevel
  }

  renderStars(level) {
    const completed = this.completedLevels[level]
    if (completed) {
      return '<span class="star">★</span><span class="star">★</span><span class="star">★</span>'
    }
    return '<span class="star empty">☆</span><span class="star empty">☆</span><span class="star empty">☆</span>'
  }

  bindEvents() {
    document.getElementById('gameModeBtn').addEventListener('click', () => {
      if (!this.isGenerating && !this.isSolving && !this.isGameMode) {
        this.isGameMode = true
        this.renderUI()
        this.bindEvents()
        this.loadLevel(this.currentLevel)
      }
    })

    document.getElementById('randomModeBtn').addEventListener('click', () => {
      if (!this.isGenerating && !this.isSolving && this.isGameMode) {
        this.isGameMode = false
        this.renderUI()
        this.bindEvents()
        this.generateMaze()
      }
    })

    document.getElementById('levelSelect').addEventListener('change', (e) => {
      if (!this.isGenerating && !this.isSolving && this.isGameMode) {
        this.currentLevel = parseInt(e.target.value)
        this.loadLevel(this.currentLevel)
      }
    })

    const sizeSlider = document.getElementById('sizeSlider')
    if (sizeSlider) {
      sizeSlider.addEventListener('input', (e) => {
        this.rows = parseInt(e.target.value)
        this.cols = parseInt(e.target.value)
        document.getElementById('sizeValue').textContent = this.rows
      })
    }

    const speedSlider = document.getElementById('speedSlider')
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        this.speed = parseInt(e.target.value)
        document.getElementById('speedValue').textContent = this.speed
      })
    }

    document.getElementById('generateBtn').addEventListener('click', () => {
      if (!this.isGenerating && !this.isSolving) {
        if (this.isGameMode) {
          this.loadLevel(this.currentLevel)
        } else {
          this.generateMaze()
        }
      }
    })

    document.getElementById('solveBtn').addEventListener('click', () => {
      if (!this.isGenerating && !this.isSolving) {
        this.solveMaze()
      }
    })

    document.getElementById('resetBtn').addEventListener('click', () => {
      if (!this.isGenerating && !this.isSolving) {
        this.resetPlayer()
      }
    })

    document.addEventListener('keydown', (e) => {
      if (!this.isGenerating && !this.isSolving) {
        this.handleKeyPress(e)
      }
    })

    document.querySelectorAll('.virtual-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!this.isGenerating && !this.isSolving) {
          const dir = btn.dataset.dir
          if (dir === 'reset') {
            this.resetPlayer()
          } else {
            this.handleVirtualMove(dir)
          }
        }
      })
    })
  }

  loadLevel(level) {
    const levelData = LEVEL_DATA[level - 1]
    this.rows = levelData.size
    this.cols = levelData.size
    this.currentLevel = level
    
    document.getElementById('levelStars').innerHTML = this.renderStars(level)
    document.getElementById('levelSelect').value = level
    
    this.generateSeededMaze(levelData.seed)
  }

  initGrid() {
    this.grid = []
    for (let row = 0; row < this.rows; row++) {
      this.grid[row] = []
      for (let col = 0; col < this.cols; col++) {
        this.grid[row][col] = {
          isWall: true,
          visited: false,
          isPath: false
        }
      }
    }
  }

  renderMaze() {
    const mazeElement = document.getElementById('maze')
    mazeElement.style.gridTemplateColumns = `repeat(${this.cols}, 20px)`
    mazeElement.innerHTML = ''

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = document.createElement('div')
        cell.className = 'cell'
        cell.dataset.row = row
        cell.dataset.col = col

        if (this.grid[row][col].isWall) {
          cell.classList.add('wall')
        }
        if (this.grid[row][col].visited) {
          cell.classList.add('visited')
        }
        if (this.grid[row][col].isPath) {
          cell.classList.add('path')
        }

        mazeElement.appendChild(cell)
      }
    }

    this.updatePlayerPosition()
    this.markStartEnd()
  }

  markStartEnd() {
    const startCell = document.querySelector(`[data-row="1"][data-col="1"]`)
    if (startCell) startCell.classList.add('start')

    const endRow = this.rows - 2
    const endCol = this.cols - 2
    this.endPos = { row: endRow, col: endCol }
    const endCell = document.querySelector(`[data-row="${endRow}"][data-col="${endCol}"]`)
    if (endCell) endCell.classList.add('end')
  }

  updatePlayerPosition() {
    document.querySelectorAll('.cell.player').forEach(cell => {
      cell.classList.remove('player')
    })

    const playerCell = document.querySelector(
      `[data-row="${this.playerPos.row}"][data-col="${this.playerPos.col}"]`
    )
    if (playerCell) {
      playerCell.classList.add('player')
    }
  }

  getUnvisitedNeighbors(row, col, rng) {
    const neighbors = []
    const directions = [
      { dr: -2, dc: 0 },
      { dr: 2, dc: 0 },
      { dr: 0, dc: -2 },
      { dr: 0, dc: 2 }
    ]

    for (const dir of directions) {
      const newRow = row + dir.dr
      const newCol = col + dir.dc

      if (
        newRow > 0 && newRow < this.rows - 1 &&
        newCol > 0 && newCol < this.cols - 1 &&
        !this.grid[newRow][newCol].visited
      ) {
        neighbors.push({ row: newRow, col: newCol, wallRow: row + dir.dr / 2, wallCol: col + dir.dc / 2 })
      }
    }

    return neighbors
  }

  shuffleArray(array, rng) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(rng.next() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  async generateSeededMaze(seed) {
    this.isGenerating = true
    this.updateStatus(`正在生成第 ${this.currentLevel} 关...`)
    this.disableButtons(true)

    const rng = new SeededRandom(seed)

    this.initGrid()
    this.renderMaze()

    const startRow = 1
    const startCol = 1
    this.grid[startRow][startCol].isWall = false
    this.grid[startRow][startCol].visited = true
    this.stack = [{ row: startRow, col: startCol }]

    while (this.stack.length > 0) {
      const current = this.stack[this.stack.length - 1]
      const neighbors = this.getUnvisitedNeighbors(current.row, current.col, rng)

      if (neighbors.length > 0) {
        const shuffledNeighbors = this.shuffleArray([...neighbors], rng)
        const next = shuffledNeighbors[0]
        
        this.grid[next.row][next.col].isWall = false
        this.grid[next.row][next.col].visited = true
        this.grid[next.wallRow][next.wallCol].isWall = false

        this.stack.push({ row: next.row, col: next.col })
      } else {
        this.stack.pop()
      }
    }

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.grid[row][col].visited = false
      }
    }

    this.renderMaze()
    this.playerPos = { row: 1, col: 1 }
    this.updatePlayerPosition()
    this.markStartEnd()
    
    this.isGenerating = false
    this.updateStatus(`第 ${this.currentLevel} 关！开始挑战吧！`)
    this.disableButtons(false)
  }

  async generateMaze() {
    this.isGenerating = true
    this.updateStatus('正在生成迷宫...')
    this.disableButtons(true)

    this.initGrid()
    this.renderMaze()

    const startRow = 1
    const startCol = 1
    this.grid[startRow][startCol].isWall = false
    this.grid[startRow][startCol].visited = true
    this.stack = [{ row: startRow, col: startCol }]

    while (this.stack.length > 0) {
      const current = this.stack[this.stack.length - 1]
      const neighbors = this.getUnvisitedNeighbors(current.row, current.col)

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)]
        
        this.grid[next.row][next.col].isWall = false
        this.grid[next.row][next.col].visited = true
        this.grid[next.wallRow][next.wallCol].isWall = false

        document.querySelectorAll('.cell.current').forEach(c => c.classList.remove('current'))
        const currentCell = document.querySelector(`[data-row="${next.row}"][data-col="${next.col}"]`)
        if (currentCell) {
          currentCell.classList.remove('wall')
          currentCell.classList.add('current')
        }
        const wallCell = document.querySelector(`[data-row="${next.wallRow}"][data-col="${next.wallCol}"]`)
        if (wallCell) wallCell.classList.remove('wall')

        this.stack.push({ row: next.row, col: next.col })
        
        await this.delay(this.speed)
      } else {
        this.stack.pop()
      }
    }

    document.querySelectorAll('.cell.current').forEach(c => c.classList.remove('current'))
    this.playerPos = { row: 1, col: 1 }
    this.updatePlayerPosition()
    this.markStartEnd()
    
    this.isGenerating = false
    this.updateStatus('迷宫生成完成！开始探索吧！')
    this.disableButtons(false)
  }

  async solveMaze() {
    this.isSolving = true
    this.updateStatus('正在寻找路径...')
    this.disableButtons(true)

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.grid[row][col].isPath = false
        this.grid[row][col].visited = false
      }
    }

    document.querySelectorAll('.cell.path').forEach(c => c.classList.remove('path'))
    document.querySelectorAll('.cell.visited').forEach(c => c.classList.remove('visited'))

    const queue = [{ row: 1, col: 1, path: [{ row: 1, col: 1 }] }]
    this.grid[1][1].visited = true

    const directions = [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 }
    ]

    let found = false
    let finalPath = []

    while (queue.length > 0 && !found) {
      const current = queue.shift()

      const currentCell = document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`)
      if (currentCell) currentCell.classList.add('visited')

      if (current.row === this.endPos.row && current.col === this.endPos.col) {
        found = true
        finalPath = current.path
        break
      }

      for (const dir of directions) {
        const newRow = current.row + dir.dr
        const newCol = current.col + dir.dc

        if (
          newRow >= 0 && newRow < this.rows &&
          newCol >= 0 && newCol < this.cols &&
          !this.grid[newRow][newCol].isWall &&
          !this.grid[newRow][newCol].visited
        ) {
          this.grid[newRow][newCol].visited = true
          queue.push({
            row: newRow,
            col: newCol,
            path: [...current.path, { row: newRow, col: newCol }]
          })
        }
      }

      await this.delay(this.speed / 2)
    }

    if (found) {
      this.updateStatus('找到路径！正在演示...')
      
      for (const pos of finalPath) {
        this.grid[pos.row][pos.col].isPath = true
        const cell = document.querySelector(`[data-row="${pos.row}"][data-col="${pos.col}"]`)
        if (cell) cell.classList.add('path')
        await this.delay(this.speed / 2)
      }

      this.updateStatus('路径演示完成！')
    } else {
      this.updateStatus('未找到路径！')
    }

    this.isSolving = false
    this.disableButtons(false)
  }

  movePlayer(dr, dc) {
    const newRow = this.playerPos.row + dr
    const newCol = this.playerPos.col + dc

    if (
      newRow >= 0 && newRow < this.rows &&
      newCol >= 0 && newCol < this.cols &&
      !this.grid[newRow][newCol].isWall
    ) {
      this.playerPos.row = newRow
      this.playerPos.col = newCol
      this.updatePlayerPosition()

      if (newRow === this.endPos.row && newCol === this.endPos.col) {
        this.levelComplete()
      } else {
        this.updateStatus('继续探索...')
      }
    }
  }

  handleVirtualMove(dir) {
    const dirMap = {
      'up': { dr: -1, dc: 0 },
      'down': { dr: 1, dc: 0 },
      'left': { dr: 0, dc: -1 },
      'right': { dr: 0, dc: 1 }
    }
    const d = dirMap[dir]
    if (d) {
      this.movePlayer(d.dr, d.dc)
    }
  }

  handleKeyPress(e) {
    const keyMap = {
      'ArrowUp': { dr: -1, dc: 0 },
      'ArrowDown': { dr: 1, dc: 0 },
      'ArrowLeft': { dr: 0, dc: -1 },
      'ArrowRight': { dr: 0, dc: 1 },
      'w': { dr: -1, dc: 0 },
      'W': { dr: -1, dc: 0 },
      's': { dr: 1, dc: 0 },
      'S': { dr: 1, dc: 0 },
      'a': { dr: 0, dc: -1 },
      'A': { dr: 0, dc: -1 },
      'd': { dr: 0, dc: 1 },
      'D': { dr: 0, dc: 1 }
    }

    if (keyMap[e.key]) {
      e.preventDefault()
      const dir = keyMap[e.key]
      this.movePlayer(dir.dr, dir.dc)
    }
  }

  levelComplete() {
    if (this.isGameMode) {
      this.completedLevels[this.currentLevel] = true
      localStorage.setItem('mazeProgress', JSON.stringify(this.completedLevels))
      document.getElementById('levelStars').innerHTML = this.renderStars(this.currentLevel)
      
      const levelSelect = document.getElementById('levelSelect')
      levelSelect.options[this.currentLevel - 1].text = `第 ${this.currentLevel} 关 ✓`
      
      if (this.currentLevel < 30) {
        this.updateStatus(`🎉 恭喜通过第 ${this.currentLevel} 关！正在进入下一关...`)
        setTimeout(() => {
          this.currentLevel++
          levelSelect.value = this.currentLevel
          this.loadLevel(this.currentLevel)
        }, 1500)
      } else {
        this.updateStatus('🏆 恭喜！你已通关所有30个关卡！你是迷宫大师！')
      }
    } else {
      this.updateStatus('🎉 恭喜！你成功走出了迷宫！')
    }
  }

  resetPlayer() {
    this.playerPos = { row: 1, col: 1 }
    this.updatePlayerPosition()
    
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.grid[row][col].isPath = false
        this.grid[row][col].visited = false
      }
    }
    
    document.querySelectorAll('.cell.path').forEach(c => c.classList.remove('path'))
    document.querySelectorAll('.cell.visited').forEach(c => c.classList.remove('visited'))
    this.markStartEnd()
    
    this.updateStatus('已重置位置，重新开始！')
  }

  updateStatus(message) {
    document.getElementById('status').textContent = message
  }

  disableButtons(disabled) {
    document.getElementById('generateBtn').disabled = disabled
    document.getElementById('solveBtn').disabled = disabled
    document.getElementById('resetBtn').disabled = disabled
    document.getElementById('gameModeBtn').disabled = disabled
    document.getElementById('randomModeBtn').disabled = disabled
    const levelSelect = document.getElementById('levelSelect')
    if (levelSelect) levelSelect.disabled = disabled
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

new MazeGenerator()
