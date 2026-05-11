<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">接口名称 *</label>
      <input
        v-model="formData.name"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        placeholder="请输入接口名称"
      />
    </div>
    
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">请求方式 *</label>
        <select
          v-model="formData.method"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
        <select
          v-model="formData.categoryId"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option :value="null">未分类</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">接口路径 *</label>
      <input
        v-model="formData.path"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        placeholder="例如：/api/users/:id"
      />
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
      <textarea
        v-model="formData.description"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        rows="2"
        placeholder="请输入接口描述"
      ></textarea>
    </div>
    
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="block text-sm font-medium text-gray-700">请求参数</label>
        <button
          @click="addParameter"
          class="px-3 py-1 text-xs bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
        >
          + 添加参数
        </button>
      </div>
      
      <div v-if="formData.parameters.length === 0" class="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded">
        暂无参数，点击上方按钮添加
      </div>
      
      <div v-else class="space-y-2">
        <div
          v-for="(param, index) in formData.parameters"
          :key="param.id"
          class="flex items-start gap-2 p-3 bg-gray-50 rounded border border-gray-200"
        >
          <div class="flex-1 grid grid-cols-5 gap-2">
            <input
              v-model="param.name"
              type="text"
              class="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="参数名"
            />
            <select
              v-model="param.location"
              class="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="query">Query</option>
              <option value="body">Body</option>
              <option value="path">Path</option>
              <option value="header">Header</option>
            </select>
            <input
              v-model="param.type"
              type="text"
              class="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="类型"
            />
            <input
              v-model="param.description"
              type="text"
              class="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="描述"
            />
            <div class="flex items-center gap-1">
              <label class="flex items-center text-xs">
                <input type="checkbox" v-model="param.required" class="mr-1" />
                必填
              </label>
              <button
                @click="removeParameter(index)"
                class="ml-auto p-1 text-red-500 hover:bg-red-100 rounded"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">响应示例 (JSON)</label>
      <textarea
        v-model="formData.responseExample"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
        rows="6"
        placeholder='{"code": 200, "message": "success"}'
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { ApiInterface, ApiCategory, ApiParameter } from '~/types';

const props = defineProps<{
  api?: ApiInterface | null;
  categories: ApiCategory[];
}>();

const emit = defineEmits<{
  (e: 'update', data: any): void;
}>();

const defaultFormData = () => ({
  name: '',
  path: '',
  method: 'GET' as ApiInterface['method'],
  categoryId: null as string | null,
  description: '',
  parameters: [] as ApiParameter[],
  responseExample: '',
  isFavorite: false
});

const formData = ref(defaultFormData());

watch(() => props.api, (newVal) => {
  if (newVal) {
    formData.value = {
      name: newVal.name,
      path: newVal.path,
      method: newVal.method,
      categoryId: newVal.categoryId,
      description: newVal.description,
      parameters: [...newVal.parameters],
      responseExample: newVal.responseExample,
      isFavorite: newVal.isFavorite
    };
  } else {
    formData.value = defaultFormData();
  }
}, { immediate: true });

watch(formData, (newVal) => {
  emit('update', newVal);
}, { deep: true });

const addParameter = () => {
  formData.value.parameters.push({
    id: Date.now().toString(),
    name: '',
    type: 'string',
    required: false,
    description: '',
    location: 'query'
  });
};

const removeParameter = (index: number) => {
  formData.value.parameters.splice(index, 1);
};

const isValid = computed(() => {
  return formData.value.name && formData.value.path;
});

defineExpose({
  isValid,
  formData
});
</script>
