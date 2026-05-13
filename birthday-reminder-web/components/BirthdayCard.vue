<script setup lang="ts">
import type { BirthdayWithInfo } from '~/types/birthday'
import { useBirthdayStore } from '~/stores/birthday'

const props = defineProps<{
  birthday: BirthdayWithInfo
}>()

const emit = defineEmits<{
  (e: 'edit', birthday: BirthdayWithInfo): void
}>()

const store = useBirthdayStore()

function handleEdit() {
  emit('edit', props.birthday)
}

function handleDelete() {
  if (confirm(`确定要删除 ${props.birthday.name} 的生日信息吗？`)) {
    store.deleteBirthday(props.birthday.id)
  }
}
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 relative overflow-hidden"
    :class="{
      'ring-2 ring-pink-400 ring-offset-2': birthday.isToday,
    }"
  >
    <div
      v-if="birthday.isToday"
      class="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-bl-xl text-sm font-medium"
    >
      🎂 今天生日！
    </div>

    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-lg font-bold text-gray-800">{{ birthday.name }}</h3>
          <span class="text-2xl">{{ birthday.zodiacEmoji }}</span>
        </div>
        
        <div class="space-y-1 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <span>📅</span>
            <span>{{ birthday.date }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span>⭐</span>
            <span>{{ birthday.zodiac }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span>🎯</span>
            <span>{{ birthday.age }}岁</span>
          </div>
          <div v-if="birthday.note" class="flex items-start gap-2">
            <span>📝</span>
            <span class="line-clamp-2">{{ birthday.note }}</span>
          </div>
        </div>
      </div>

      <div class="text-right ml-4">
        <div
          class="text-3xl font-bold"
          :class="
            birthday.isToday
              ? 'text-pink-500'
              : birthday.daysUntil <= 7
              ? 'text-orange-500'
              : 'text-purple-500'
          "
        >
          {{ birthday.isToday ? '🎉' : birthday.daysUntil + '天' }}
        </div>
        <div class="text-xs text-gray-500 mt-1">
          {{ birthday.isToday ? '生日快乐！' : '距离生日' }}
        </div>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
      <button
        @click="handleEdit"
        class="text-blue-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
      >
        编辑
      </button>
      <button
        @click="handleDelete"
        class="text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
      >
        删除
      </button>
    </div>
  </div>
</template>
