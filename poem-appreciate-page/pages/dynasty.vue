<template>
  <div class="min-h-screen ink-bg">
    <HeaderNav />
    
    <section class="py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-ink-800 mb-4">朝代分类</h2>
          <p class="text-ink-600">选择朝代，浏览该时期的经典诗词</p>
        </div>
        
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
  </div>
</template>

<script setup lang="ts">
import { dynasties, getPoemsByDynasty } from '~/data/poems'

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
</script>
