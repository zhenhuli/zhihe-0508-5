<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <header class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">📚 短篇网文书架</h1>
        <button 
          @click="toggleTheme"
          class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <span class="text-xl">{{ isDark ? '☀️' : '🌙' }}</span>
        </button>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-6">
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          :class="[
            'px-4 py-2 rounded-full font-medium transition-all',
            selectedCategory === cat
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="novel in filteredNovels"
          :key="novel.id"
          @click="goToReader(novel)"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div class="aspect-[3/4] overflow-hidden">
            <img 
              :src="novel.cover" 
              :alt="novel.title"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="p-4">
            <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-1 truncate">{{ novel.title }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">作者：{{ novel.author }}</p>
            <span class="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
              {{ novel.category }}
            </span>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{{ novel.description }}</p>
            <div class="mt-3 flex items-center justify-between">
              <span class="text-xs text-gray-400 dark:text-gray-500">共 {{ novel.chapters.length }} 章</span>
              <span v-if="getProgress(novel.id)" class="text-xs text-green-500">
                已读 {{ getProgress(novel.id) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { novels, categories } from '../data/novels.js'

const router = useRouter()
const isDark = inject('isDark')

const selectedCategory = ref('全部')

const filteredNovels = computed(() => {
  if (selectedCategory.value === '全部') {
    return novels
  }
  return novels.filter(novel => novel.category === selectedCategory.value)
})

const getProgress = (novelId) => {
  const progress = localStorage.getItem(`progress_${novelId}`)
  return progress ? Math.round(parseInt(progress)) : null
}

const toggleTheme = () => {
  isDark.value = !isDark.value
}

const goToReader = (novel) => {
  const savedChapter = localStorage.getItem(`lastChapter_${novel.id}`)
  const chapterId = savedChapter ? parseInt(savedChapter) : 1
  router.push(`/reader/${novel.id}/${chapterId}`)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
