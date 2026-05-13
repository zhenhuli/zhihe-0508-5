<template>
  <div class="category-manager">
    <div class="manager-header">
      <h2>物品分类管理</h2>
      <button @click="showAddModal = true" class="add-category-btn">+ 添加分类</button>
    </div>

    <div class="category-grid">
      <div
        v-for="(category, index) in categories"
        :key="index"
        class="category-card"
        :class="{ 'is-default': isDefaultCategory(category) }"
      >
        <span class="category-name">{{ category }}</span>
        <div class="category-actions">
          <span v-if="isDefaultCategory(category)" class="default-badge">默认</span>
          <button
            v-else
            @click="editCategory(index)"
            class="edit-btn"
          >
            编辑
          </button>
          <button
            v-if="!isDefaultCategory(category)"
            @click="deleteCategory(index)"
            class="delete-btn"
          >
            删除
          </button>
        </div>
      </div>
    </div>

    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditModal ? '编辑分类' : '添加分类' }}</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>分类名称</label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="输入分类名称"
              @keyup.enter="saveCategory"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="cancel-btn">取消</button>
          <button @click="saveCategory" class="save-btn">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { defaultCategories } from '../data/categories'

const props = defineProps({
  categories: Array
})

const emit = defineEmits(['add', 'update', 'delete'])

const showAddModal = ref(false)
const showEditModal = ref(false)
const editingIndex = ref(null)

const formData = reactive({
  name: ''
})

const isDefaultCategory = (category) => {
  return defaultCategories.includes(category)
}

const resetForm = () => {
  formData.name = ''
}

const editCategory = (index) => {
  editingIndex.value = index
  formData.name = props.categories[index]
  showEditModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingIndex.value = null
  resetForm()
}

const saveCategory = () => {
  if (!formData.name.trim()) return

  if (showEditModal.value) {
    emit('update', {
      index: editingIndex.value,
      name: formData.name.trim()
    })
  } else {
    emit('add', formData.name.trim())
  }

  closeModal()
}

const deleteCategory = (index) => {
  if (confirm('确定要删除这个分类吗？')) {
    emit('delete', index)
  }
}
</script>

<style scoped>
.category-manager {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.manager-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
}

.add-category-btn {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.add-category-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}

.category-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.category-card:hover {
  background: #f3f4f6;
}

.category-card.is-default {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.category-name {
  font-weight: 500;
  color: #374151;
  word-break: break-word;
}

.category-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.default-badge {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 0.25rem;
}

.edit-btn, .delete-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background: #dbeafe;
  color: #1d4ed8;
}

.edit-btn:hover {
  background: #bfdbfe;
}

.delete-btn {
  background: #fee2e2;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fecaca;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn, .save-btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.save-btn {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
}
</style>
