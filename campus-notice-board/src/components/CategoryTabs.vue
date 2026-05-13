<template>
  <div class="tabs is-boxed is-centered is-medium">
    <ul>
      <li
        v-for="cat in categories"
        :key="cat"
        :class="{ 'is-active': activeCategory === cat }"
        @click="$emit('change', cat)"
      >
        <a>
          <span class="icon" v-html="getIcon(cat)"></span>
          <span>{{ cat }}</span>
          <span class="tag is-rounded ml-2">{{ getCount(cat) }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  activeCategory: String,
  notices: Array
})

defineEmits(['change'])

const categories = ['全部', '通知', '活动', '闲置']

const getIcon = (cat) => {
  const icons = {
    '全部': '📋',
    '通知': '📢',
    '活动': '🎉',
    '闲置': '🛒'
  }
  return icons[cat] || ''
}

const getCount = (cat) => {
  if (cat === '全部') return props.notices.length
  return props.notices.filter(n => n.category === cat).length
}
</script>

<style scoped>
.tabs li {
  cursor: pointer;
}
</style>
