<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        class="absolute inset-0 bg-black bg-opacity-50"
        @click="handleClose"
      ></div>
      
      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 z-10">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">
            更新状态 - {{ application?.company }}
          </h3>
          <button
            @click="handleClose"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="p-6">
          <div class="space-y-4">
            <div>
              <label for="modalStatus" class="block text-sm font-medium text-gray-700 mb-2">
                选择新状态 <span class="text-red-500">*</span>
              </label>
              <select
                id="modalStatus"
                v-model="localStatus"
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
              <label for="modalNotes" class="block text-sm font-medium text-gray-700 mb-2">
                状态变更备注
              </label>
              <textarea
                id="modalNotes"
                v-model="localNotes"
                rows="4"
                placeholder="记录这次状态变更的原因或注意事项..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              ></textarea>
            </div>
          </div>
          
          <div class="flex items-center justify-end space-x-4 mt-6">
            <button
              type="button"
              @click="handleClose"
              class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              更新状态
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { JobStatus, JobApplication } from '~/types/job'

const props = defineProps<{
  isOpen: boolean
  application: JobApplication | null
}>()

const emit = defineEmits<{
  close: []
  submit: [status: JobStatus, notes?: string]
}>()

const localStatus = ref<JobStatus>('applied')
const localNotes = ref('')

watch(() => props.application, (newApp) => {
  if (newApp) {
    localStatus.value = newApp.status
    localNotes.value = ''
  }
}, { immediate: true })

function handleClose() {
  emit('close')
}

function handleSubmit() {
  emit('submit', localStatus.value, localNotes.value || undefined)
  handleClose()
}
</script>
