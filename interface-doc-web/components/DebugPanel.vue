<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">在线调试</h3>
      <button
        @click="handleDebug"
        :disabled="loading"
        class="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ loading ? '请求中...' : '发送请求' }}
      </button>
    </div>
    
    <div v-if="result" class="space-y-4">
      <div class="border border-gray-200 rounded overflow-hidden">
        <div class="bg-gray-100 px-4 py-2 font-medium text-sm text-gray-700">
          响应信息
        </div>
        <div class="p-4 space-y-2">
          <div class="flex items-center gap-4 text-sm">
            <span class="text-gray-500">状态码:</span>
            <span class="font-mono" :class="result.response.status === 200 ? 'text-green-600' : 'text-red-600'">
              {{ result.response.status }} {{ result.response.statusText }}
            </span>
          </div>
          <div class="flex items-center gap-4 text-sm">
            <span class="text-gray-500">耗时:</span>
            <span class="font-mono text-gray-700">{{ result.timing.total }}ms</span>
          </div>
        </div>
      </div>
      
      <div class="border border-gray-200 rounded overflow-hidden">
        <div class="bg-gray-100 px-4 py-2 font-medium text-sm text-gray-700 flex items-center justify-between">
          <span>响应头</span>
          <button
            @click="showHeaders = !showHeaders"
            class="text-xs text-primary-500 hover:text-primary-600"
          >
            {{ showHeaders ? '收起' : '展开' }}
          </button>
        </div>
        <div v-if="showHeaders" class="p-4">
          <pre class="text-xs text-gray-700 overflow-x-auto">{{ formatHeaders(result.response.headers) }}</pre>
        </div>
      </div>
      
      <div class="border border-gray-200 rounded overflow-hidden">
        <div class="bg-gray-100 px-4 py-2 font-medium text-sm text-gray-700">
          响应体
        </div>
        <div class="p-4 bg-gray-50 max-h-96 overflow-auto">
          <pre class="text-xs text-gray-800 whitespace-pre-wrap">{{ formatJson(result.response.body) }}</pre>
        </div>
      </div>
    </div>
    
    <div v-else-if="!loading" class="text-center py-8 text-gray-500">
      <svg class="w-16 h-16 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p>点击"发送请求"按钮开始调试</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ApiInterface } from '~/types';
import { useApiStore } from '~/stores/api';

const props = defineProps<{
  api: ApiInterface;
}>();

const apiStore = useApiStore();

const loading = ref(false);
const result = ref<any>(null);
const showHeaders = ref(false);

const handleDebug = async () => {
  loading.value = true;
  result.value = null;
  
  try {
    result.value = await apiStore.debugInterface(props.api);
  } catch (error) {
    console.error('Debug failed:', error);
  } finally {
    loading.value = false;
  }
};

const formatHeaders = (headers: Record<string, string>) => {
  return Object.entries(headers)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
};

const formatJson = (data: any) => {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
};
</script>
