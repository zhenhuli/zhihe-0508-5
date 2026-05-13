<template>
  <header class="ink-bg border-b border-ink-200 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3 cursor-pointer" @click="navigateTo('/')">
          <span class="text-3xl">📜</span>
          <div>
            <h1 class="text-2xl font-bold text-ink-800">古诗词赏析</h1>
            <p class="text-sm text-ink-500">品千年文化，赏万首华章</p>
          </div>
        </div>
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink to="/" class="text-ink-700 hover:text-ink-900 transition-colors">
            首页
          </NuxtLink>
          <NuxtLink to="/dynasty" class="text-ink-700 hover:text-ink-900 transition-colors">
            朝代分类
          </NuxtLink>
          <a href="#" class="text-ink-700 hover:text-ink-900 transition-colors">
            关于我们
          </a>
        </nav>
        <button class="md:hidden text-ink-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>
