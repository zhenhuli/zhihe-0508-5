<template>
  <div class="min-h-screen ink-bg">
    <HeaderNav />
    
    <section v-if="poem" class="py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <button 
          class="flex items-center gap-2 text-ink-600 hover:text-ink-800 mb-6 transition-colors"
          @click="goBack"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>

        <div class="ink-card rounded-xl p-8 mb-8">
          <div class="text-center mb-8">
            <span class="dynasty-tag mb-4 inline-block">{{ dynastyName }}</span>
            <h1 class="text-4xl font-bold text-ink-800 mb-3">{{ poem.title }}</h1>
            <p class="text-xl text-ink-600">—— {{ poem.author }}</p>
          </div>

          <div class="bamboo-divider mb-8"></div>

          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-ink-700">📖 诗词正文</h3>
              <div class="flex items-center gap-2">
                <span class="text-sm text-ink-500">显示节奏</span>
                <button 
                  @click="showRhythm = !showRhythm"
                  class="relative w-12 h-6 rounded-full transition-colors"
                  :class="showRhythm ? 'bg-ink-600' : 'bg-ink-300'"
                >
                  <span 
                    class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow"
                    :class="showRhythm ? 'translate-x-7' : 'translate-x-1'"
                  ></span>
                </button>
              </div>
            </div>
            <div class="poem-text py-8 px-4 bg-ink-50/50 rounded-lg">
              <div v-for="(line, lineIndex) in poem.content" :key="lineIndex" class="mb-3">
                <template v-if="line.trim() === ''">
                  <br />
                </template>
                <template v-else>
                  <span v-for="(segment, segIndex) in getRhythmSegments(line, lineIndex)" :key="segIndex">
                    <span 
                      class="relative inline-block"
                      :class="{ 'rhythm-mark': showRhythm && segIndex > 0 }"
                    >
                      {{ segment }}
                    </span>
                  </span>
                </template>
              </div>
            </div>
          </div>

          <div v-if="poem.annotations.length > 0" class="mb-8">
            <h3 class="text-xl font-bold text-ink-700 mb-4">📝 词语注解</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(annotation, index) in poem.annotations" :key="index" class="annotation-box">
                <span class="font-bold text-ink-800">{{ annotation.word }}</span>
                <span class="text-ink-600">：{{ annotation.explanation }}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-ink-50 rounded-lg p-6">
              <h3 class="text-xl font-bold text-ink-700 mb-3">🎭 诗词赏析</h3>
              <p class="text-ink-600 leading-relaxed">{{ poem.appreciation }}</p>
            </div>
            <div class="bg-gold-50 rounded-lg p-6">
              <h3 class="text-xl font-bold text-ink-700 mb-3">📜 创作背景</h3>
              <p class="text-ink-600 leading-relaxed">{{ poem.background }}</p>
            </div>
          </div>
        </div>

        <div class="text-center">
          <p class="text-ink-500 text-sm">感谢阅读 · 古诗词赏析</p>
        </div>
      </div>
    </section>

    <div v-else class="flex items-center justify-center min-h-[50vh]">
      <p class="text-ink-500 text-lg">诗词未找到</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPoemById, getDynastyById } from '~/data/poems'

const route = useRoute()
const router = useRouter()
const poemId = computed(() => Number(route.params.id))

const poem = computed(() => getPoemById(poemId.value))
const showRhythm = ref(true)

const dynastyName = computed(() => {
  if (!poem.value) return '未知'
  const dynasty = getDynastyById(poem.value.dynasty)
  return dynasty?.name || '未知'
})

function getRhythmSegments(line: string, lineIndex: number): string[] {
  if (!poem.value || !poem.value.rhythm[lineIndex] || !showRhythm.value) {
    return [line]
  }

  const rhythm = poem.value.rhythm[lineIndex]
  if (rhythm.length === 0) return [line]

  const segments: string[] = []
  let position = 0

  for (const length of rhythm) {
    if (position + length <= line.length) {
      segments.push(line.substring(position, position + length))
      position += length
    }
  }

  if (position < line.length) {
    segments.push(line.substring(position))
  }

  return segments
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
