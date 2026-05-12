<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const canvasRef = ref(null)
const previewCanvasRef = ref(null)
const fileInputRef = ref(null)

const originalImage = ref(null)
const imageLoaded = ref(false)
const originalFileName = ref('cropped-image')

const rotation = ref(0)
const flipH = ref(false)
const flipV = ref(false)

const borderWidth = ref(0)
const borderColor = ref('#000000')

const cropMode = ref('free')
const aspectRatios = [
  { label: '自由裁剪', value: 'free' },
  { label: '1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '16:9', value: '16:9' },
  { label: '3:2', value: '3:2' }
]

let ctx
let previewCtx

let cropStart = { x: 0, y: 0 }
let cropEnd = { x: 0, y: 0 }
let isDragging = ref(false)
let isResizing = ref(false)
let resizeHandle = ref('')

const canvasWidth = 800
const canvasHeight = 600

let imageOffsetX = 0
let imageOffsetY = 0
let imageDrawWidth = 0
let imageDrawHeight = 0

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  previewCtx = previewCanvasRef.value.getContext('2d')
  drawPlaceholder()
})

const drawPlaceholder = () => {
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  ctx.strokeStyle = '#ccc'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40)
  ctx.setLineDash([])
  ctx.fillStyle = '#999'
  ctx.font = '20px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('点击或拖拽图片到此处', canvasWidth / 2, canvasHeight / 2)
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) {
    loadImage(file)
  }
}

const loadImage = (file) => {
  const reader = new FileReader()
  originalFileName.value = file.name.replace(/\.[^/.]+$/, '')
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      originalImage.value = img
      imageLoaded.value = true
      rotation.value = 0
      flipH.value = false
      flipV.value = false
      borderWidth.value = 0
      
      const scale = Math.min(
        (canvasWidth - 40) / img.width,
        (canvasHeight - 40) / img.height
      )
      const drawWidth = img.width * scale
      const drawHeight = img.height * scale
      const offsetX = (canvasWidth - drawWidth) / 2
      const offsetY = (canvasHeight - drawHeight) / 2
      
      cropStart = {
        x: offsetX + drawWidth * 0.1,
        y: offsetY + drawHeight * 0.1
      }
      cropEnd = {
        x: offsetX + drawWidth * 0.9,
        y: offsetY + drawHeight * 0.9
      }
      
      nextTick(() => {
        drawImage()
      })
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

const drawImage = () => {
  if (!originalImage.value) return
  
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  const img = originalImage.value
  
  const scale = Math.min(
    (canvasWidth - 40) / img.width,
    (canvasHeight - 40) / img.height
  )
  
  imageDrawWidth = img.width * scale
  imageDrawHeight = img.height * scale
  imageOffsetX = (canvasWidth - imageDrawWidth) / 2
  imageOffsetY = (canvasHeight - imageDrawHeight) / 2

  ctx.save()
  ctx.translate(imageOffsetX + imageDrawWidth / 2, imageOffsetY + imageDrawHeight / 2)
  ctx.rotate((rotation.value * Math.PI) / 180)
  ctx.scale(flipH.value ? -1 : 1, flipV.value ? -1 : 1)
  ctx.drawImage(
    img,
    -imageDrawWidth / 2,
    -imageDrawHeight / 2,
    imageDrawWidth,
    imageDrawHeight
  )
  ctx.restore()

  if (borderWidth.value > 0) {
    ctx.strokeStyle = borderColor.value
    ctx.lineWidth = borderWidth.value
    ctx.strokeRect(
      imageOffsetX + borderWidth.value / 2,
      imageOffsetY + borderWidth.value / 2,
      imageDrawWidth - borderWidth.value,
      imageDrawHeight - borderWidth.value
    )
  }

  drawCropBox()
  updatePreview()
}

const initCropBox = () => {
  cropStart = {
    x: imageOffsetX + imageDrawWidth * 0.1,
    y: imageOffsetY + imageDrawHeight * 0.1
  }
  cropEnd = {
    x: imageOffsetX + imageDrawWidth * 0.9,
    y: imageOffsetY + imageDrawHeight * 0.9
  }
}

const drawCropBox = () => {
  const x = Math.min(cropStart.x, cropEnd.x)
  const y = Math.min(cropStart.y, cropEnd.y)
  const w = Math.abs(cropEnd.x - cropStart.x)
  const h = Math.abs(cropEnd.y - cropStart.y)

  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.fillRect(imageOffsetX, imageOffsetY, imageDrawWidth, y - imageOffsetY)
  ctx.fillRect(imageOffsetX, y, x - imageOffsetX, h)
  ctx.fillRect(x + w, y, imageOffsetX + imageDrawWidth - x - w, h)
  ctx.fillRect(imageOffsetX, y + h, imageDrawWidth, imageOffsetY + imageDrawHeight - y - h)

  ctx.strokeStyle = '#4CAF50'
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, w, h)

  const handleSize = 8
  ctx.fillStyle = '#4CAF50'
  ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize)
  ctx.fillRect(x + w - handleSize / 2, y - handleSize / 2, handleSize, handleSize)
  ctx.fillRect(x - handleSize / 2, y + h - handleSize / 2, handleSize, handleSize)
  ctx.fillRect(x + w - handleSize / 2, y + h - handleSize / 2, handleSize, handleSize)
  ctx.fillRect(x + w / 2 - handleSize / 2, y - handleSize / 2, handleSize, handleSize)
  ctx.fillRect(x + w / 2 - handleSize / 2, y + h - handleSize / 2, handleSize, handleSize)
  ctx.fillRect(x - handleSize / 2, y + h / 2 - handleSize / 2, handleSize, handleSize)
  ctx.fillRect(x + w - handleSize / 2, y + h / 2 - handleSize / 2, handleSize, handleSize)
}

