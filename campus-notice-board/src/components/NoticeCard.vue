<template>
  <div class="card notice-card" @click="goToDetail">
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <span class="tag" :class="tagClass">{{ notice.category }}</span>
        </div>
        <div class="media-content">
          <p class="title is-6">{{ notice.title }}</p>
          <p class="subtitle is-7 has-text-grey">{{ notice.author }}</p>
        </div>
      </div>
      <div class="content">
        <p class="content-preview">{{ notice.content }}</p>
        <p class="has-text-right is-size-7 has-text-grey-light">
          📅 {{ notice.date }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  notice: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const tagClass = computed(() => {
  const map = {
    '通知': 'is-info',
    '活动': 'is-success',
    '闲置': 'is-warning'
  }
  return map[props.notice.category] || 'is-light'
})

const goToDetail = () => {
  router.push(`/notice/${props.notice.id}`)
}
</script>

<style scoped>
.notice-card {
  margin-bottom: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.notice-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.tag {
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
}

.content-preview {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.6;
  max-height: calc(1.6em * 4);
  color: #4a4a4a;
}
</style>
