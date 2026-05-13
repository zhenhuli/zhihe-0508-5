<script setup lang="ts">
import { ref } from 'vue'
import type { BirthdayWithInfo } from '~/types/birthday'
import { useBirthdayStore } from '~/stores/birthday'
import { storeToRefs } from 'pinia'

const store = useBirthdayStore()
const { enrichedBirthdays, todayBirthdays, upcomingBirthdays } = storeToRefs(store)

const showModal = ref(false)
const editingBirthday = ref<BirthdayWithInfo | null>(null)

function handleAdd() {
  editingBirthday.value = null
  showModal.value = true
}

function handleEdit(birthday: BirthdayWithInfo) {
  editingBirthday.value = birthday
  showModal.value = true
}

function handleModalClose() {
  showModal.value = false
  editingBirthday.value = null
}

useHead({
  title: '生日提醒',
})
</script>

<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          🎂 生日提醒
        </h1>
        <p class="text-gray-600">记录重要的日子，永远不错过</p>
      </div>

      <div class="flex justify-end gap-3 mb-4">
        <button
          @click="handleAdd"
          class="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <span>🎉</span>
          <span>添加生日</span>
        </button>
        <ExportButton />
      </div>

      <StatsCard />

      <div v-if="todayBirthdays.length > 0" class="mb-8">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🎉</span>
          <span>今天生日</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BirthdayCard
            v-for="birthday in todayBirthdays"
            :key="birthday.id"
            :birthday="birthday"
            @edit="handleEdit"
          />
        </div>
      </div>

      <div v-if="upcomingBirthdays.length > 0" class="mb-8">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>⏰</span>
          <span>即将到来（30天内）</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BirthdayCard
            v-for="birthday in upcomingBirthdays"
            :key="birthday.id"
            :birthday="birthday"
            @edit="handleEdit"
          />
        </div>
      </div>

      <div v-if="enrichedBirthdays.length > 0">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📋</span>
          <span>全部生日</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BirthdayCard
            v-for="birthday in enrichedBirthdays"
            :key="birthday.id"
            :birthday="birthday"
            @edit="handleEdit"
          />
        </div>
      </div>

      <div
        v-if="enrichedBirthdays.length === 0"
        class="text-center py-16 bg-white rounded-2xl shadow-md"
      >
        <div class="text-6xl mb-4">🎁</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">
          还没有记录
        </h3>
        <p class="text-gray-600">
          点击上方按钮添加第一个好友生日吧！
        </p>
      </div>
    </div>

    <BirthdayModal
      :show="showModal"
      :edit-birthday="editingBirthday"
      @close="handleModalClose"
    />
  </div>
</template>