const getMousePos = (e) => {
  const rect = canvasRef.value.getBoundingClientRect()
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

const getCropBox = () => {
  const minSize = 10
  let x = Math.min(cropStart.x, cropEnd.x)
  let y = Math.min(cropStart.y, cropEnd.y)
  let w = Math.abs(cropEnd.x - cropStart.x)
  let h = Math.abs(cropEnd.y - cropStart.y)
  
  if (w < minSize) {
    w = minSize
    x = (cropStart.x + cropEnd.x) / 2 - minSize / 2
  }
  
  if (h < minSize) {
    h = minSize
    y = (cropStart.y + cropEnd.y) / 2 - minSize / 2
  }
  
  return { x, y, w, h }
}

const checkResizeHandle = (pos) => {
  const box = getCropBox()
  const handleSize = 10

  if (Math.abs(pos.x - box.x) < handleSize && Math.abs(pos.y - box.y) < handleSize) return 'tl'
  if (Math.abs(pos.x - (box.x + box.w)) < handleSize && Math.abs(pos.y - box.y) < handleSize) return 'tr'
  if (Math.abs(pos.x - box.x) < handleSize && Math.abs(pos.y - (box.y + box.h)) < handleSize) return 'bl'
  if (Math.abs(pos.x - (box.x + box.w)) < handleSize && Math.abs(pos.y - (box.y + box.h)) < handleSize) return 'br'
  if (Math.abs(pos.y - box.y) < handleSize && pos.x > box.x && pos.x < box.x + box.w) return 't'
  if (Math.abs(pos.y - (box.y + box.h)) < handleSize && pos.x > box.x && pos.x < box.x + box.w) return 'b'
  if (Math.abs(pos.x - box.x) < handleSize && pos.y > box.y && pos.y < box.y + box.h) return 'l'
  if (Math.abs(pos.x - (box.x + box.w)) < handleSize && pos.y > box.y && pos.y < box.y + box.h) return 'r'
  return ''
}

const isInCropBox = (pos) => {
  const box = getCropBox()
  return pos.x >= box.x && pos.x <= box.x + box.w && pos.y >= box.y && pos.y <= box.y + box.h
}

const onMouseDown = (e) => {
  if (!imageLoaded.value) return
  const pos = getMousePos(e)
  const handle = checkResizeHandle(pos)
  
  if (handle) {
    isResizing.value = true
    resizeHandle.value = handle
  } else if (isInCropBox(pos)) {
    isDragging.value = true
  }
}

const onMouseMove = (e) => {
  if (!imageLoaded.value) return
  const pos = getMousePos(e)
  
  if (!isResizing.value && !isDragging.value) {
    const handle = checkResizeHandle(pos)
    canvasRef.value.style.cursor = handle ? 'nwse-resize' : (isInCropBox(pos) ? 'move' : 'default')
    return
  }

  const box = getCropBox()
  const dx = pos.x - (box.x + box.w / 2)
  const dy = pos.y - (box.y + box.h / 2)

  if (isDragging.value) {
    const moveX = e.movementX
    const moveY = e.movementY
    
    const newX1 = cropStart.x + moveX
    const newY1 = cropStart.y + moveY
    const newX2 = cropEnd.x + moveX
    const newY2 = cropEnd.y + moveY

    if (newX1 >= imageOffsetX && newX2 <= imageOffsetX + imageDrawWidth) {
      cropStart.x = newX1
      cropEnd.x = newX2
    }
    if (newY1 >= imageOffsetY && newY2 <= imageOffsetY + imageDrawHeight) {
      cropStart.y = newY1
      cropEnd.y = newY2
    }
  } else if (isResizing.value) {
    const clampedX = Math.max(imageOffsetX, Math.min(pos.x, imageOffsetX + imageDrawWidth))
    const clampedY = Math.max(imageOffsetY, Math.min(pos.y, imageOffsetY + imageDrawHeight))

    switch (resizeHandle.value) {
      case 'tl':
        cropStart.x = clampedX
        cropStart.y = clampedY
        break
      case 'tr':
        cropEnd.x = clampedX
        cropStart.y = clampedY
        break
      case 'bl':
        cropStart.x = clampedX
        cropEnd.y = clampedY
        break
      case 'br':
        cropEnd.x = clampedX
        cropEnd.y = clampedY
        break
      case 't':
        cropStart.y = clampedY
        break
      case 'b':
        cropEnd.y = clampedY
        break
      case 'l':
        cropStart.x = clampedX
        break
      case 'r':
        cropEnd.x = clampedX
        break
    }

    if (cropMode.value !== 'free') {
      const [w, h] = cropMode.value.split(':').map(Number)
      const ratio = w / h
      const currentW = Math.abs(cropEnd.x - cropStart.x)
      const currentH = Math.abs(cropEnd.y - cropStart.y)
      
      if (currentW / currentH > ratio) {
        const newH = currentW / ratio
        if (resizeHandle.value.includes('t')) {
          cropStart.y = cropEnd.y - newH
        } else {
          cropEnd.y = cropStart.y + newH
        }
      } else {
        const newW = currentH * ratio
        if (resizeHandle.value.includes('l')) {
          cropStart.x = cropEnd.x - newW
        } else {
          cropEnd.x = cropStart.x + newW
        }
      }
    }
  }

  drawImage()
}

const onMouseUp = () => {
  isDragging.value = false
  isResizing.value = false
  resizeHandle.value = ''
}

const rotateLeft = () => {
  rotation.value = (rotation.value - 90) % 360
  drawImage()
}

const rotateRight = () => {
  rotation.value = (rotation.value + 90) % 360
  drawImage()
}

const toggleFlipH = () => {
  flipH.value = !flipH.value
  drawImage()
}

const toggleFlipV = () => {
  flipV.value = !flipV.value
  drawImage()
}

watch(cropMode, () => {
  if (cropMode.value !== 'free') {
    const [w, h] = cropMode.value.split(':').map(Number)
    const ratio = w / h
    const box = getCropBox()
    const centerX = box.x + box.w / 2
    const centerY = box.y + box.h / 2
    
    if (box.w / box.h > ratio) {
      const newH = box.w / ratio
      cropStart.y = centerY - newH / 2
      cropEnd.y = centerY + newH / 2
    } else {
      const newW = box.h * ratio
      cropStart.x = centerX - newW / 2
      cropEnd.x = centerX + newW / 2
    }
  }
  drawImage()
})

watch(borderWidth, drawImage)
watch(borderColor, drawImage)

const updatePreview = () => {
  if (!imageLoaded.value || !previewCanvasRef.value) return
  
  const box = getCropBox()
  
  if (box.w <= 0 || box.h <= 0) return
  
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = box.w
  tempCanvas.height = box.h
  const tempCtx = tempCanvas.getContext('2d')
  
  tempCtx.drawImage(
    canvasRef.value,
    box.x,
    box.y,
    box.w,
    box.h,
    0,
    0,
    box.w,
    box.h
  )
  
  const scale = Math.min(200 / box.w, 200 / box.h)
  const previewWidth = box.w * scale
  const previewHeight = box.h * scale
  
  previewCanvasRef.value.width = previewWidth
  previewCanvasRef.value.height = previewHeight
  
  const newPreviewCtx = previewCanvasRef.value.getContext('2d')
  newPreviewCtx.drawImage(
    tempCanvas,
    0,
    0,
    previewWidth,
    previewHeight
  )
}

const exportImage = () => {
  if (!imageLoaded.value) return
  
  const box = getCropBox()
  
  if (box.w <= 0 || box.h <= 0) return
  
  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = box.w
  exportCanvas.height = box.h
  const exportCtx = exportCanvas.getContext('2d')
  
  exportCtx.drawImage(
    canvasRef.value,
    box.x,
    box.y,
    box.w,
    box.h,
    0,
    0,
    box.w,
    box.h
  )
  
  const timestamp = new Date().toISOString().slice(0, 10)
  const fileName = `${originalFileName.value}_edited_${timestamp}.png`
  
  exportCanvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 'image/png')
}

