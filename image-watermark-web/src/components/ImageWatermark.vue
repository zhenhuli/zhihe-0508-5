<template>
  <div class="min-h-screen p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold text-white text-center mb-8 drop-shadow-lg">
        🎨 在线图片水印工具
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-xl p-6 space-y-6">
            <div>
              <h2 class="text-xl font-semibold text-gray-800 mb-4">📤 上传图片</h2>
              <div
                class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all"
                @click="triggerUpload"
                @dragover.prevent
                @drop.prevent="handleDrop"
              >
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  class="hidden"
                  @change="handleFileChange"
                />
                <div class="text-5xl mb-3">🖼️</div>
                <p class="text-gray-600">点击或拖拽上传图片</p>
                <p class="text-sm text-gray-400 mt-2">支持批量上传</p>
              </div>

              <div v-if="images.length > 0" class="mt-4">
                <p class="text-sm text-gray-600 mb-2">已选择 {{ images.length }} 张图片</p>
                <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  <div
                    v-for="(img, index) in images"
                    :key="index"
                    class="relative w-16 h-16 rounded-lg overflow-hidden border-2"
                    :class="selectedImages.includes(index) ? 'border-purple-500' : 'border-gray-200'"
                    @click="toggleImageSelection(index)"
                  >
                    <img :src="img.src" class="w-full h-full object-cover" />
                    <div v-if="selectedImages.includes(index)" class="absolute top-0 left-0 w-full h-full bg-purple-500 bg-opacity-30 flex items-center justify-center">
                      <span class="text-white text-xl">✓</span>
                    </div>
                    <button
                      class="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center z-10"
                      @click.stop="removeImage(index)"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div class="flex gap-2 mt-3">
                  <button
                    @click="selectAllImages"
                    class="flex-1 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-all"
                  >
                    全选
                  </button>
                  <button
                    @click="deselectAllImages"
                    class="flex-1 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-all"
                  >
                    取消全选
                  </button>
                </div>
              </div>
            </div>

            <div class="border-t pt-4">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">⚙️ 水印设置</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      v-model="watermarkType"
                      value="text"
                      class="w-4 h-4 text-purple-600"
                    />
                    <span class="text-gray-700 font-medium">文字水印</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer mt-2">
                    <input
                      type="radio"
                      v-model="watermarkType"
                      value="image"
                      class="w-4 h-4 text-purple-600"
                    />
                    <span class="text-gray-700 font-medium">图片水印</span>
                  </label>
                </div>

                <div v-if="watermarkType === 'text'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">水印文字</label>
                    <input
                      v-model="textWatermark.text"
                      type="text"
                      placeholder="请输入水印文字"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">字体大小: {{ textWatermark.fontSize }}px</label>
                    <input
                      v-model.number="textWatermark.fontSize"
                      type="range"
                      min="12"
                      max="120"
                      class="w-full"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">文字颜色</label>
                    <input
                      v-model="textWatermark.color"
                      type="color"
                      class="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div v-if="watermarkType === 'image'" class="space-y-4">
                  <div
                    class="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-purple-500 transition-all"
                    @click="triggerWatermarkUpload"
                  >
                    <input
                      ref="watermarkInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleWatermarkChange"
                    />
                    <div v-if="!imageWatermark.src" class="text-gray-600">
                      <div class="text-3xl mb-2">🖼️</div>
                      <p>点击上传水印图片</p>
                    </div>
                    <div v-else class="flex items-center justify-center gap-3">
                      <img :src="imageWatermark.src" class="w-12 h-12 object-contain rounded" />
                      <span class="text-sm text-gray-600">已选择水印图片</span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">水印大小: {{ imageWatermark.size }}%</label>
                    <input
                      v-model.number="imageWatermark.size"
                      type="range"
                      min="5"
                      max="100"
                      class="w-full"
                    />
                  </div>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">透明度: {{ opacity }}%</label>
                    <input
                      v-model.number="opacity"
                      type="range"
                      min="5"
                      max="100"
                      class="w-full"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">水印位置</label>
                    <div class="grid grid-cols-3 gap-2">
                      <button
                        v-for="pos in positions"
                        :key="pos.value"
                        class="py-2 px-3 rounded-lg text-sm font-medium transition-all"
                        :class="position === pos.value ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                        @click="position = pos.value"
                      >
                        {{ pos.label }}
                      </button>
                    </div>
                  </div>

                  <div v-if="watermarkType === 'text'">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="textWatermark.tiled"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 rounded"
                      />
                      <span class="text-sm text-gray-700">平铺水印</span>
                    </label>
                  </div>

                  <div v-if="watermarkType === 'text' && textWatermark.tiled" class="space-y-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">旋转角度: {{ textWatermark.rotation }}°</label>
                      <input
                        v-model.number="textWatermark.rotation"
                        type="range"
                        min="-90"
                        max="90"
                        class="w-full"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">水平间距: {{ textWatermark.gapX }}px</label>
                      <input
                        v-model.number="textWatermark.gapX"
                        type="range"
                        min="20"
                        max="200"
                        class="w-full"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">垂直间距: {{ textWatermark.gapY }}px</label>
                      <input
                        v-model.number="textWatermark.gapY"
                        type="range"
                        min="20"
                        max="200"
                        class="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-800">👁️ 实时预览</h2>
              <button
                @click="downloadSelected"
                :disabled="selectedImages.length === 0"
                class="px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2"
              >
                📦 批量下载 ({{ selectedImages.length }})
              </button>
            </div>
            
            <div class="bg-gray-100 rounded-xl p-4 min-h-96">
              <div v-if="images.length === 0" class="flex items-center justify-center h-80">
                <div class="text-center text-gray-500">
                  <div class="text-6xl mb-4">🖼️</div>
                  <p>请先上传图片</p>
                </div>
              </div>
              
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="(img, index) in images"
                  :key="index"
                  class="relative bg-white rounded-lg p-3 shadow-md"
                >
                  <div class="absolute top-5 left-5 z-10">
                    <label class="flex items-center gap-2 cursor-pointer bg-white bg-opacity-90 px-2 py-1 rounded shadow">
                      <input
                        type="checkbox"
                        :checked="selectedImages.includes(index)"
                        @change="toggleImageSelection(index)"
                        class="w-4 h-4 text-purple-600 rounded"
                      />
                      <span class="text-sm text-gray-700">选中</span>
                    </label>
                  </div>
                  
                  <canvas
                    :ref="el => setCanvasRef(el, index)"
                    class="w-full rounded-lg border border-gray-200"
                    style="max-height: 300px; object-fit: contain;"
                  ></canvas>
                  
                  <div class="mt-3 flex items-center justify-between">
                    <span class="text-sm text-gray-600 truncate max-w-[70%]">{{ img.name }}</span>
                    <button
                      @click="downloadSingle(index)"
                      class="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-all flex items-center gap-1"
                    >
                      📥 下载
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const fileInput = ref(null)
const watermarkInput = ref(null)
const canvasRefs = ref({})

