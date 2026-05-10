<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">创建活动</h1>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-md p-8">
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            活动标题 *
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入活动标题"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            活动描述
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入活动描述"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            活动地点
          </label>
          <input
            v-model="form.location"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入活动地点"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            活动时间 *
          </label>
          <input
            v-model="form.date"
            type="datetime-local"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            报名截止时间 *
          </label>
          <input
            v-model="form.registrationDeadline"
            type="datetime-local"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            报名人数上限 *
          </label>
          <input
            v-model.number="form.maxParticipants"
            type="number"
            min="1"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入最大报名人数"
          />
        </div>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-start gap-2">
            <svg class="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 class="text-sm font-medium text-yellow-800">管理密码</h3>
              <p class="text-sm text-yellow-700 mt-1">设置管理密码后，只有输入正确密码才能查看报名列表（包含报名者姓名、邮箱、电话等隐私信息）</p>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            管理密码 * (至少4位)
          </label>
          <input
            v-model="form.adminPassword"
            type="password"
            required
            minlength="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请设置管理密码"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            确认管理密码 *
          </label>
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请再次输入管理密码"
          />
        </div>
      </div>

      <div class="mt-8 flex gap-4">
        <button
          type="submit"
          :disabled="loading"
          class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? '创建中...' : '创建活动' }}
        </button>
        <NuxtLink
          to="/"
          class="flex-1 text-center bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
        >
          取消
        </NuxtLink>
      </div>

      <p v-if="errorMsg" class="mt-4 text-red-500 text-center">{{ errorMsg }}</p>
      <p v-if="successMsg" class="mt-4 text-green-500 text-center">{{ successMsg }}</p>
    </form>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:9000/api'

const router = useRouter()
const form = ref({
  title: '',
  description: '',
  location: '',
  date: '',
  registrationDeadline: '',
  maxParticipants: 100,
  adminPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const handleSubmit = async () => {
  if (form.value.adminPassword !== form.value.confirmPassword) {
    errorMsg.value = '两次输入的管理密码不一致'
    return
  }

  if (form.value.adminPassword.length < 4) {
    errorMsg.value = '管理密码至少4位'
    return
  }

  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const response = await $fetch(`${API_BASE}/events`, {
      method: 'POST',
      body: {
        title: form.value.title,
        description: form.value.description,
        location: form.value.location,
        date: form.value.date,
        registrationDeadline: form.value.registrationDeadline,
        maxParticipants: form.value.maxParticipants,
        adminPassword: form.value.adminPassword
      }
    })

    successMsg.value = '活动创建成功！正在跳转...'
    
    const adminKey = `event_${response.id}_admin_password`
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(adminKey, form.value.adminPassword)
    }

    setTimeout(() => {
      router.push(`/event/${response.id}`)
    }, 1500)
  } catch (e) {
    console.error('创建活动失败:', e)
    errorMsg.value = e.data?.error || '创建活动失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>
