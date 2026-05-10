<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: '求职进度跟踪工具',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: '记录和跟踪你的求职进度' }
  ]
})
</script>
