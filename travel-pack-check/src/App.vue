<script setup>
import { ref, computed } from 'vue'
import TravelTypeSelector from './components/TravelTypeSelector.vue'
import PackingList from './components/PackingList.vue'
import TravelTypeManager from './components/TravelTypeManager.vue'
import CategoryManager from './components/CategoryManager.vue'
import { travelTypes as defaultTravelTypes } from './data/travelTypes'
import { defaultCategories } from './data/categories'

const currentView = ref('pack')
const selectedType = ref(null)
const packingItems = ref([])
const travelTypes = ref([...defaultTravelTypes])
const categories = ref([...defaultCategories])

const currentTravelType = computed(() => {
  return travelTypes.value.find(t => t.id === selectedType.value)
})

const travelTypeName = computed(() => {
  return currentTravelType.value?.name || ''
})

const selectTravelType = (typeId) => {
  selectedType.value = typeId
  const type = travelTypes.value.find(t => t.id === typeId)
  if (type) {
    packingItems.value = type.items.map(item => ({
      ...item,
      checked: false,
      isCustom: false
    }))
  }
}

const toggleItem = (itemId) => {
  const item = packingItems.value.find(i => i.id === itemId)
  if (item) {
    item.checked = !item.checked
  }
}

const addCustomItem = (itemData) => {
  const newItem = {
    id: 'custom_' + Date.now(),
    name: itemData.name,
    category: itemData.category,
    checked: false,
    isCustom: true
  }
  packingItems.value.push(newItem)
}

const deleteItem = (itemId) => {
  packingItems.value = packingItems.value.filter(i => i.id !== itemId)
}

const addTravelType = (newType) => {
  travelTypes.value.push(newType)
}

const updateTravelType = (updatedType) => {
  const index = travelTypes.value.findIndex(t => t.id === updatedType.id)
  if (index !== -1) {
    travelTypes.value[index] = {
      ...travelTypes.value[index],
      name: updatedType.name,
      icon: updatedType.icon,
      items: updatedType.items
    }
    if (selectedType.value === updatedType.id) {
      packingItems.value = updatedType.items.map(item => ({
        ...item,
        checked: false,
        isCustom: false
      }))
    }
  }
}

const deleteTravelType = (typeId) => {
  travelTypes.value = travelTypes.value.filter(t => t.id !== typeId)
  if (selectedType.value === typeId) {
    selectedType.value = null
    packingItems.value = []
  }
}

const addCategory = (categoryName) => {
  if (!categories.value.includes(categoryName)) {
    categories.value.push(categoryName)
  }
}

const updateCategory = ({ index, name }) => {
  categories.value[index] = name
}

const deleteCategory = (index) => {
  categories.value.splice(index, 1)
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">🧳 旅行打包清单</h1>
      <p class="app-subtitle">选择旅行类型，轻松准备行李</p>
    </header>

    <nav class="app-nav">
      <button
        :class="['nav-btn', { active: currentView === 'pack' }]"
        @click="currentView = 'pack'"
      >
        📋 打包清单
      </button>
      <button
        :class="['nav-btn', { active: currentView === 'manage-types' }]"
        @click="currentView = 'manage-types'"
      >
        ✈️ 旅行类型管理
      </button>
      <button
        :class="['nav-btn', { active: currentView === 'manage-categories' }]"
        @click="currentView = 'manage-categories'"
      >
        🏷️ 分类管理
      </button>
    </nav>

    <main class="app-main">
      <div v-if="currentView === 'pack'">
        <TravelTypeSelector
          :travel-types="travelTypes"
          :selected-type="selectedType"
          @select="selectTravelType"
        />

        <PackingList
          v-if="selectedType"
          :items="packingItems"
          :travel-type-name="travelTypeName"
          :categories="categories"
          @toggle="toggleItem"
          @add="addCustomItem"
          @delete="deleteItem"
        />

        <div v-else class="empty-state">
          <div class="empty-icon">👆</div>
          <p>请选择一种旅行类型开始打包</p>
        </div>
      </div>

      <TravelTypeManager
        v-else-if="currentView === 'manage-types'"
        :travel-types="travelTypes"
        :categories="categories"
        @add="addTravelType"
        @update="updateTravelType"
        @delete="deleteTravelType"
      />

      <CategoryManager
        v-else-if="currentView === 'manage-categories'"
        :categories="categories"
        @add="addCategory"
        @update="updateCategory"
        @delete="deleteCategory"
      />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.app {
  min-height: 100vh;
}

.app-header {
  text-align: center;
  padding: 2rem 1rem 1rem;
  color: white;
}

.app-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.app-subtitle {
  font-size: 1rem;
  opacity: 0.9;
}

.app-nav {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 0 1rem 1.5rem;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 0.625rem 1.25rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.nav-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.app-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem 3rem;
}

.empty-state {
  background: white;
  border-radius: 1rem;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #6b7280;
  font-size: 1.125rem;
}
</style>
