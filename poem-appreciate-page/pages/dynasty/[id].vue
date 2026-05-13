<template>
  <div class="min-h-screen ink-bg">
    <HeaderNav />
    
    <section v-if="dynasty" class="py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="mb-8">
          <button 
            class="flex items-center gap-2 text-ink-600 hover:text-ink-800 mb-6 transition-colors"
            @click="navigateTo('/dynasty')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回朝代列表
          </button>
          
          <div class="ink-card rounded-xl p-8 mb-8">
            <div class="flex items-start gap-6 mb-6">
              <div class="w-20 h-20 rounded-full bg-ink-100 flex items-center justify-center flex-shrink-0">
                <span class="text-5xl">{{ dynastyIcon }}</span>
              </div>
              <div class="flex-1">
                <h2 class="text-4xl font-bold text-ink-800 mb-2">{{ dynasty.name }}</h2>
                <p class="text-ink-500 text-lg mb-2">📅 {{ dynasty.period }}</p>
                <span class="dynasty-tag inline-block">{{ dynastyPoems.length }} 首诗词</span>
              </div>
            </div>
            
            <div class="bamboo-divider mb-6"></div>
            
            <div class="mb-6">
              <h3 class="text-xl font-bold text-ink-700 mb-3">📜 朝代简介</h3>
              <p class="text-ink-600 leading-relaxed text-lg">{{ dynasty.description }}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-ink-50 rounded-lg p-5">
                <h4 class="font-bold text-ink-700 mb-2 flex items-center gap-2">
                  <span>✨</span> 文学特色
                </h4>
                <p class="text-ink-600">{{ dynasty.feature }}</p>
              </div>
              <div class="bg-plum-50 rounded-lg p-5">
                <h4 class="font-bold text-ink-700 mb-2 flex items-center gap-2">
                  <span>🌟</span> 代表人物
                </h4>
                <p class="text-ink-600">{{ dynasty.representative }}</p>
              </div>
              <div class="bg-gold-50 rounded-lg p-5">
                <h4 class="font-bold text-ink-700 mb-2 flex items-center gap-2">
                  <span>🎨</span> 艺术氛围
                </h4>
                <p class="text-ink-600">{{ dynasty.atmosphere }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="text-2xl font-bold text-ink-800 mb-6 flex items-center gap-3">
            <span>📚</span> {{ dynasty.name }}诗词精选
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PoemCard 
              v-for="poem in dynastyPoems" 
              :key="poem.id"
              :poem="poem"
            />
          </div>

          <div v-if="dynastyPoems.length === 0" class="text-center py-16">
            <span class="text-6xl mb-4 block">📖</span>
            <p class="text-ink-500 text-lg">该朝代暂无诗词，敬请期待！</p>
          </div>
        </div>
      </div>
    </section>

    <div v-else class="flex items-center justify-center min-h-[50vh]">
      <p class="text-ink-500 text-lg">加载中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDynastyById, getPoemsByDynasty } from '~/data/poems'

const route = useRoute()
const dynastyId = computed(() => route.params.id as string)

const dynasty = computed(() => getDynastyById(dynastyId.value))
const dynastyPoems = computed(() => getPoemsByDynasty(dynastyId.value))

const dynastyIcon = computed(() => {
  const icons: Record<string, string> = {
    tang: '🏮',
    song: '🎋',
    han: '📜',
    'wei-jin': '🍃',
    'ming-qing': '🏯'
  }
  return icons[dynastyId.value] || '📚'
})
</script>
