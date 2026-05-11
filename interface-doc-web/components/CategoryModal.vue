<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">
          {{ isEdit ? '编辑分类' : '新建分类' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="p-4 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">分类名称</label>
          <input
            v-model="formData.name"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="请输入分类名称"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <textarea
            v-model="formData.description"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows="2"
            placeholder="请输入分类描述"
          ></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">颜色</label>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="color in colorOptions"
              :key="color"
              @click="formData.color = color"
              :class="[
                'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
                formData.color === color ? 'border-gray-800 scale-110' : 'border-transparent'
              ]"
              :style="{ backgroundColor: color }"
            ></button>
          </div>
        </div>
      </div>
      
      <div class="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          取消
        </button>
        <button
          @click="handleSubmit"
          :disabled="!formData.name"
          class="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isEdit ? '保存' : '创建' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { ApiCategory } from '~/types';

const props = defineProps<{
  visible: boolean;
  category?: ApiCategory | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', data: { name: string; description: string; color: string }): void;
}>();

const colorOptions = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

const formData = ref({
  name: '',
  description: '',
  color: colorOptions[0]
});

const isEdit = computed(() => !!props.category);

watch(() => props.visible, (newVal) => {
  if (newVal) {
    if (props.category) {
      formData.value = {
        name: props.category.name,
        description: props.category.description,
        color: props.category.color
      };
    } else {
      formData.value = {
        name: '',
        description: '',
        color: colorOptions[0]
      };
    }
  }
});

const handleSubmit = () => {
  if (!formData.value.name) return;
  emit('submit', { ...formData.value });
};
</script>
