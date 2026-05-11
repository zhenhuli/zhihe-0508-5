<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-800">接口管理</h2>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新建接口
      </button>
    </div>
    
    <div class="grid grid-cols-4 gap-6">
      <div class="col-span-1">
        <CategorySidebar
          :categories="apiStore.categories"
          :interfaces="apiStore.interfaces"
          :selected-category-id="selectedCategoryId"
          :show-favorites="false"
          @select-category="handleSelectCategory"
          @add-category="showCategoryModal = true"
        />
      </div>
      
      <div class="col-span-3">
        <div v-if="apiStore.loading" class="text-center py-12 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 text-primary-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          加载中...
        </div>
        
        <div v-else-if="filteredInterfaces.length === 0" class="text-center py-12 text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-lg">暂无接口</p>
          <button
            @click="showCreateModal = true"
            class="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            新建第一个接口
          </button>
        </div>
        
        <div v-else class="grid grid-cols-2 gap-4">
          <ApiCard
            v-for="api in filteredInterfaces"
            :key="api.id"
            :api="api"
            :category="getCategory(api.categoryId)"
            @click="handleOpenApi(api)"
            @toggle-favorite="handleToggleFavorite(api.id)"
          />
        </div>
      </div>
    </div>
    
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">
            {{ editingApi ? '编辑接口' : '新建接口' }}
          </h3>
          <button @click="closeCreateModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-4">
          <ApiForm
            ref="apiFormRef"
            :api="editingApi"
            :categories="apiStore.categories"
            @update="handleFormUpdate"
          />
        </div>
        
        <div class="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
          <button
            @click="closeCreateModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            @click="handleSaveApi"
            :disabled="!formData.name || !formData.path"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ editingApi ? '保存' : '创建' }}
          </button>
        </div>
      </div>
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
            
            <div class="flex gap-2">
              <button
                @click="handleEditApi"
                class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                编辑
              </button>
              <button
                @click="handleDeleteApi"
                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
          
          <div>
            <DebugPanel :api="selectedApi" />
          </div>
        </div>
      </div>
    </div>
    
    <CategoryModal
      :visible="showCategoryModal"
      @close="showCategoryModal = false"
      @submit="handleCreateCategory"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { ApiInterface } from '~/types';
import { useApiStore } from '~/stores/api';

const apiStore = useApiStore();
const apiFormRef = ref();

const selectedCategoryId = ref<string | null>(null);
const showCreateModal = ref(false);
const showDetailModal = ref(false);
const showCategoryModal = ref(false);
const selectedApi = ref<ApiInterface | null>(null);
const editingApi = ref<ApiInterface | null>(null);
const formData = ref({
  name: '',
  path: '',
  method: 'GET' as ApiInterface['method'],
  categoryId: null as string | null,
  description: '',
  parameters: [],
  responseExample: '',
  isFavorite: false
});

onMounted(async () => {
  await apiStore.fetchCategories();
  await apiStore.fetchInterfaces();
});

const filteredInterfaces = computed(() => {
  if (!selectedCategoryId.value) {
    return apiStore.interfaces;
  }
  return apiStore.interfaces.filter(api => api.categoryId === selectedCategoryId.value);
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

const handleSelectCategory = (categoryId: string | null) => {
  selectedCategoryId.value = categoryId;
};

const handleOpenApi = (api: ApiInterface) => {
  selectedApi.value = api;
  showDetailModal.value = true;
};

const handleToggleFavorite = async (id: string) => {
  try {
    await apiStore.toggleFavorite(id);
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
  }
};

const handleFormUpdate = (data: any) => {
  formData.value = data;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  editingApi.value = null;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedApi.value = null;
};

const handleSaveApi = async () => {
  if (!formData.value.name || !formData.value.path) return;
  
  try {
    if (editingApi.value) {
      await apiStore.updateInterface(editingApi.value.id, formData.value);
      if (selectedApi.value?.id === editingApi.value.id) {
        selectedApi.value = apiStore.interfaces.find(api => api.id === editingApi.value!.id) || null;
      }
    } else {
      await apiStore.createInterface(formData.value);
    }
    closeCreateModal();
  } catch (error) {
    console.error('Failed to save api:', error);
  }
};

const handleEditApi = () => {
  if (!selectedApi.value) return;
  editingApi.value = selectedApi.value;
  showDetailModal.value = false;
  showCreateModal.value = true;
};

const handleDeleteApi = async () => {
  if (!selectedApi.value) return;
  
  if (confirm(`确定要删除接口 "${selectedApi.value.name}" 吗？`)) {
    try {
      await apiStore.deleteInterface(selectedApi.value.id);
      closeDetailModal();
    } catch (error) {
      console.error('Failed to delete api:', error);
    }
  }
};

const handleCreateCategory = async (data: { name: string; description: string; color: string }) => {
  try {
    await apiStore.createCategory(data);
    showCategoryModal.value = false;
  } catch (error) {
    console.error('Failed to create category:', error);
  }
};
</script>
