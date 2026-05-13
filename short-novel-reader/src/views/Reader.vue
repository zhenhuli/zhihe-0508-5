<template>
  <div 
    class="min-h-screen transition-colors duration-300"
    :class="isDark ? 'bg-gray-900' : 'bg-amber-50'"
  >
    <header 
      v-if="showControls"
      class="fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 shadow-md transition-all duration-300"
    >
      <div class="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <button 
          @click="goBack"
          class="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        >
          <span class="text-xl">←</span>
          <span>返回书架</span>
        </button>
        <div class="flex items-center gap-4">
          <button 
            @click="toggleTheme"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span class="text-xl">{{ isDark ? '☀️' : '🌙' }}</span>
          </button>
          <button 
            @click="showSettings = !showSettings"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span class="text-xl">⚙️</span>
          </button>
        </div>
      </div>
    </header>

    <div 
      v-if="showSettings"
      class="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-80 transition-all duration-300"
    >
      <h3 class="font-bold text-lg mb-4 text-gray-800 dark:text-white">阅读设置</h3>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          字体大小: {{ fontSize }}px
        </label>
        <input 
          type="range" 
          v-model="fontSize" 
          min="14" 
          max="28" 
          step="2"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          行间距: {{ lineHeight }}
        </label>
        <input 
          type="range" 
          v-model="lineHeight" 
          min="1.5" 
          max="2.5" 
          step="0.1"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      <div class="flex justify-end">
        <button 
          @click="showSettings = false"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          确定
        </button>
      </div>
    </div>

    <div 
      @click="toggleControls"
      class="pt-16 pb-24 px-4 max-w-4xl mx-auto cursor-pointer"
    >
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">{{ currentNovel?.title }}</h2>
        <h3 class="text-lg text-gray-600 dark:text-gray-400">{{ currentChapter?.title }}</h3>
      </div>

      <div 
        class="reader-content text-justify text-gray-800 dark:text-gray-200 leading-relaxed"
        :style="{
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight
        }"
      >
        <p 
          v-for="(paragraph, index) in paragraphs" 
          :key="index"
          class="mb-4 indent-8"
        >
          {{ paragraph }}
        </p>
      </div>

      <div class="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
        - 本章完 -
      </div>
      
      <div class="text-center">
        <button
          v-if="hasNextChapter"
          @click.stop="nextChapter"
          class="px-8 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          继续阅读下一章 →
        </button>
        <div
          v-else
          class="px-8 py-3 text-gray-500 dark:text-gray-400 font-medium"
        >
          🎉 已阅读完所有章节
        </div>
      </div>
    </div>

    <nav 
      v-if="showControls"
      class="fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 shadow-md transition-all duration-300"
    >
      <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <button 
          @click="prevChapter"
          :disabled="!hasPrevChapter"
          :class="[
            'px-6 py-2 rounded-lg font-medium transition-all',
            hasPrevChapter 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          ]"
        >
          上一章
        </button>

        <div class="flex-1 mx-4">
          <select 
            v-model="selectedChapterId"
            @change="goToChapter"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option 
              v-for="chapter in currentNovel?.chapters" 
              :key="chapter.id"
              :value="chapter.id"
            >
              {{ chapter.title }}
            </option>
          </select>
        </div>

        <button 
          @click="nextChapter"
          :disabled="!hasNextChapter"
          :class="[
            'px-6 py-2 rounded-lg font-medium transition-all',
            hasNextChapter 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          ]"
        >
          下一章
        </button>
      </div>
    </nav>

    <div 
      v-if="showControls"
      class="fixed bottom-24 right-4 z-10 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md text-sm text-gray-600 dark:text-gray-400"
    >
      阅读进度: {{ progress }}%
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { novels } from '../data/novels.js'

const router = useRouter()
const route = useRoute()
const isDark = inject('isDark')

const showControls = ref(true)
const showSettings = ref(false)
const fontSize = ref(18)
const lineHeight = ref(1.8)
const progress = ref(0)

const currentNovelId = computed(() => parseInt(route.params.novelId))
const currentChapterId = computed(() => parseInt(route.params.chapterId))

const currentNovel = computed(() => novels.find(n => n.id === currentNovelId.value))
const currentChapter = computed(() => currentNovel.value?.chapters.find(c => c.id === currentChapterId.value))

const paragraphs = computed(() => {
  if (!currentChapter.value) return []
  return currentChapter.value.content.split('\n\n').filter(p => p.trim())
})

const selectedChapterId = computed({
  get: () => currentChapterId.value,
  set: (val) => val
})

const hasPrevChapter = computed(() => currentChapterId.value > 1)
const hasNextChapter = computed(() => {
  if (!currentNovel.value) return false
  return currentChapterId.value < currentNovel.value.chapters.length
})

const toggleTheme = () => {
  isDark.value = !isDark.value
}

const goBack = () => {
  router.push('/')
}

const toggleControls = () => {
  if (!showSettings.value) {
    showControls.value = !showControls.value
  }
}

const prevChapter = () => {
  if (hasPrevChapter.value) {
    router.push(`/reader/${currentNovelId.value}/${currentChapterId.value - 1}`)
  }
}

const nextChapter = () => {
  if (hasNextChapter.value) {
    router.push(`/reader/${currentNovelId.value}/${currentChapterId.value + 1}`)
  }
}

const goToChapter = () => {
  router.push(`/reader/${currentNovelId.value}/${selectedChapterId.value}`)
}

const saveSettings = () => {
  localStorage.setItem('fontSize', fontSize.value)
  localStorage.setItem('lineHeight', lineHeight.value)
}

const loadSettings = () => {
  const savedFontSize = localStorage.getItem('fontSize')
  const savedLineHeight = localStorage.getItem('lineHeight')
  
  if (savedFontSize) fontSize.value = parseInt(savedFontSize)
  if (savedLineHeight) lineHeight.value = parseFloat(savedLineHeight)
}

const saveProgress = () => {
  if (currentNovel.value) {
    localStorage.setItem(`lastChapter_${currentNovelId.value}`, currentChapterId.value)
    const totalChapters = currentNovel.value.chapters.length
    const progressPercent = (currentChapterId.value / totalChapters) * 100
    localStorage.setItem(`progress_${currentNovelId.value}`, progressPercent)
    progress.value = Math.round(progressPercent)
  }
}

watch([fontSize, lineHeight], saveSettings)

watch([currentChapterId, currentNovelId], () => {
  saveProgress()
})

onMounted(() => {
  loadSettings()
  saveProgress()
  
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

const handleKeydown = (e) => {
  if (e.key === 'ArrowLeft') {
    prevChapter()
  } else if (e.key === 'ArrowRight') {
    nextChapter()
  } else if (e.key === 'Escape') {
    showControls.value = !showControls.value
  }
}
</script>

<style scoped>
.reader-content {
  text-indent: 2em;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}
</style>
