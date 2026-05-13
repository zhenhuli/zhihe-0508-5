<template>
  <div class="packing-list" v-if="items.length > 0">
    <div class="list-header">
      <h2>{{ travelTypeName }} 打包清单</h2>
      <div class="progress">
        <span class="progress-text">{{ checkedCount }}/{{ items.length }} 已准备</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="add-item-form">
      <input
        v-model="newItemName"
        type="text"
        placeholder="添加自定义物品..."
        @keyup.enter="addCustomItem"
      />
      <select v-model="newItemCategory">
        <option value="自定义">自定义</option>
        <option value="衣物">衣物</option>
        <option value="鞋类">鞋类</option>
        <option value="电子设备">电子设备</option>
        <option value="个人护理">个人护理</option>
        <option value="其他">其他</option>
      </select>
      <button @click="addCustomItem" class="add-btn">添加</button>
    </div>

    <div class="items-container">
      <div v-for="(groupItems, category) in groupedItems" :key="category" class="category-group">
        <h3 class="category-title">{{ category }}</h3>
        <div class="items-list">
          <div
            v-for="item in groupItems"
            :key="item.id"
            :class="['item-card', { checked: item.checked }]"
            @click="toggleItem(item.id)"
          >
            <div class="checkbox">
              <span v-if="item.checked" class="check-icon">✓</span>
            </div>
            <span class="item-name">{{ item.name }}</span>
            <button
              v-if="item.isCustom"
              class="delete-btn"
              @click.stop="deleteItem(item.id)"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  items: Array,
  travelTypeName: String,
  categories: Array
})

const emit = defineEmits(['toggle', 'add', 'delete'])

const newItemName = ref('')
const newItemCategory = ref('自定义')

const groupedItems = computed(() => {
  const groups = {}
  props.items.forEach(item => {
    if (!groups[item.category]) {
      groups[item.category] = []
    }
    groups[item.category].push(item)
  })
  return groups
})

const checkedCount = computed(() => {
  return props.items.filter(item => item.checked).length
})

const progressPercent = computed(() => {
  if (props.items.length === 0) return 0
  return Math.round((checkedCount.value / props.items.length) * 100)
})

const toggleItem = (itemId) => {
  emit('toggle', itemId)
}

const addCustomItem = () => {
  if (!newItemName.value.trim()) return
  emit('add', {
    name: newItemName.value.trim(),
    category: newItemCategory.value
  })
  newItemName.value = ''
}

const deleteItem = (itemId) => {
  emit('delete', itemId)
}
</script>

<style scoped>
.packing-list {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.list-header {
  margin-bottom: 1.5rem;
}

.list-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.add-item-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.add-item-form input {
  flex: 1;
  padding: 0.625rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.add-item-form input:focus {
  outline: none;
  border-color: #3b82f6;
}

.add-item-form select {
  padding: 0.625rem 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}

.add-item-form select:focus {
  outline: none;
  border-color: #3b82f6;
}

.add-btn {
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.category-group {
  margin-bottom: 1.5rem;
}

.category-group:last-child {
  margin-bottom: 0;
}

.category-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.item-card:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.item-card.checked {
  background: #ecfdf5;
  opacity: 0.8;
}

.item-card.checked .item-name {
  text-decoration: line-through;
  color: #6b7280;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  transition: all 0.2s;
}

.item-card.checked .checkbox {
  background: #10b981;
  border-color: #10b981;
}

.check-icon {
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
}

.item-name {
  flex: 1;
  font-size: 0.875rem;
  color: #374151;
}

.delete-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: #fee2e2;
  color: #ef4444;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #ef4444;
  color: white;
}
</style>
