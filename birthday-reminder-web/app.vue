<script setup lang="ts">
import { useBirthdayStore } from '~/stores/birthday'

const store = useBirthdayStore()

onMounted(() => {
  store.loadFromStorage()
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
