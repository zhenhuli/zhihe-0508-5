<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-3xl font-bold text-gray-900">投递列表</h2>
      <NuxtLink
        to="/add"
        class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        添加新记录
      </NuxtLink>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="jobStore.sortedApplications.length === 0" class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-xl font-medium text-gray-900 mb-2">暂无投递记录</h3>
        <p class="text-gray-500 mb-6">开始记录你的求职旅程吧</p>
        <NuxtLink
          to="/add"
          class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          添加第一条记录
        </NuxtLink>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="app in jobStore.sortedApplications"
          :key="app.id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <NuxtLink
                  :to="`/job/${app.id}`"
                  class="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  {{ app.company }}
                </NuxtLink>
                <span
                  :class="['inline-flex items-center px-3 py-1 rounded-full text-sm font-medium', statusColors[app.status]]"
                >
                  {{ statusLabels[app.status] }}
                </span>
              </div>
              <p class="text-gray-600 mb-3">{{ app.position }}</p>
              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  投递日期：{{ app.applicationDate }}
                </div>
                <div v-if="app.interviewDate" class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  面试时间：{{ app.interviewDate }}
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  更新时间：{{ app.updatedAt }}
                </div>
                <div class="flex items-center text-indigo-600">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  状态变更：{{ app.statusHistory.length }} 次
                </div>
              </div>
              <p v-if="getLatestNote(app)" class="mt-3 text-gray-500 text-sm bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-500">
                <span class="font-medium text-indigo-700">最新备注：</span>{{ getLatestNote(app) }}
              </p>
            </div>
            <div class="flex items-center space-x-2 ml-4">
              <NuxtLink
                :to="`/job/${app.id}`"
                class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="查看详情"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </NuxtLink>
              <button
                @click="openStatusModal(app)"
                class="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                title="修改状态"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="handleDelete(app.id)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="删除"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <StatusUpdateModal
      :is-open="isModalOpen"
      :application="selectedApplication"
      @close="closeStatusModal"
      @submit="handleStatusUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { statusLabels, statusColors } from '~/types/job'
import type { JobStatus, JobApplication } from '~/types/job'

const jobStore = useJobStore()
const router = useRouter()

const isModalOpen = ref(false)
const selectedApplication = ref<JobApplication | null>(null)

function getLatestNote(application: JobApplication): string | undefined {
  return jobStore.getLatestNote(application)
}

function openStatusModal(app: JobApplication) {
  selectedApplication.value = app
  isModalOpen.value = true
}

function closeStatusModal() {
  isModalOpen.value = false
  selectedApplication.value = null
}

function handleStatusUpdate(status: JobStatus, notes?: string) {
  if (!selectedApplication.value) return
  jobStore.updateStatus(selectedApplication.value.id, status, notes)
  closeStatusModal()
}

function handleDelete(id: string) {
  if (confirm('确定要删除这条投递记录吗？此操作不可撤销。')) {
    jobStore.deleteApplication(id)
  }
}

onMounted(() => {
  jobStore.loadApplications()
})
</script>
