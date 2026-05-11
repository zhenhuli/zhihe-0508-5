<template>
  <div
    class="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
    @click="$emit('click')"
  >
    <div class="flex items-start justify-between mb-2">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <span
            :class="[
              'px-2 py-1 text-xs font-bold rounded',
              methodColorClass
            ]"
          >
            {{ api.method }}
          </span>
          <h3 class="text-lg font-semibold text-gray-800">{{ api.name }}</h3>
        </div>
        <p class="text-sm text-gray-600 font-mono">{{ api.path }}</p>
        <p v-if="api.description" class="text-sm text-gray-500 mt-1 line-clamp-2">
          {{ api.description }}
        </p>
      </div>
      <button
        @click.stop="$emit('toggle-favorite')"
        class="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <svg
          :class="['w-5 h-5', api.isFavorite ? 'text-yellow-500' : 'text-gray-400']"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    </div>
    <div class="flex items-center justify-between text-xs text-gray-500 mt-3">
      <span v-if="category" :style="{ color: category.color }">
        {{ category.name }}
      </span>
      <span>{{ formatDate(api.updatedAt) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ApiInterface, ApiCategory } from '~/types';

const props = defineProps<{
  api: ApiInterface;
  category?: ApiCategory | null;
}>();

defineEmits<{
  (e: 'click'): void;
  (e: 'toggle-favorite'): void;
}>();

const methodColorClass = computed(() => {
  const colors = {
    GET: 'bg-green-100 text-green-800',
    POST: 'bg-blue-100 text-blue-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
    PATCH: 'bg-purple-100 text-purple-800'
  };
  return colors[props.api.method] || 'bg-gray-100 text-gray-800';
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