const triggerFileInput = () => {
  fileInputRef.value.click()
}

const onDrop = (e) => {
  e.preventDefault()
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    loadImage(file)
  }
}

const onDragOver = (e) => {
  e.preventDefault()
}
</script>

<template>
  <div class="editor-container">
    <div class="toolbar">
      <h1>图片裁剪旋转工具</h1>
      <div class="tool-group">
        <button @click="triggerFileInput" class="btn btn-primary">
          上传图片
        </button>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          style="display: none"
          @change="handleFileSelect"
        />
      </div>
    </div>

    <div class="main-content">
      <div class="canvas-section">
        <canvas
          ref="canvasRef"
          :width="canvasWidth"
          :height="canvasHeight"
          class="main-canvas"
          @click="!imageLoaded && triggerFileInput()"
          @mousedown="onMouseDown"
          @mousemove="onMouseMove"
          @mouseup="onMouseUp"
          @mouseleave="onMouseUp"
          @drop="onDrop"
          @dragover="onDragOver"
        ></canvas>
      </div>

      <div class="controls-panel">
        <div class="control-section">
          <h3>裁剪比例</h3>
          <div class="ratio-buttons">
            <button
              v-for="ratio in aspectRatios"
              :key="ratio.value"
              :class="['btn', 'btn-small', cropMode === ratio.value && 'active']"
              @click="cropMode = ratio.value"
            >
              {{ ratio.label }}
            </button>
          </div>
        </div>

        <div class="control-section">
          <h3>旋转翻转</h3>
          <div class="rotate-buttons">
            <button class="btn btn-icon" @click="rotateLeft" title="向左旋转">
              ↶
            </button>
            <button class="btn btn-icon" @click="rotateRight" title="向右旋转">
              ↷
            </button>
            <button
              :class="['btn', 'btn-icon', flipH && 'active']"
              @click="toggleFlipH"
              title="水平翻转"
            >
              ⇆
            </button>
            <button
              :class="['btn', 'btn-icon', flipV && 'active']"
              @click="toggleFlipV"
              title="垂直翻转"
            >
              ⇅
            </button>
          </div>
        </div>

        <div class="control-section">
          <h3>边框设置</h3>
          <div class="border-controls">
            <div class="control-row">
              <label>边框宽度:</label>
              <input
                type="range"
                v-model.number="borderWidth"
                min="0"
                max="20"
                step="1"
              />
              <span>{{ borderWidth }}px</span>
            </div>
            <div class="control-row">
              <label>边框颜色:</label>
              <input type="color" v-model="borderColor" />
            </div>
          </div>
        </div>

        <div class="control-section">
          <h3>预览</h3>
          <div class="preview-container">
            <canvas ref="previewCanvasRef" class="preview-canvas"></canvas>
          </div>
        </div>

        <div class="control-section">
          <button
            :class="['btn', 'btn-full', imageLoaded ? 'btn-success' : 'btn-disabled']"
            :disabled="!imageLoaded"
            @click="exportImage">
            {{ imageLoaded ? '📥 下载图片' : '请先上传图片' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.toolbar h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.main-content {
  display: flex;
  gap: 20px;
}

.canvas-section {
  flex: 1;
}

.main-canvas {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.controls-panel {
  width: 280px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.control-section {
  margin-bottom: 25px;
}

.control-section h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  background: #f0f0f0;
  color: #333;
}

.btn:hover {
  background: #e0e0e0;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd6;
}

.btn-success {
  background: #4CAF50;
  color: white;
}

.btn-success:hover {
  background: #45a049;
}

.btn-disabled {
  background: #ccc;
  color: #999;
  cursor: not-allowed;
}

.btn-small {
  padding: 8px 12px;
  font-size: 12px;
}

.btn-icon {
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-full {
  width: 100%;
}

.btn.active {
  background: #667eea;
  color: white;
}

.ratio-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.rotate-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.border-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-row label {
  font-size: 14px;
  color: #666;
  min-width: 70px;
}

.control-row input[type="range"] {
  flex: 1;
}

.control-row input[type="color"] {
  width: 50px;
  height: 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.control-row span {
  min-width: 40px;
  font-size: 14px;
  color: #666;
}

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 150px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.preview-canvas {
  max-width: 100%;
  max-height: 150px;
}
</style>
