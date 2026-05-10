<template>
  <div>
    <NuxtLink to="/" class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      返回活动列表
    </NuxtLink>

    <div v-if="loading" class="bg-white rounded-lg shadow-md p-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
      <p class="mt-4 text-gray-500">加载中...</p>
    </div>

    <div v-else-if="!event" class="bg-white rounded-lg shadow-md p-8 text-center">
      <p class="text-gray-500 text-lg">活动不存在</p>
      <NuxtLink to="/" class="inline-block mt-4 text-blue-600 hover:text-blue-700">
        返回活动列表
      </NuxtLink>
    </div>

    <div v-else class="space-y-6">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-8">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-800">{{ event.title }}</h1>
              <span
                :class="[
                  'inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium',
                  event.isClosed
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-green-100 text-green-600'
                ]"
              >
                {{ event.isClosed ? '报名已结束' : '报名进行中' }}
              </span>
            </div>
            
            <div class="flex gap-2">
              <button
                v-if="!isAdmin"
                @click="showAdminModal = true"
                class="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                管理员登录
              </button>
              <div v-if="isAdmin" class="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                管理员视图
              </div>
            </div>
          </div>

          <div v-if="event.description" class="mb-8">
            <h2 class="text-lg font-semibold text-gray-700 mb-2">活动描述</h2>
            <p class="text-gray-600 whitespace-pre-wrap">{{ event.description }}</p>
          </div>

          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-500 mb-1">活动时间</h3>
              <p class="text-gray-800">{{ formatDate(event.date) }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-500 mb-1">报名截止</h3>
              <p class="text-gray-800">{{ formatDate(event.registrationDeadline) }}</p>
            </div>
            <div v-if="event.location" class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-500 mb-1">活动地点</h3>
              <p class="text-gray-800">{{ event.location }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-500 mb-1">报名情况</h3>
              <p class="text-gray-800">{{ event.currentParticipants }} / {{ event.maxParticipants }} 人</p>
              <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all"
                  :style="{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <div v-if="!event.isClosed" class="border-t pt-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">立即报名</h2>
            <form @submit.prevent="handleRegister" class="max-w-md space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  姓名 *
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入您的姓名"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  邮箱 *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入您的邮箱"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  手机号 *
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入您的手机号"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  备注
                </label>
                <textarea
                  v-model="form.note"
                  rows="2"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="如有特殊需求请在此说明"
                ></textarea>
              </div>
              <button
                type="submit"
                :disabled="registerLoading"
                class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ registerLoading ? '提交中...' : '确认报名' }}
              </button>
              <p v-if="registerError" class="text-red-500 text-center">{{ registerError }}</p>
              <p v-if="registerSuccess" class="text-green-500 text-center">报名成功！</p>
            </form>
          </div>

          <div v-else class="border-t pt-8">
            <div class="bg-gray-50 rounded-lg p-6 text-center">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 class="text-xl font-semibold text-gray-800 mb-2">报名已结束</h2>
              <p class="text-gray-500">
                {{ event.currentParticipants >= event.maxParticipants ? '名额已满' : '已过报名截止时间' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isAdmin" class="bg-white rounded-lg shadow-md p-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">
            报名列表（{{ registrations.length }}人）
          </h2>
          <div class="flex gap-2">
            <button
              v-if="registrations.length > 0"
              @click="downloadCSV"
              class="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              下载 CSV
            </button>
            <button
              @click="loadRegistrations"
              class="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
            >
              刷新
            </button>
          </div>
        </div>
        
        <div v-if="registrationsLoading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-6 w-6 border-4 border-blue-600 border-t-transparent"></div>
          <p class="mt-2 text-gray-500 text-sm">加载报名列表中...</p>
        </div>

        <div v-else-if="registrations.length === 0" class="text-center py-8 text-gray-500">
          暂无报名记录
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left font-medium text-gray-600">#</th>
                <th class="px-4 py-3 text-left font-medium text-gray-600">姓名</th>
                <th class="px-4 py-3 text-left font-medium text-gray-600">邮箱</th>
                <th class="px-4 py-3 text-left font-medium text-gray-600">电话</th>
                <th class="px-4 py-3 text-left font-medium text-gray-600">备注</th>
                <th class="px-4 py-3 text-left font-medium text-gray-600">报名时间</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="(reg, index) in registrations" :key="reg.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-gray-500">{{ index + 1 }}</td>
                <td class="px-4 py-3 text-gray-800 font-medium">{{ reg.name }}</td>
                <td class="px-4 py-3 text-gray-600">{{ reg.email }}</td>
                <td class="px-4 py-3 text-gray-600">{{ reg.phone }}</td>
                <td class="px-4 py-3 text-gray-600">{{ reg.note || '-' }}</td>
                <td class="px-4 py-3 text-gray-500">{{ formatDate(reg.registeredAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      v-if="showAdminModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showAdminModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">管理员验证</h3>
          <button
            @click="showAdminModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p class="text-gray-600 mb-4 text-sm">
          请输入管理密码以查看报名列表（包含报名者的隐私信息）
        </p>

        <form @submit.prevent="handleAdminVerify">
          <div class="mb-4">
            <input
              v-model="adminPasswordInput"
              type="password"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入管理密码"
            />
          </div>

          <button
            type="submit"
            :disabled="adminVerifying"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ adminVerifying ? '验证中...' : '验证' }}
          </button>

          <p v-if="adminVerifyError" class="mt-3 text-red-500 text-center text-sm">{{ adminVerifyError }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const eventId = route.params.id

const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:9000/api'

const event = ref(null)
const loading = ref(true)

const form = ref({
  name: '',
  email: '',
  phone: '',
  note: ''
})

const registerLoading = ref(false)
const registerError = ref('')
const registerSuccess = ref(false)

const isAdmin = ref(false)
const showAdminModal = ref(false)
const adminPasswordInput = ref('')
const adminVerifying = ref(false)
const adminVerifyError = ref('')

const registrations = ref([])
const registrationsLoading = ref(false)

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStoredAdminPassword = () => {
  if (typeof localStorage === 'undefined') return null
  const key = `event_${eventId}_admin_password`
  return localStorage.getItem(key)
}

const storeAdminPassword = (password) => {
  if (typeof localStorage === 'undefined') return
  const key = `event_${eventId}_admin_password`
  localStorage.setItem(key, password)
}

const fetchEvent = async () => {
  loading.value = true
  try {
    const data = await $fetch(`${API_BASE}/events/${eventId}`)
    event.value = data
    
    const storedPassword = getStoredAdminPassword()
    if (storedPassword) {
      try {
        const result = await $fetch(`${API_BASE}/events/${eventId}/verify-admin`, {
          method: 'POST',
          body: { adminPassword: storedPassword }
        })
        if (result.success) {
          isAdmin.value = true
          await loadRegistrations()
        }
      } catch (e) {
        console.log('Stored password invalid')
      }
    }
  } catch (e) {
    console.error('获取活动详情失败:', e)
    event.value = null
  } finally {
    loading.value = false
  }
}

const loadRegistrations = async () => {
  if (!isAdmin.value) return
  
  registrationsLoading.value = true
  try {
    const password = getStoredAdminPassword()
    if (!password) {
      isAdmin.value = false
      return
    }
    
    const data = await $fetch(`${API_BASE}/events/${eventId}/registrations`, {
      method: 'POST',
      body: { adminPassword: password }
    })
    registrations.value = data
  } catch (e) {
    console.error('加载报名列表失败:', e)
    if (e.response?.status === 401) {
      isAdmin.value = false
    }
  } finally {
    registrationsLoading.value = false
  }
}

const handleAdminVerify = async () => {
  adminVerifying.value = true
  adminVerifyError.value = ''

  try {
    const result = await $fetch(`${API_BASE}/events/${eventId}/verify-admin`, {
      method: 'POST',
      body: { adminPassword: adminPasswordInput.value }
    })
    
    if (result.success) {
      isAdmin.value = true
      storeAdminPassword(adminPasswordInput.value)
      showAdminModal.value = false
      adminPasswordInput.value = ''
      await loadRegistrations()
    }
  } catch (e) {
    console.error('验证失败:', e)
    adminVerifyError.value = e.data?.error || '验证失败，请重试'
  } finally {
    adminVerifying.value = false
  }
}

const escapeCSV = (value) => {
  if (value === null || value === undefined || value === '') return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

const downloadCSV = () => {
  if (registrations.value.length === 0) return

  const headers = ['序号', '姓名', '邮箱', '电话', '备注', '报名时间']
  const rows = registrations.value.map((reg, index) => [
    index + 1,
    reg.name,
    reg.email,
    reg.phone,
    reg.note || '',
    formatDate(reg.registeredAt)
  ])

  const csvContent = [
    headers,
    ...rows
  ].map(row => row.map(escapeCSV).join(',')).join('\n')

  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  const eventTitle = event.value?.title || '活动'
  const dateStr = new Date().toISOString().slice(0, 10)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${eventTitle}_报名列表_${dateStr}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const handleRegister = async () => {
  registerLoading.value = true
  registerError.value = ''
  registerSuccess.value = false

  try {
    await $fetch(`${API_BASE}/events/${eventId}/register`, {
      method: 'POST',
      body: form.value
    })

    registerSuccess.value = true
    form.value = { name: '', email: '', phone: '', note: '' }
    
    await fetchEvent()
  } catch (e) {
    console.error('报名失败:', e)
    registerError.value = e.data?.error || '报名失败，请重试'
  } finally {
    registerLoading.value = false
  }
}

onMounted(() => {
  fetchEvent()
})
</script>
