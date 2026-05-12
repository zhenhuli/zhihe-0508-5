<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (e) {}
    }
    return hljs.highlightAuto(code).value
  }
})

const renderedContent = computed(() => {
  return marked(props.content)
})
</script>

<template>
  <div class="preview-container">
    <div class="preview-header">
      <h3>预览</h3>
    </div>
    <div class="preview-content">
      <div class="markdown-body" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<style scoped>
.preview-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.preview-header {
  padding: 12px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.preview-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.preview-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
  background: #fff;
}

.markdown-body {
  max-width: 100%;
  line-height: 1.8;
}

@media (prefers-color-scheme: dark) {
  .preview-header {
    background: #1a1a1a;
    border-bottom-color: #333;
  }
  
  .preview-header h3 {
    color: #e0e0e0;
  }
  
  .preview-content {
    background: #0d0d0d;
  }
}
</style>
