<script setup>
import { ref } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import Editor from './components/Editor.vue'
import Preview from './components/Preview.vue'

const viewMode = ref('split')
const showExportMenu = ref(false)

const toggleMode = (mode) => {
  viewMode.value = mode
}

const closeExportMenu = (e) => {
  if (!e.target.closest('.export-dropdown')) {
    showExportMenu.value = false
  }
}

if (typeof window !== 'undefined') {
  document.addEventListener('click', closeExportMenu)
}

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

const renderedContent = () => {
  return marked(markdownContent.value)
}

const defaultContent = `# Markdown 预览工具

欢迎使用在线 Markdown 预览工具！

## 功能特点

- ✅ **实时预览** - 左侧编辑，右侧实时渲染
- ✅ **代码高亮** - 支持多种编程语言
- ✅ **导出 HTML** - 一键导出为 HTML 文件

## 代码示例

\`\`\`javascript
function hello() {
  console.log('Hello, Markdown!')
  return 'Welcome to the previewer'
}
\`\`\`

\`\`\`python
def greet(name):
    return f"Hello, {name}!"
    
print(greet("World"))
\`\`\`

## 引用

> 这是一段引用文本
> 可以有多行

## 列表

### 无序列表
- 项目一
- 项目二
  - 子项目 A
  - 子项目 B

### 有序列表
1. 第一步
2. 第二步
3. 第三步

## 表格

| 功能 | 状态 |
|------|------|
| 编辑 | ✅ |
| 预览 | ✅ |
| 导出 | ✅ |

---

**开始编辑吧！**
`

const markdownContent = ref(defaultContent)

const exportMarkdown = () => {
  const blob = new Blob([markdownContent.value], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'document.md'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const exportHTML = () => {
  const htmlContent = marked(markdownContent.value)
  
  const fullHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown 导出</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
  <style>
    body {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.8;
      color: #333;
    }
    h1, h2, h3 { margin-top: 1.5em; margin-bottom: 0.5em; }
    h1 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    code { font-family: 'Monaco', 'Menlo', monospace; font-size: 0.9em; }
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
    pre code { background: transparent; padding: 0; }
    blockquote { border-left: 4px solid #dfe2e5; padding-left: 1em; margin-left: 0; color: #6a737d; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #dfe2e5; padding: 8px 12px; }
    th { background: #f6f8fa; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    img { max-width: 100%; }
    ul, ol { padding-left: 2em; }
    hr { border: none; border-top: 1px solid #eaecef; margin: 2em 0; }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`
  
  const blob = new Blob([fullHTML], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'markdown-export.html'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>Markdown 预览工具</h1>
      <div class="header-actions">
        <div class="mode-toggle">
          <button 
            class="mode-btn" 
            :class="{ active: viewMode === 'split' }"
            @click="toggleMode('split')"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="3" x2="12" y2="21"></line>
            </svg>
            分栏
          </button>
          <button 
            class="mode-btn" 
            :class="{ active: viewMode === 'unified' }"
            @click="toggleMode('unified')"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <path d="M9 3v18"></path>
            </svg>
            一体
          </button>
        </div>
        <div class="export-dropdown">
          <button class="export-btn" @click="showExportMenu = !showExportMenu">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            导出
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div v-if="showExportMenu" class="export-menu" @click="showExportMenu = false">
            <button class="export-menu-item" @click="exportMarkdown">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              Markdown (.md)
            </button>
            <button class="export-menu-item" @click="exportHTML">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
              HTML (.html)
            </button>
          </div>
        </div>
      </div>
    </header>
    <main class="app-main" :class="viewMode">
      <template v-if="viewMode === 'split'">
        <div class="editor-wrapper">
          <Editor v-model="markdownContent" />
        </div>
        <div class="preview-wrapper">
          <Preview :content="markdownContent" />
        </div>
      </template>
      <template v-else>
        <div class="unified-wrapper">
          <div class="unified-header">
            <h3>编辑预览一体化</h3>
          </div>
          <div class="unified-content">
            <textarea
              class="unified-editor"
              v-model="markdownContent"
              placeholder="在这里输入 Markdown 内容..."
              spellcheck="false"
            ></textarea>
            <div class="unified-preview">
              <div class="markdown-body" v-html="renderedContent()"></div>
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.app-header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mode-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  padding: 2px;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.mode-btn.active {
  color: #667eea;
  background: white;
}

.export-dropdown {
  position: relative;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.export-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.export-btn:active {
  transform: translateY(0);
}

.export-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 6px;
  z-index: 100;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.export-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
}

.export-menu-item:hover {
  background: #f5f5f5;
}

@media (prefers-color-scheme: dark) {
  .export-menu {
    background: #1a1a1a;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }
  
  .export-menu-item {
    color: #e0e0e0;
  }
  
  .export-menu-item:hover {
    background: #2a2a2a;
  }
}

.app-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.app-main.split {
  flex-direction: row;
}

.app-main.unified {
  flex-direction: column;
}

.editor-wrapper,
.preview-wrapper {
  flex: 1;
  min-width: 0;
}

.unified-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.unified-header {
  padding: 12px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.unified-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.unified-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.unified-editor {
  flex: 1;
  width: 50%;
  padding: 20px;
  border: none;
  border-right: 1px solid #e0e0e0;
  outline: none;
  resize: none;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.8;
  background: #fafafa;
  color: #333;
  box-sizing: border-box;
}

.unified-editor::placeholder {
  color: #999;
}

.unified-preview {
  flex: 1;
  width: 50%;
  overflow: auto;
  padding: 20px 40px;
  background: #fff;
}

@media (prefers-color-scheme: dark) {
  .unified-header {
    background: #1a1a1a;
    border-bottom-color: #333;
  }
  
  .unified-header h3 {
    color: #e0e0e0;
  }
  
  .unified-editor {
    background: #0d0d0d;
    color: #e0e0e0;
    border-right-color: #333;
  }
  
  .unified-editor::placeholder {
    color: #666;
  }
  
  .unified-preview {
    background: #0d0d0d;
  }
}

@media (max-width: 768px) {
  .app-main.split {
    flex-direction: column;
  }
  
  .editor-wrapper {
    height: 50%;
  }
  
  .preview-wrapper {
    height: 50%;
  }
  
  .unified-content {
    flex-direction: column;
  }
  
  .unified-editor {
    width: 100%;
    height: 50%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .unified-preview {
    width: 100%;
    height: 50%;
  }
  
  .app-header {
    padding: 12px 16px;
  }
  
  .app-header h1 {
    font-size: 16px;
  }
  
  .header-actions {
    gap: 8px;
  }
  
  .mode-btn {
    padding: 6px 8px;
    font-size: 12px;
  }
  
  .mode-btn svg {
    display: none;
  }
  
  .export-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>
