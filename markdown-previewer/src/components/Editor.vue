<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <div class="editor-container">
    <div class="editor-header">
      <h3>Markdown 编辑器</h3>
    </div>
    <textarea
      class="editor-textarea"
      :value="modelValue"
      @input="handleInput"
      placeholder="在这里输入 Markdown 内容..."
      spellcheck="false"
    ></textarea>
  </div>
</template>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid #e0e0e0;
}

.editor-header {
  padding: 12px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.editor-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.editor-textarea {
  flex: 1;
  width: 100%;
  padding: 16px;
  border: none;
  outline: none;
  resize: none;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  background: #fafafa;
  color: #333;
  box-sizing: border-box;
}

.editor-textarea::placeholder {
  color: #999;
}

@media (prefers-color-scheme: dark) {
  .editor-container {
    border-right-color: #333;
  }
  
  .editor-header {
    background: #1a1a1a;
    border-bottom-color: #333;
  }
  
  .editor-header h3 {
    color: #e0e0e0;
  }
  
  .editor-textarea {
    background: #0d0d0d;
    color: #e0e0e0;
  }
  
  .editor-textarea::placeholder {
    color: #666;
  }
}
</style>
