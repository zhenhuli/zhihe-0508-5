<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Birthday } from '~/types/birthday'
import { useBirthdayStore } from '~/stores/birthday'

const props = defineProps<{
  show: boolean
  editBirthday?: Birthday | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useBirthdayStore()

const name = ref('')
const date = ref('')
const note = ref('')
const isEditing = ref(false)

watch(() => props.show, (newVal) => {
  if (newVal && props.editBirthday) {
    name.value = props.editBirthday.name
    date.value = props.editBirthday.date
    note.value = props.editBirthday.note || ''
    isEditing.value = true
  } else if (newVal) {
    resetForm()
  }
}, { immediate: true })

watch(() => props.editBirthday, (newVal) => {
  if (newVal && props.show) {
    name.value = newVal.name
    date.value = newVal.date
    note.value = newVal.note || ''
    isEditing.value = true
  }
})

function resetForm() {
  name.value = ''
  date.value = ''
  note.value = ''
  isEditing.value = false
}

function handleSubmit() {
  if (!name.value || !date.value) {
    alert('请填写姓名和生日')
    return
  }

  if (isEditing.value && props.editBirthday) {
    store.updateBirthday(props.editBirthday.id, {
      name: name.value,
      date: date.value,
      note: note.value || undefined,
    })
  } else {
    store.addBirthday({
      name: name.value,
      date: date.value,
      note: note.value || undefined,
    })
  }

  resetForm()
  emit('close')
}

function handleClose() {
  resetForm()
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-black/50"
          @click="handleClose"
        ></div>

        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-800">
              {{ isEditing ? '编辑生日信息' : '添加好友生日' }}
            </h3>
            <button
              @click="handleClose"
              class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                姓名
              </label>
              <input
                v-model="name"
                type="text"
                placeholder="请输入姓名"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                生日
              </label>
              <input
                v-model="date"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                备注（可选）
              </label>
              <textarea
                v-model="note"
                rows="3"
                placeholder="添加一些备注..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            <div class="flex gap-3 pt-2">
              <button
                @click="handleSubmit"
                class="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                保存
              </button>
              <button
                @click="handleClose"
                class="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