const images = ref([])
const selectedImages = ref([])

const watermarkType = ref('text')
const opacity = ref(30)
const position = ref('bottomRight')

const textWatermark = ref({
  text: '水印文字',
  fontSize: 48,
  color: '#000000',
  tiled: false,
  rotation: -30,
  gapX: 100,
  gapY: 100
})

const imageWatermark = ref({
  src: '',
  size: 20
})

const positions = [
  { label: '左上角', value: 'topLeft' },
  { label: '顶部居中', value: 'topCenter' },
  { label: '右上角', value: 'topRight' },
  { label: '左中', value: 'centerLeft' },
  { label: '居中', value: 'center' },
  { label: '右中', value: 'centerRight' },
  { label: '左下角', value: 'bottomLeft' },
  { label: '底部居中', value: 'bottomCenter' },
  { label: '右下角', value: 'bottomRight' }
]

const setCanvasRef = (el, index) => {
  if (el) {
    canvasRefs.value[index] = el
    nextTick(() => renderSinglePreview(index))
  }
}

const triggerUpload = () => {
  fileInput.value.click()
}

const triggerWatermarkUpload = () => {
  watermarkInput.value.click()
}

const handleFileChange = (e) => {
  const files = Array.from(e.target.files)
  const imageFiles = files.filter(f => f.type.startsWith('image/'))
  let loadedCount = 0
  
  imageFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (event) => {
      images.value.push({
        src: event.target.result,
        name: file.name
      })
      selectedImages.value.push(images.value.length - 1)
      loadedCount++
      if (loadedCount === imageFiles.length) {
        nextTick(() => renderAllPreviews())
      }
    }
    reader.readAsDataURL(file)
  })
  e.target.value = ''
}

