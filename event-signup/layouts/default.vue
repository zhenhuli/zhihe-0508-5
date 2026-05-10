<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <nav class="flex items-center justify-between">
          <NuxtLink to="/" class="text-2xl font-bold text-blue-600">
            活动报名系统
          </NuxtLink>
          <div class="flex gap-4">
            <NuxtLink to="/" class="text-gray-600 hover:text-blue-600">
              活动列表
            </NuxtLink>
            <NuxtLink to="/create" class="text-gray-600 hover:text-blue-600">
              创建活动
            </NuxtLink>
          </div>
        </nav>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-4 py-8">
      <slot />
    </main>
    <footer class="bg-white border-t mt-auto">
      <div class="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500">
        © 2024 活动报名系统
      </div>
    </footer>
  </div>
</template>
