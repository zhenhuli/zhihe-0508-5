<template>
  <div class="min-h-screen ink-bg">
    <HeaderNav />
    
    <section class="py-16 px-4">
      <div class="max-w-6xl mx-auto text-center">
        <div class="mb-8">
          <h2 class="text-4xl md:text-5xl font-bold text-ink-800 mb-4 text-shadow-ink">
            传承千年文化
          </h2>
          <p class="text-xl text-ink-600 max-w-2xl mx-auto">
            品读经典诗词，感受古人情怀，领略中华文化之美
          </p>
        </div>
        <div class="flex flex-wrap justify-center gap-4">
          <button 
            class="ink-btn"
            @click="navigateTo('/dynasty')"
          >
            按朝代浏览
          </button>
          <button 
            class="bg-white border-2 border-ink-300 text-ink-700 px-6 py-3 rounded-lg hover:bg-ink-50 transition-colors"
            @click="scrollToPoems"
          >
            精选诗词
          </button>
        </div>
      </div>
    </section>

    <section class="py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <h3 class="text-2xl font-bold text-ink-800 mb-8 text-center">按朝代浏览</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DynastyCard 
            v-for="dynasty in dynasties" 
            :key="dynasty.id"
            :dynasty="dynasty"
            :poem-count="getPoemCount(dynasty.id)"
            :icon="getDynastyIcon(dynasty.id)"
          />
        </div>
      </div>
    </section>

    <section id="poems-section" class="py-12 px-4 bg-ink-50/50" ref="poemsSection">
      <div class="max-w-6xl mx-auto">
        <h3 class="text-2xl font-bold text-ink-800 mb-8 text-center">精选诗词</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PoemCard 
            v-for="poem in featuredPoems" 
            :key="poem.id"
            :poem="poem"
          />
        </div>
      </div>
    </section>

    <footer class="py-8 px-4 border-t border-ink-200">
      <div class="max-w-6xl mx-auto text-center text-ink-500">
        <p>© 2024 古诗词赏析 | 传承中华文化，品读千年经典</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { dynasties, poems, getPoemsByDynasty } from '~/data/poems'

const poemsSection = ref<HTMLElement | null>(null)

const featuredPoems = computed(() => poems.slice(0, 6))

function getPoemCount(dynastyId: string): number {
  return getPoemsByDynasty(dynastyId).length
}

function getDynastyIcon(dynastyId: string): string {
  const icons: Record<string, string> = {
    tang: '🏮',
    song: '🎋',
    han: '📜',
    'wei-jin': '🍃',
    'ming-qing': '🏯'
  }
  return icons[dynastyId] || '📚'
}

function scrollToPoems() {
  poemsSection.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>
