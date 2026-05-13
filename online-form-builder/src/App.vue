<template>
  <div class="container-fluid py-4">
    <h1 class="text-center mb-4">在线表单生成器</h1>
    
    <div class="row g-4">
      <div class="col-md-3">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">组件库</h5>
          </div>
          <div class="card-body">
            <div
              v-for="component in componentList"
              :key="component.type"
              class="component-item p-3 mb-2 border rounded cursor-move bg-light"
              draggable="true"
              @dragstart="onDragStart($event, component)"
            >
              <i :class="component.icon" class="me-2"></i>
              {{ component.name }}
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-5">
        <div class="card shadow">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">表单设计区</h5>
          </div>
          <div
            class="card-body form-canvas min-h-400"
            @dragover.prevent="onDragOver"
            @drop="onDrop"
          >
            <div
              v-if="formItems.length === 0"
              class="text-center text-muted py-5"
            >
              将左侧组件拖拽到此处
            </div>
            <div
              v-for="(item, index) in formItems"
              :key="item.id"
              class="form-item-wrapper mb-3 p-3 border rounded position-relative"
              :class="{ 'border-primary': selectedItem === item }"
              @click="selectItem(item)"
            >
              <button
                class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                @click.stop="removeItem(index)"
              >
                &times;
              </button>
              <component :is="item.component" :item="item" :preview="false" />
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card shadow mb-4">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">组件配置</h5>
          </div>
          <div class="card-body">
            <div v-if="selectedItem">
              <div class="mb-3">
                <label class="form-label">标签名称</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="selectedItem.label"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">占位符</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="selectedItem.placeholder"
                />
              </div>
              <div class="form-check mb-3">
                <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="selectedItem.required"
                  id="requiredCheck"
                />
                <label class="form-check-label" for="requiredCheck">
                  必填项
                </label>
              </div>
              <div v-if="selectedItem.options">
                <label class="form-label">选项（每行一个）</label>
                <textarea
                  class="form-control"
                  rows="4"
                  v-model="selectedItem.optionsText"
                  @input="updateOptions"
                ></textarea>
              </div>
            </div>
            <div v-else class="text-center text-muted py-3">
              点击表单中的组件进行配置
            </div>
          </div>
        </div>

        <div class="card shadow mb-4">
          <div class="card-header bg-warning text-white">
            <h5 class="mb-0">实时预览</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent>
              <div v-for="item in formItems" :key="item.id" class="mb-3">
                <component :is="item.component" :item="item" :preview="true" />
              </div>
              <button v-if="formItems.length > 0" type="submit" class="btn btn-primary w-100">
                提交表单
              </button>
            </form>
          </div>
        </div>

        <div class="card shadow mb-4">
          <div class="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">HTML 代码预览</h5>
            <button
              v-if="formItems.length > 0"
              class="btn btn-sm btn-light"
              @click="copyHTML"
            >
              复制代码
            </button>
          </div>
          <div class="card-body p-0">
            <pre class="bg-dark text-light p-3 m-0" style="font-size: 12px; max-height: 400px; overflow: auto; white-space: pre-wrap; word-break: break-all;">
{{ generatedHTML }}
            </pre>
          </div>
        </div>

        <button class="btn btn-success w-100" @click="exportHTML">
          导出 HTML 代码
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import FormInput from './components/FormInput.vue';
import FormRadio from './components/FormRadio.vue';
import FormCheckbox from './components/FormCheckbox.vue';

