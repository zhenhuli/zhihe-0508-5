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
            <div class="form-card">
              <h1 class="title is-3 mb-5">📝 发布新公告</h1>
              
              <form @submit.prevent="submitForm">
                <div class="field">
                  <label class="label">公告分类</label>
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select v-model="form.category" required>
                        <option value="">请选择分类</option>
                        <option value="通知">通知</option>
                        <option value="活动">活动</option>
                        <option value="闲置">闲置</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="field">
                  <label class="label">公告标题</label>
                  <div class="control">
                    <input 
                      class="input" 
                      type="text" 
                      v-model="form.title" 
                      placeholder="请输入公告标题"
                      required
                    />
                  </div>
                </div>

                <div class="field">
                  <label class="label">发布者</label>
                  <div class="control">
                    <input 
                      class="input" 
                      type="text" 
                      v-model="form.author" 
                      placeholder="请输入发布者名称"
                      required
                    />
                  </div>
                </div>

                <div class="field">
                  <label class="label">公告内容</label>
                  <div class="control">
                    <textarea 
                      class="textarea" 
                      v-model="form.content" 
                      placeholder="请输入公告详细内容..."
                      rows="8"
                      required
                    ></textarea>
                  </div>
                </div>

                <div class="field is-grouped is-grouped-right">
                  <div class="control">
                    <button type="button" class="button is-light" @click="goBack">
                      取消
                    </button>
                  </div>
                  <div class="control">
                    <button type="submit" class="button is-info">
                      ✅ 发布公告
                    </button>
                  </div>
                </div>
              </form>
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
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useNoticeStore } from '../stores/noticeStore'

const router = useRouter()
const { addNotice } = useNoticeStore()

const form = reactive({
  category: '',
  title: '',
  author: '',
  content: ''
})

const goBack = () => {
  router.push('/')
}

const submitForm = () => {
  addNotice({
    category: form.category,
    title: form.title,
    author: form.author,
    content: form.content
  })
  
  alert('公告发布成功！')
  goBack()
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

.form-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
</style>
