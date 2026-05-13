<template>
  <div 
    class="ink-card rounded-lg p-6 cursor-pointer transition-all duration-300"
    @click="handleClick"
  >
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="text-2xl font-bold text-ink-800 mb-1">{{ dynasty.name }}</h3>
        <p class="text-sm text-ink-500">{{ dynasty.period }}</p>
      </div>
      <span class="text-4xl opacity-60">{{ icon }}</span>
    </div>
    <p class="text-ink-600 mb-4">{{ dynasty.description }}</p>
    <div class="flex items-center justify-between">
      <span class="dynasty-tag">{{ poemCount }} 首诗词</span>
      <span class="text-ink-400 text-sm">点击查看 →</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Dynasty } from '~/types/poem'

const props = defineProps<{
  dynasty: Dynasty
  poemCount: number
  icon?: string
}>()

const icon = computed(() => props.icon || '📚')

const handleClick = () => {
  navigateTo(`/dynasty/${props.dynasty.id}`)
}
</script>
