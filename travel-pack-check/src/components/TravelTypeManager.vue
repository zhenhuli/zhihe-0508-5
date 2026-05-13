<template>
  <div class="travel-type-manager">
    <div class="manager-header">
      <h2>旅行类型管理</h2>
      <button @click="showAddModal = true" class="add-type-btn">+ 添加类型</button>
    </div>

    <div class="type-list">
      <div v-for="type in travelTypes" :key="type.id" class="type-item">
        <div class="type-info" @click="editType(type)">
          <span class="type-icon">{{ type.icon }}</span>
          <span class="type-name">{{ type.name }}</span>
          <span class="type-count">({{ type.items.length }} 个物品)</span>
        </div>
        <div class="type-actions">
          <button @click="editType(type)" class="edit-btn">编辑</button>
          <button @click="deleteType(type.id)" class="delete-btn">删除</button>
        </div>
      </div>
    </div>

    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditModal ? '编辑旅行类型' : '添加旅行类型' }}</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>名称</label>
            <input v-model="formData.name" type="text" placeholder="输入旅行类型名称" />
          </div>

          <div class="form-group">
            <label>图标 (emoji)</label>
            <input v-model="formData.icon" type="text" placeholder="例如: 🏖️" maxlength="2" />
          </div>

          <div class="form-group">
            <label>物品列表</label>
            <div class="items-editor">
              <div v-for="(item, index) in formData.items" :key="index" class="item-row">
                <input
                  v-model="item.name"
                  type="text"
                  placeholder="物品名称"
                  class="item-name-input"
                />
                <select v-model="item.category" class="item-category-select">
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
                <button @click="removeFormItem(index)" class="remove-item-btn">×</button>
              </div>
              <button @click="addFormItem" class="add-item-btn">+ 添加物品</button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="cancel-btn">取消</button>
          <button @click="saveType" class="save-btn">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { defaultCategories } from '../data/categories'

const props = defineProps({
  travelTypes: Array,
  categories: Array
})

const emit = defineEmits(['add', 'update', 'delete'])
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingTypeId = ref(null)

const formData = reactive({
  name: '',
  icon: '',
  items: []
})

const resetForm = () => {
  formData.name = ''
  formData.icon = ''
  formData.items = []
}

const editType = (type) => {
  editingTypeId.value = type.id
  formData.name = type.name
  formData.icon = type.icon
  formData.items = type.items.map(item => ({
    name: item.name,
    category: item.category
  }))
  showEditModal.value = true
}

const addFormItem = () => {
  formData.items.push({ name: '', category: '自定义' })
}

const removeFormItem = (index) => {
  formData.items.splice(index, 1)
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingTypeId.value = null
  resetForm()
}

const saveType = () => {
  if (!formData.name.trim()) return

  const validItems = formData.items.filter(item => item.name.trim())

  if (showEditModal.value) {
    emit('update', {
      id: editingTypeId.value,
      name: formData.name.trim(),
      icon: formData.icon || '✈️',
      items: validItems
    })
  } else {
    emit('add', {
      id: 'type_' + Date.now(),
      name: formData.name.trim(),
      icon: formData.icon || '✈️',
      items: validItems
    })
  }

  closeModal()
}

const deleteType = (typeId) => {
  if (confirm('确定要删除这个旅行类型吗？')) {
    emit('delete', typeId)
  }
}
</script>

<style scoped>
.travel-type-manager {
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

.add-type-btn {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.add-type-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.type-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.type-item:hover {
  background: #f3f4f6;
}

.type-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.type-icon {
  font-size: 1.5rem;
}

.type-name {
  font-weight: 500;
  color: #374151;
}

.type-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.type-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
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
  margin-bottom: 1.25rem;
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

.items-editor {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-row {
  display: flex;
  gap: 0.5rem;
}

.item-name-input {
  flex: 1;
}

.item-category-select {
  width: 120px;
  padding: 0.625rem 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
}

.remove-item-btn {
  width: 40px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 0.5rem;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-item-btn:hover {
  background: #fecaca;
}

.add-item-btn {
  padding: 0.625rem;
  border: 2px dashed #d1d5db;
  background: transparent;
  color: #6b7280;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.add-item-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
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
}
</style>