const handleDrop = (e) => {
  const files = Array.from(e.dataTransfer.files)
  const imageFiles = files.filter(f => f.type.startsWith('image/'))
  let loadedCount = 0
  
  imageFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (event) => {
      images.value.push({
        src: event.target.result,
        name: file.name
      })
      selectedImages.value.push(images.value.length - 1)
      loadedCount++
      if (loadedCount === imageFiles.length) {
        nextTick(() => renderAllPreviews())
      }
    }
    reader.readAsDataURL(file)
  })
}

const handleWatermarkChange = (e) => {
  const file = e.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (event) => {
      imageWatermark.value.src = event.target.result
      nextTick(() => renderAllPreviews())
    }
    reader.readAsDataURL(file)
  }
  e.target.value = ''
}

const removeImage = (index) => {
  images.value.splice(index, 1)
  selectedImages.value = selectedImages.value
    .map(i => i > index ? i - 1 : i)
    .filter(i => i !== index && i < images.value.length)
  nextTick(() => renderAllPreviews())
}

const toggleImageSelection = (index) => {
  const idx = selectedImages.value.indexOf(index)
  if (idx > -1) {
    selectedImages.value.splice(idx, 1)
  } else {
    selectedImages.value.push(index)
  }
}

const selectAllImages = () => {
  selectedImages.value = images.value.map((_, i) => i)
}

const deselectAllImages = () => {
  selectedImages.value = []
}

const getWatermarkPosition = (imgWidth, imgHeight, wmWidth, wmHeight) => {
  const padding = 20
  switch (position.value) {
    case 'topLeft':
      return { x: padding, y: padding }
    case 'topCenter':
      return { x: (imgWidth - wmWidth) / 2, y: padding }
    case 'topRight':
      return { x: imgWidth - wmWidth - padding, y: padding }
    case 'centerLeft':
      return { x: padding, y: (imgHeight - wmHeight) / 2 }
    case 'center':
      return { x: (imgWidth - wmWidth) / 2, y: (imgHeight - wmHeight) / 2 }
    case 'centerRight':
      return { x: imgWidth - wmWidth - padding, y: (imgHeight - wmHeight) / 2 }
    case 'bottomLeft':
      return { x: padding, y: imgHeight - wmHeight - padding }
    case 'bottomCenter':
      return { x: (imgWidth - wmWidth) / 2, y: imgHeight - wmHeight - padding }
    case 'bottomRight':
      return { x: imgWidth - wmWidth - padding, y: imgHeight - wmHeight - padding }
    default:
      return { x: imgWidth - wmWidth - padding, y: imgHeight - wmHeight - padding }
  }
}

const renderSinglePreview = async (index) => {
  await nextTick()
  const canvas = canvasRefs.value[index]
  if (!canvas || !images.value[index]) return
  
  const ctx = canvas.getContext('2d')
  const img = new Image()
  img.crossOrigin = 'anonymous'
  
  img.onload = () => {
    const maxWidth = 400
    const maxHeight = 300
    let width = img.width
    let height = img.height

    if (width > maxWidth) {
      height = (maxWidth / width) * height
      width = maxWidth
    }
    if (height > maxHeight) {
      width = (maxHeight / height) * width
      height = maxHeight
    }

    canvas.width = width
    canvas.height = height

    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)

    ctx.globalAlpha = opacity.value / 100

    if (watermarkType.value === 'text') {
      const scale = Math.max(width / img.width, height / img.height)
      const scaledFontSize = textWatermark.value.fontSize * scale
      
      ctx.font = `bold ${scaledFontSize}px Arial`
      ctx.fillStyle = textWatermark.value.color
      ctx.textBaseline = 'top'

      if (textWatermark.value.tiled) {
        const textWidth = ctx.measureText(textWatermark.value.text).width
        const textHeight = scaledFontSize
        
        ctx.save()
        ctx.translate(width / 2, height / 2)
        ctx.rotate((textWatermark.value.rotation * Math.PI) / 180)
        
        const scaledGapX = textWatermark.value.gapX * scale
        const scaledGapY = textWatermark.value.gapY * scale
        
        const startX = -width
        const startY = -height
        const endX = width * 2
        const endY = height * 2

        for (let y = startY; y < endY; y += textHeight + scaledGapY) {
          for (let x = startX; x < endX; x += textWidth + scaledGapX) {
            ctx.fillText(textWatermark.value.text, x, y)
          }
        }
        ctx.restore()
      } else {
        const textWidth = ctx.measureText(textWatermark.value.text).width
        const pos = getWatermarkPosition(width, height, textWidth, scaledFontSize)
        ctx.fillText(textWatermark.value.text, pos.x, pos.y)
      }
      ctx.globalAlpha = 1
    } else if (watermarkType.value === 'image' && imageWatermark.value.src) {
      const wmImg = new Image()
      wmImg.crossOrigin = 'anonymous'
      wmImg.onload = () => {
        const wmWidth = (width * imageWatermark.value.size) / 100
        const wmHeight = (wmWidth / wmImg.width) * wmImg.height
        const pos = getWatermarkPosition(width, height, wmWidth, wmHeight)
        ctx.drawImage(wmImg, pos.x, pos.y, wmWidth, wmHeight)
        ctx.globalAlpha = 1
      }
      wmImg.onerror = () => {
        ctx.globalAlpha = 1
      }
      wmImg.src = imageWatermark.value.src
    } else {
      ctx.globalAlpha = 1
    }
  }
  img.onerror = () => {
    console.error('图片加载失败')
  }
  img.src = images.value[index].src
}

