<template>
  <div v-if="application">
    <div class="mb-8">
      <NuxtLink
        to="/"
        class="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-4"
      >
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        返回列表
      </NuxtLink>
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">{{ application.company }}</h2>
          <p class="text-xl text-gray-600 mt-1">{{ application.position }}</p>
        </div>
        <span
          :class="['inline-flex items-center px-4 py-2 rounded-full text-sm font-medium', statusColors[application.status]]"
        >
          {{ statusLabels[application.status] }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">投递日期</p>
            <p class="text-lg font-semibold text-gray-900">{{ application.applicationDate }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">面试时间</p>
            <p class="text-lg font-semibold text-gray-900">{{ application.interviewDate || '暂无' }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">更新时间</p>
            <p class="text-lg font-semibold text-gray-900">{{ application.updatedAt }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">更新状态</h3>
        <form @submit.prevent="handleStatusUpdate">
          <div class="space-y-4">
            <div>
              <label for="newStatus" class="block text-sm font-medium text-gray-700 mb-2">
                选择新状态 <span class="text-red-500">*</span>
              </label>
              <select
                id="newStatus"
                v-model="newStatus"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="applied">已投递</option>
                <option value="interviewing">面试中</option>
                <option value="offer">已录用</option>
                <option value="rejected">已拒绝</option>
                <option value="pending">待定</option>
              </select>
            </div>
            <div>
              <label for="statusNotes" class="block text-sm font-medium text-gray-700 mb-2">
                状态变更备注
              </label>
              <textarea
                id="statusNotes"
                v-model="statusNotes"
                rows="3"
                placeholder="记录这次状态变更的原因或注意事项..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              class="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              更新状态
            </button>
          </div>
        </form>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">状态变更历史</h3>
        <div v-if="application.statusHistory.length === 0" class="text-center py-8 text-gray-500">
          暂无状态变更记录
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="(history, index) in sortedStatusHistory"
            :key="history.id"
            class="relative pl-8 pb-6 last:pb-0"
          >
            <div class="absolute left-0 top-1">
              <div
                :class="['w-4 h-4 rounded-full border-2 border-white', getStatusDotColor(history.status)]"
              ></div>
              <div
                v-if="index !== sortedStatusHistory.length - 1"
                class="absolute left-1.5 top-4 w-0.5 h-full bg-gray-200"
              ></div>
            </div>
            <div class="ml-2">
              <div class="flex items-center justify-between mb-1">
                <span
                  :class="['inline-flex items-center px-2 py-1 rounded text-xs font-medium', statusColors[history.status]]"
                >
                  {{ statusLabels[history.status] }}
                </span>
                <span class="text-sm text-gray-500">{{ history.changedAt }}</span>
              </div>
              <p v-if="history.notes" class="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg mt-2">
                {{ history.notes }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-end space-x-4">
      <button
        @click="handleDelete"
        class="px-6 py-3 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
      >
        删除记录
      </button>
    </div>
  </div>

  <div v-else class="text-center py-16">
    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 class="text-xl font-medium text-gray-900 mb-2">记录不存在</h3>
    <p class="text-gray-500 mb-6">该投递记录可能已被删除</p>
    <NuxtLink
      to="/"
      class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
    >
      返回列表
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { JobStatus } from '~/types/job'
import { statusLabels, statusColors } from '~/types/job'

const route = useRoute()
const router = useRouter()
const jobStore = useJobStore()

const newStatus = ref<JobStatus>('applied')
const statusNotes = ref('')

const application = computed(() => {
  return jobStore.getApplicationById(route.params.id as string)
})

const sortedStatusHistory = computed(() => {
  if (!application.value) return []
  return [...application.value.statusHistory].sort((a, b) => {
    return new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  })
})

function getStatusDotColor(status: JobStatus): string {
  const colorMap: Record<JobStatus, string> = {
    applied: 'bg-blue-500',
    interviewing: 'bg-yellow-500',
    offer: 'bg-green-500',
    rejected: 'bg-red-500',
    pending: 'bg-gray-500'
  }
  return colorMap[status]
}

function handleStatusUpdate() {
  if (!application.value) return
  jobStore.updateStatus(
    application.value.id,
    newStatus.value,
    statusNotes.value || undefined
  )
  statusNotes.value = ''
}

function handleDelete() {
  if (!application.value) return
  if (confirm('确定要删除这条投递记录吗？此操作不可撤销。')) {
    jobStore.deleteApplication(application.value.id)
    router.push('/')
  }
}

onMounted(() => {
  jobStore.loadApplications()
  if (application.value) {
    newStatus.value = application.value.status
  }
})
</script>
