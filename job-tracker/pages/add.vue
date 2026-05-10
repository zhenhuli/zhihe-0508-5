<template>
  <div>
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900">添加投递记录</h2>
      <p class="text-gray-500 mt-2">记录新的求职投递信息</p>
    </div>

    <div class="max-w-2xl">
      <form @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div class="space-y-6">
          <div>
            <label for="company" class="block text-sm font-medium text-gray-700 mb-2">
              公司名称 <span class="text-red-500">*</span>
            </label>
            <input
              id="company"
              v-model="form.company"
              type="text"
              required
              placeholder="如：阿里巴巴、腾讯科技"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label for="position" class="block text-sm font-medium text-gray-700 mb-2">
              岗位名称 <span class="text-red-500">*</span>
            </label>
            <input
              id="position"
              v-model="form.position"
              type="text"
              required
              placeholder="如：前端开发工程师、全栈工程师"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
              当前状态 <span class="text-red-500">*</span>
            </label>
            <select
              id="status"
              v-model="form.status"
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
            <label for="applicationDate" class="block text-sm font-medium text-gray-700 mb-2">
              投递日期 <span class="text-red-500">*</span>
            </label>
            <input
              id="applicationDate"
              v-model="form.applicationDate"
              type="date"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label for="interviewDate" class="block text-sm font-medium text-gray-700 mb-2">
              面试时间 <span class="text-gray-400">(可选)</span>
            </label>
            <input
              id="interviewDate"
              v-model="form.interviewDate"
              type="date"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
              备注信息 <span class="text-gray-400">(可选)</span>
            </label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="4"
              placeholder="记录面试感受、注意事项等信息..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end space-x-4 mt-8">
          <NuxtLink
            to="/"
            class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </NuxtLink>
          <button
            type="submit"
            class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            保存记录
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { JobStatus } from '~/types/job'

const jobStore = useJobStore()
const router = useRouter()

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

const form = reactive({
  company: '',
  position: '',
  status: 'applied' as JobStatus,
  applicationDate: getTodayString(),
  interviewDate: '',
  notes: ''
})

function handleSubmit() {
  jobStore.addApplication({
    company: form.company,
    position: form.position,
    status: form.status,
    applicationDate: form.applicationDate,
    interviewDate: form.interviewDate || undefined,
    notes: form.notes || undefined
  })
  router.push('/')
}

onMounted(() => {
  jobStore.loadApplications()
})
</script>
