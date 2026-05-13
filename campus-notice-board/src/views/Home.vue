<template>
  <div class="app">
    <section class="hero is-info is-medium">
      <div class="hero-body has-text-centered">
        <p class="title is-1">🏫 校园公告看板</p>
        <p class="subtitle is-4 mt-3">Campus Notice Board</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-8">
            <div class="columns is-vcentered">
              <div class="column is-9">
                <SearchBar v-model="searchKeyword" />
              </div>
              <div class="column is-3">
                <button class="button is-success is-fullwidth is-medium" @click="goToCreate">
                  ➕ 发布公告
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-5">
          <CategoryTabs
            :active-category="activeCategory"
            :notices="notices"
            @change="activeCategory = $event"
          />
        </div>

        <div class="mt-5">
          <div v-if="filteredNotices.length === 0" class="notification is-warning is-light has-text-centered">
            <p class="is-size-5">🔍 没有找到相关公告</p>
            <p class="mt-2">试试其他关键词或切换分类吧</p>
          </div>
          <div v-else class="columns is-multiline">
            <div
              v-for="notice in filteredNotices"
              :key="notice.id"
              class="column is-4"
            >
              <NoticeCard :notice="notice" />
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NoticeCard from '../components/NoticeCard.vue'
import SearchBar from '../components/SearchBar.vue'
import CategoryTabs from '../components/CategoryTabs.vue'
import { useNoticeStore } from '../stores/noticeStore'

const router = useRouter()
const { notices } = useNoticeStore()

const searchKeyword = ref('')
const activeCategory = ref('全部')

const filteredNotices = computed(() => {
  let result = [...notices]

  result.sort((a, b) => new Date(b.date) - new Date(a.date))

  if (activeCategory.value !== '全部') {
    result = result.filter(n => n.category === activeCategory.value)
  }

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(n =>
      n.title.toLowerCase().includes(keyword) ||
      n.content.toLowerCase().includes(keyword) ||
      n.author.toLowerCase().includes(keyword)
    )
  }

  return result
})

const goToCreate = () => {
  router.push('/create')
}
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
</style>
