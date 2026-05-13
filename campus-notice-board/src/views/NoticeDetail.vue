<template>
  <div class="app">
    <section class="hero is-info is-small">
      <div class="hero-body">
        <div class="container">
          <button class="button is-light" @click="goBack">
            ← 返回列表
          </button>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-8">
            <div v-if="notice" class="detail-card">
              <div class="content">
                <div class="mb-4">
                  <span class="tag is-large" :class="tagClass">{{ notice.category }}</span>
                </div>
                <h1 class="title is-2">{{ notice.title }}</h1>
                <div class="subtitle is-6 has-text-grey mb-5">
                  <span>📝 {{ notice.author }}</span>
                  <span class="ml-4">📅 {{ notice.date }}</span>
                </div>
                <hr />
                <div class="content-body">
                  <p class="is-size-5 has-text-dark">{{ notice.content }}</p>
                </div>
              </div>
            </div>
            <div v-else class="notification is-danger has-text-centered">
              <p class="is-size-5">❌ 公告不存在</p>
              <button class="button is-danger mt-4" @click="goBack">返回列表</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer has-background-light">
      <div class="content has-text-centered">
        <p>
          <strong>校园公告看板</strong> - 让信息触手可及
        </p>
        <p class="is-size-7 mt-2">
          © 2024 校园公告看板系统
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNoticeStore } from '../stores/noticeStore'

const router = useRouter()
const route = useRoute()
const { getNoticeById } = useNoticeStore()

const notice = ref(null)

const tagClass = computed(() => {
  if (!notice.value) return ''
  const map = {
    '通知': 'is-info',
    '活动': 'is-success',
    '闲置': 'is-warning'
  }
  return map[notice.value.category] || 'is-light'
})

const goBack = () => {
  router.push('/')
}

onMounted(() => {
  notice.value = getNoticeById(route.params.id) || null
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.section {
  flex: 1;
}

.hero.is-info {
  background: linear-gradient(135deg, #3273dc 0%, #209cee 100%);
}

.detail-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.content-body {
  line-height: 2;
}
</style>
