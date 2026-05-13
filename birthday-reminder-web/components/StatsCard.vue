<script setup lang="ts">
import { useBirthdayStore } from '~/stores/birthday'

const store = useBirthdayStore()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <div class="bg-white rounded-2xl shadow-md p-5">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
          <span class="text-2xl">🎂</span>
        </div>
        <div>
          <div class="text-2xl font-bold text-gray-800">
            {{ store.todayBirthdays.length }}
          </div>
          <div class="text-sm text-gray-500">今天生日</div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-md p-5">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
          <span class="text-2xl">⏰</span>
        </div>
        <div>
          <div class="text-2xl font-bold text-gray-800">
            {{ store.upcomingBirthdays.length }}
          </div>
          <div class="text-sm text-gray-500">30天内生日</div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-md p-5">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <span class="text-2xl">👥</span>
        </div>
        <div>
          <div class="text-2xl font-bold text-gray-800">
            {{ store.birthdays.length }}
          </div>
          <div class="text-sm text-gray-500">总记录数</div>
        </div>
      </div>
    </div>
  </div>
</template>
