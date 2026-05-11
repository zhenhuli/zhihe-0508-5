<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-800">分类</h2>
      <button
        @click="$emit('add-category')"
        class="px-3 py-1 bg-primary-500 text-white text-sm rounded hover:bg-primary-600 transition-colors"
      >
        + 新建
      </button>
    </div>
    
    <div class="space-y-1">
      <button
        @click="$emit('select-category', null)"
        :class="[
          'w-full text-left px-3 py-2 rounded transition-colors text-sm',
          selectedCategoryId === null ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-100'
        ]"
      >
        <div class="flex items-center justify-between">
          <span>全部接口</span>
          <span class="text-xs text-gray-500">{{ totalCount }}</span>
        </div>
      </button>
      
      <button
        v-if="favoriteCount > 0"
        @click="$emit('select-favorites')"
        :class="[
          'w-full text-left px-3 py-2 rounded transition-colors text-sm',
          showFavorites ? 'bg-yellow-100 text-yellow-800' : 'hover:bg-gray-100'
        ]"
      >
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            收藏夹
          </span>
          <span class="text-xs text-gray-500">{{ favoriteCount }}</span>
        </div>
      </button>
      
      <div class="border-t border-gray-200 my-2"></div>
      
      <button
        v-for="category in categories"
        :key="category.id"
        @click="$emit('select-category', category.id)"
        :class="[
          'w-full text-left px-3 py-2 rounded transition-colors text-sm',
          selectedCategoryId === category.id ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-100'
        ]"
      >
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-2">
            <span
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: category.color }"
            ></span>
            {{ category.name }}
          </span>
          <span class="text-xs text-gray-500">
            {{ getCategoryCount(category.id) }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ApiCategory, ApiInterface } from '~/types';

const props = defineProps<{
  categories: ApiCategory[];
  interfaces: ApiInterface[];
  selectedCategoryId: string | null;
  showFavorites: boolean;
}>();

defineEmits<{
  (e: 'select-category', categoryId: string | null): void;
  (e: 'select-favorites'): void;
  (e: 'add-category'): void;
}>();

const totalCount = computed(() => props.interfaces.length);
const favoriteCount = computed(() => props.interfaces.filter(api => api.isFavorite).length);
const getCategoryCount = (categoryId: string) => {
  return props.interfaces.filter(api => api.categoryId === categoryId).length;
};
</script>
