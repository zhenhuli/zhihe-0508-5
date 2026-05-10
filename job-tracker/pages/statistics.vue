<template>
  <div>
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900">统计报表</h2>
      <p class="text-gray-500 mt-2">查看你的求职投递数据分析</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">总投递数</p>
            <p class="text-4xl font-bold text-gray-900">{{ jobStore.statistics.total }}</p>
          </div>
          <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">面试中</p>
            <p class="text-4xl font-bold text-yellow-600">{{ jobStore.statistics.byStatus.interviewing }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">已录用</p>
            <p class="text-4xl font-bold text-green-600">{{ jobStore.statistics.byStatus.offer }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-6">按状态分布</h3>
        <div class="space-y-4">
          <div v-for="(count, status) in jobStore.statistics.byStatus" :key="status" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="font-medium text-gray-700">{{ statusLabels[status as keyof typeof statusLabels] }}</span>
              <span class="text-gray-500">{{ count }} 个</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div
                :class="['h-3 rounded-full transition-all', getProgressBarColor(status as keyof typeof statusColors)]"
                :style="{ width: `${getPercentage(count)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-6">按月统计</h3>
        <div v-if="Object.keys(jobStore.statistics.byMonth).length === 0" class="text-center py-8 text-gray-500">
          暂无数据
        </div>
        <div v-else class="space-y-4">
          <div v-for="(count, month) in jobStore.statistics.byMonth" :key="month" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="font-medium text-gray-700">{{ month }}</span>
              <span class="text-gray-500">{{ count }} 个</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div
                class="bg-indigo-500 h-3 rounded-full transition-all"
                :style="{ width: `${getPercentage(count)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-6">状态概览</h3>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="text-center p-4 bg-blue-50 rounded-xl">
          <p class="text-3xl font-bold text-blue-600">{{ jobStore.statistics.byStatus.applied }}</p>
          <p class="text-sm text-blue-800 mt-1">已投递</p>
        </div>
        <div class="text-center p-4 bg-yellow-50 rounded-xl">
          <p class="text-3xl font-bold text-yellow-600">{{ jobStore.statistics.byStatus.interviewing }}</p>
          <p class="text-sm text-yellow-800 mt-1">面试中</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-xl">
          <p class="text-3xl font-bold text-green-600">{{ jobStore.statistics.byStatus.offer }}</p>
          <p class="text-sm text-green-800 mt-1">已录用</p>
        </div>
        <div class="text-center p-4 bg-red-50 rounded-xl">
          <p class="text-3xl font-bold text-red-600">{{ jobStore.statistics.byStatus.rejected }}</p>
          <p class="text-sm text-red-800 mt-1">已拒绝</p>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-xl">
          <p class="text-3xl font-bold text-gray-600">{{ jobStore.statistics.byStatus.pending }}</p>
          <p class="text-sm text-gray-800 mt-1">待定</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { statusLabels, statusColors } from '~/types/job'
import type { JobStatus } from '~/types/job'

const jobStore = useJobStore()

function getPercentage(count: number): number {
  if (jobStore.statistics.total === 0) return 0
  return Math.round((count / jobStore.statistics.total) * 100)
}

function getProgressBarColor(status: JobStatus): string {
  const colorMap: Record<JobStatus, string> = {
    applied: 'bg-blue-500',
    interviewing: 'bg-yellow-500',
    offer: 'bg-green-500',
    rejected: 'bg-red-500',
    pending: 'bg-gray-500'
  }
  return colorMap[status]
}

onMounted(() => {
  jobStore.loadApplications()
})
</script>
