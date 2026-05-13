<template>
  <div :class="{ 'dark': isDark }">
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, provide } from 'vue'

const isDark = ref(false)

provide('isDark', isDark)

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

watch(isDark, (newVal) => {
  if (newVal) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
})
</script>

<style>
html, body, #app {
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
