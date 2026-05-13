<template>
  <div class="travel-type-selector">
    <h2>选择旅行类型</h2>
    <div class="type-grid">
      <button
        v-for="type in travelTypes"
        :key="type.id"
        :class="['type-card', { active: selectedType === type.id }]"
        @click="selectType(type.id)"
      >
        <span class="icon">{{ type.icon }}</span>
        <span class="name">{{ type.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedType: String,
  travelTypes: Array
})

const emit = defineEmits(['select'])

const selectType = (typeId) => {
  emit('select', typeId)
}
</script>

<style scoped>
.travel-type-selector {
  margin-bottom: 2rem;
}

.travel-type-selector h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.type-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.type-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.type-card.active {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.type-card .icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.type-card .name {
  font-weight: 500;
  color: #374151;
}
</style>
