<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800">活动列表</h1>
      <NuxtLink
        to="/create"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        创建活动
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
      <p class="mt-4 text-gray-500">加载中...</p>
    </div>

    <div v-else-if="!events || events.length === 0" class="text-center py-16">
      <p class="text-gray-500 text-lg">暂无活动，点击上方按钮创建第一个活动</p>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="event in events"
        :key="event.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-semibold text-gray-800">{{ event.title }}</h2>
            <span
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                event.isClosed
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-green-100 text-green-600'
              ]"
            >
              {{ event.isClosed ? '已结束' : '报名中' }}
            </span>
          </div>

          <p v-if="event.description" class="text-gray-600 mb-4 line-clamp-2">
            {{ event.description }}
          </p>

          <div class="space-y-2 text-sm text-gray-500">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(event.date) }}
            </div>
            <div v-if="event.location" class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ event.location }}
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {{ event.currentParticipants }} / {{ event.maxParticipants }} 人
            </div>
          </div>

          <div class="mt-6">
            <NuxtLink
              :to="`/event/${event.id}`"
              :class="[
                'w-full text-center block py-2 rounded-lg transition',
                event.isClosed
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              ]"
            >
              查看详情
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <p v-if="errorMsg" class="mt-4 text-red-500 text-center">{{ errorMsg }}</p>
  </div>
</template>

<script setup>
const events = ref([])
const loading = ref(true)
const errorMsg = ref('')

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:9000/api'

const fetchEvents = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const data = await $fetch(`${API_BASE}/events`)
    events.value = data || []
  } catch (e) {
    console.error('获取活动列表失败:', e)
    errorMsg.value = '加载失败，请刷新页面重试'
    events.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchEvents()
})
</script>
