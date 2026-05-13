<script setup lang="ts">
import { useBirthdayStore } from '~/stores/birthday'
import { exportToCSV, downloadCSV } from '~/utils/birthdayUtils'

const store = useBirthdayStore()

function handleExport() {
  if (store.enrichedBirthdays.length === 0) {
    alert('没有数据可以导出')
    return
  }

  const csvContent = exportToCSV(store.enrichedBirthdays)
  const today = new Date().toISOString().split('T')[0]
  downloadCSV(csvContent, `生日提醒_${today}.csv`)
}
</script>

<template>
  <button
    @click="handleExport"
    class="bg-white text-gray-700 py-2 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
  >
    <span class="text-xl">📥</span>
    <span>导出CSV</span>
  </button>
</template>