export default {
  name: 'App',
  components: {
    FormInput,
    FormRadio,
    FormCheckbox
  },
  data() {
    return {
      componentList: [
        { type: 'input', name: '输入框', icon: 'bi bi-input-cursor-text', component: 'FormInput' },
        { type: 'radio', name: '单选框', icon: 'bi bi-ui-radios', component: 'FormRadio' },
        { type: 'checkbox', name: '多选框', icon: 'bi bi-ui-checks', component: 'FormCheckbox' }
      ],
      draggedComponent: null,
      formItems: [],
      selectedItem: null,
      itemIdCounter: 0
    };
  },
  computed: {
    generatedHTML() {
      if (this.formItems.length === 0) {
        return '<!-- 添加组件后将在此处显示 HTML 代码 -->';
      }
      return this.generateHTMLContent();
    }
  },
  methods: {
    generateHTMLContent() {
      let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>生成的表单</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container py-5">
    <h2 class="mb-4">表单</h2>
    <form>
`;
      this.formItems.forEach(item => {
        html += this.generateItemHTML(item);
      });
      html += `
      <button type="submit" class="btn btn-primary">提交</button>
    </form>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"><\/script>
</body>
</html>`;
      return html;
    },
    onDragStart(event, component) {
      this.draggedComponent = component;
      event.dataTransfer.effectAllowed = 'copy';
    },
    onDragOver(event) {
      event.dataTransfer.dropEffect = 'copy';
    },
    onDrop(event) {
      if (this.draggedComponent) {
        const newItem = this.createFormItem(this.draggedComponent);
        this.formItems.push(newItem);
        this.selectedItem = newItem;
        this.draggedComponent = null;
      }
    },
    createFormItem(component) {
      this.itemIdCounter++;
      const baseItem = {
        id: this.itemIdCounter,
        type: component.type,
        component: component.component,
        label: component.name,
        placeholder: '',
        required: false
      };

      if (component.type === 'radio' || component.type === 'checkbox') {
        baseItem.options = ['选项 1', '选项 2', '选项 3'];
        baseItem.optionsText = '选项 1\n选项 2\n选项 3';
      }

      return baseItem;
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    removeItem(index) {
      if (this.selectedItem === this.formItems[index]) {
        this.selectedItem = null;
      }
      this.formItems.splice(index, 1);
    },
    updateOptions() {
      if (this.selectedItem && this.selectedItem.optionsText) {
        this.selectedItem.options = this.selectedItem.optionsText
          .split('\n')
          .filter(opt => opt.trim());
      }
    },
    async copyHTML() {
      try {
        await navigator.clipboard.writeText(this.generatedHTML);
        alert('HTML 代码已复制到剪贴板！');
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = this.generatedHTML;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('HTML 代码已复制到剪贴板！');
      }
    },
    exportHTML() {
      const html = this.generateHTMLContent();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'form.html';
      a.click();
      URL.revokeObjectURL(url);
    },
    generateItemHTML(item) {
      const required = item.required ? 'required' : '';
      const requiredStar = item.required ? '<span class="text-danger">*</span>' : '';
      
      if (item.type === 'input') {
        return `
      <div class="mb-3">
        <label class="form-label">${item.label} ${requiredStar}</label>
        <input type="text" class="form-control" placeholder="${item.placeholder || ''}" ${required}>
      </div>`;
      }
      
      if (item.type === 'radio') {
        let options = item.options.map((opt, i) => `
        <div class="form-check">
          <input class="form-check-input" type="radio" name="radio_${item.id}" id="radio_${item.id}_${i}" ${required}>
          <label class="form-check-label" for="radio_${item.id}_${i}">${opt}</label>
        </div>`).join('');
        
        return `
      <div class="mb-3">
        <label class="form-label">${item.label} ${requiredStar}</label>
        ${options}
      </div>`;
      }
      
      if (item.type === 'checkbox') {
        let options = item.options.map((opt, i) => `
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="checkbox_${item.id}_${i}" ${required}>
          <label class="form-check-label" for="checkbox_${item.id}_${i}">${opt}</label>
        </div>`).join('');
        
        return `
      <div class="mb-3">
        <label class="form-label">${item.label} ${requiredStar}</label>
        ${options}
      </div>`;
      }
      
      return '';
    }
  }
};
</script>

<style>
.min-h-400 {
  min-height: 400px;
}
.cursor-move {
  cursor: move;
}
.component-item:hover {
  background-color: #e9ecef !important;
}
.form-item-wrapper:hover {
  background-color: #f8f9fa;
}
</style>
