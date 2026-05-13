<template>
  <div class="field has-addons">
    <div class="control is-expanded">
      <input
        class="input is-medium"
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        placeholder="🔍 输入关键词搜索公告..."
      />
    </div>
    <div class="control">
      <button class="button is-info is-medium" @click="$emit('search')">
        搜索
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue', 'search'])
</script>
