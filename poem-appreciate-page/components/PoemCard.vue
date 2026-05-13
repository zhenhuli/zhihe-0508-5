<template>
  <div 
    class="ink-card rounded-lg p-6 cursor-pointer transition-all duration-300 plum-accent"
    @click="handleClick"
  >
    <div class="mb-4">
      <span class="dynasty-tag mb-2 inline-block">{{ dynastyName }}</span>
      <h3 class="text-xl font-bold text-ink-800 mb-1">{{ poem.title }}</h3>
      <p class="text-ink-500">—— {{ poem.author }}</p>
    </div>
    <div class="bamboo-divider mb-4"></div>
    <div class="poem-text text-ink-700 text-base line-clamp-3">
      {{ previewText }}
    </div>
    <div class="mt-4 text-right">
      <span class="text-ink-400 text-sm">点击阅读全文 →</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Poem } from '~/types/poem'
import { getDynastyById } from '~/data/poems'

const props = defineProps<{
  poem: Poem
}>()

const dynastyName = computed(() => {
  const dynasty = getDynastyById(props.poem.dynasty)
  return dynasty?.name || '未知'
})

const previewText = computed(() => {
  const lines = props.poem.content.filter(line => line.trim())
  return lines.slice(0, 2).join('，') + '...'
})

const handleClick = () => {
  navigateTo(`/poem/${props.poem.id}`)
}
</script>
