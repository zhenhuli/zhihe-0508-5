<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <svg class="w-7 h-7 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        收藏夹
      </h2>
      <span class="text-sm text-gray-500">
        共 {{ favoriteInterfaces.length }} 个接口
      </span>
    </div>
    
    <div v-if="apiStore.loading" class="text-center py-12 text-gray-500">
      <svg class="w-12 h-12 mx-auto mb-4 text-primary-500 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      加载中...
    </div>
    
    <div v-else-if="favoriteInterfaces.length === 0" class="text-center py-12 text-gray-500">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <p class="text-lg">暂无收藏的接口</p>
      <p class="text-sm mt-2">点击接口卡片上的星标按钮添加收藏</p>
    </div>
    
    <div v-else class="grid grid-cols-2 gap-4">
      <ApiCard
        v-for="api in favoriteInterfaces"
        :key="api.id"
        :api="api"
        :category="getCategory(api.categoryId)"
        @click="handleOpenApi(api)"
        @toggle-favorite="handleToggleFavorite(api.id)"
      />
    </div>
    
    <div v-if="selectedApi && showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <span
              :class="[
                'px-2 py-1 text-xs font-bold rounded',
                methodColorClass(selectedApi.method)
              ]"
            >
              {{ selectedApi.method }}
            </span>
            <h3 class="text-lg font-semibold text-gray-800">{{ selectedApi.name }}</h3>
          </div>
          <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-4 grid grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="bg-gray-100 px-4 py-2 font-medium text-sm text-gray-700">
                基本信息
              </div>
              <div class="p-4 space-y-3">
                <div>
                  <span class="text-sm text-gray-500">接口路径:</span>
                  <p class="font-mono text-sm mt-1">{{ selectedApi.path }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">分类:</span>
                  <p class="text-sm mt-1">
                    {{ getCategory(selectedApi.categoryId)?.name || '未分类' }}
                  </p>
                </div>
                <div v-if="selectedApi.description">
                  <span class="text-sm text-gray-500">描述:</span>
                  <p class="text-sm mt-1">{{ selectedApi.description }}</p>
                </div>
              </div>
            </div>
            
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="bg-gray-100 px-4 py-2 font-medium text-sm text-gray-700">
                请求参数 ({{ selectedApi.parameters.length }})
              </div>
              <div v-if="selectedApi.parameters.length === 0" class="p-4 text-center text-sm text-gray-500">
                暂无参数
              </div>
              <div v-else class="p-4">
                <div class="space-y-2">
                  <div
                    v-for="param in selectedApi.parameters"
                    :key="param.id"
                    class="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div class="flex items-center gap-2">
                      <span class="px-1.5 py-0.5 text-xs bg-gray-200 rounded">{{ param.location.toUpperCase() }}</span>
                      <span class="font-mono text-sm">{{ param.name }}</span>
                      <span v-if="param.required" class="text-xs text-red-500">*</span>
                    </div>
                    <span class="text-xs text-gray-500">{{ param.type }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="bg-gray-100 px-4 py-2 font-medium text-sm text-gray-700">
                响应示例
              </div>
              <div class="p-4 bg-gray-50 max-h-64 overflow-auto">
                <pre class="text-xs text-gray-800 whitespace-pre-wrap">{{ selectedApi.responseExample || '暂无示例' }}</pre>
              </div>
            </div>
          </div>
          
          <div>
            <DebugPanel :api="selectedApi" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { ApiInterface } from '~/types';
import { useApiStore } from '~/stores/api';

const apiStore = useApiStore();

const showDetailModal = ref(false);
const selectedApi = ref<ApiInterface | null>(null);

onMounted(async () => {
  await apiStore.fetchCategories();
  await apiStore.fetchInterfaces();
});

const favoriteInterfaces = computed(() => {
  return apiStore.favoriteInterfaces;
});

const getCategory = (categoryId: string | null) => {
  if (!categoryId) return null;
  return apiStore.categories.find(cat => cat.id === categoryId) || null;
};

const methodColorClass = (method: ApiInterface['method']) => {
  const colors = {
    GET: 'bg-green-100 text-green-800',
    POST: 'bg-blue-100 text-blue-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
    PATCH: 'bg-purple-100 text-purple-800'
  };
  return colors[method] || 'bg-gray-100 text-gray-800';
};

const handleOpenApi = (api: ApiInterface) => {
  selectedApi.value = api;
  showDetailModal.value = true;
};

const handleToggleFavorite = async (id: string) => {
  try {
    await apiStore.toggleFavorite(id);
    if (selectedApi.value?.id === id) {
      selectedApi.value = apiStore.interfaces.find(api => api.id === id) || null;
    }
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
  }
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedApi.value = null;
};
</script>