const renderAllPreviews = () => {
  Object.keys(canvasRefs.value).forEach(index => {
    renderSinglePreview(parseInt(index))
  })
}

const generateWatermarkedImage = (index) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      
      ctx.drawImage(img, 0, 0)
      ctx.globalAlpha = opacity.value / 100

      if (watermarkType.value === 'text') {
        ctx.font = `bold ${textWatermark.value.fontSize}px Arial`
        ctx.fillStyle = textWatermark.value.color
        ctx.textBaseline = 'top'

        if (textWatermark.value.tiled) {
          const textWidth = ctx.measureText(textWatermark.value.text).width
          const textHeight = textWatermark.value.fontSize
          
          ctx.save()
          ctx.translate(img.width / 2, img.height / 2)
          ctx.rotate((textWatermark.value.rotation * Math.PI) / 180)
          
          const startX = -img.width
          const startY = -img.height
          const endX = img.width * 2
          const endY = img.height * 2

          for (let y = startY; y < endY; y += textHeight + textWatermark.value.gapY) {
            for (let x = startX; x < endX; x += textWidth + textWatermark.value.gapX) {
              ctx.fillText(textWatermark.value.text, x, y)
            }
          }
          ctx.restore()
        } else {
          const textWidth = ctx.measureText(textWatermark.value.text).width
          const pos = getWatermarkPosition(img.width, img.height, textWidth, textWatermark.value.fontSize)
          ctx.fillText(textWatermark.value.text, pos.x, pos.y)
        }
        ctx.globalAlpha = 1
      } else if (watermarkType.value === 'image' && imageWatermark.value.src) {
        const wmImg = new Image()
        wmImg.crossOrigin = 'anonymous'
        wmImg.onload = () => {
          const wmWidth = (img.width * imageWatermark.value.size) / 100
          const wmHeight = (wmWidth / wmImg.width) * wmImg.height
          const pos = getWatermarkPosition(img.width, img.height, wmWidth, wmHeight)
          ctx.drawImage(wmImg, pos.x, pos.y, wmWidth, wmHeight)
          ctx.globalAlpha = 1
          resolve(canvas.toDataURL('image/png'))
        }
        wmImg.onerror = () => {
          ctx.globalAlpha = 1
          resolve(canvas.toDataURL('image/png'))
        }
        wmImg.src = imageWatermark.value.src
        return
      } else {
        ctx.globalAlpha = 1
      }

      resolve(canvas.toDataURL('image/png'))
    }
    img.src = images.value[index].src
  })
}

const downloadSingle = async (index) => {
  const dataUrl = await generateWatermarkedImage(index)
  const link = document.createElement('a')
  link.download = `watermarked_${images.value[index].name}`
  link.href = dataUrl
  link.click()
}

const downloadSelected = async () => {
  for (let i = 0; i < selectedImages.value.length; i++) {
    const index = selectedImages.value[i]
    await new Promise(resolve => setTimeout(resolve, i * 300))
    await downloadSingle(index)
  }
}

watch([watermarkType, opacity, position, textWatermark, imageWatermark], () => {
  renderAllPreviews()
}, { deep: true })
</script>
