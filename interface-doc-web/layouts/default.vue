<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <NuxtLink to="/" class="flex items-center gap-2">
              <svg class="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <h1 class="text-xl font-bold text-gray-800">接口文档平台</h1>
            </NuxtLink>
          </div>
          <nav class="flex items-center gap-4">
            <NuxtLink
              to="/"
              class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="isActive('/') ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
            >
              接口管理
            </NuxtLink>
            <NuxtLink
              to="/favorites"
              class="px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1"
              :class="isActive('/favorites') ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              收藏夹
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <slot />
    </main>
    
    <footer class="bg-white border-t border-gray-200 mt-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p class="text-center text-sm text-gray-500">
          轻量接口文档平台 - 基于 Nuxt 3 构建
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const isActive = (path: string) => {
  return route.path === path;
};
</script>
