let fields = [];
let selectedFieldId = null;
let currentShareCode = null;
let fieldCounter = 0;

const fieldTypeLabels = {
  text: '单行文本',
  textarea: '多行文本',
  number: '数字输入',
  email: '邮箱地址',
  radio: '单选框',
  checkbox: '多选框',
  date: '日期选择',
  time: '时间选择',
  select: '下拉选择',
  file: '文件上传'
};

document.addEventListener('DOMContentLoaded', () => {
  initDragAndDrop();
});

function initDragAndDrop() {
  const componentItems = document.querySelectorAll('.component-item');
  const formPreview = document.getElementById('form-preview');

  componentItems.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.dataset.type);
      e.dataTransfer.effectAllowed = 'copy';
    });
  });

  formPreview.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    formPreview.classList.add('border-blue-500', 'bg-blue-50');
  });

  formPreview.addEventListener('dragleave', (e) => {
    formPreview.classList.remove('border-blue-500', 'bg-blue-50');
  });

  formPreview.addEventListener('drop', (e) => {
    e.preventDefault();
    formPreview.classList.remove('border-blue-500', 'bg-blue-50');
    
    const fieldType = e.dataTransfer.getData('text/plain');
    addField(fieldType);
  });
}

function addField(type) {
  const emptyHint = document.getElementById('empty-hint');
  if (emptyHint) {
    emptyHint.remove();
  }

  fieldCounter++;
  const fieldId = `field_${Date.now()}_${fieldCounter}`;
  
  const field = {
    id: fieldId,
    type: type,
    label: `字段 ${fieldCounter}`,
    required: false,
    placeholder: '',
    options: ['选项1', '选项2', '选项3'],
    defaultValue: '',
    maxSize: 10,
    acceptTypes: ''
  };

  fields.push(field);
  renderField(field);
  selectField(fieldId);
}

function renderField(field) {
  const formPreview = document.getElementById('form-preview');
  const fieldElement = document.createElement('div');
  fieldElement.className = 'field-item bg-white border-2 border-gray-200 rounded-lg p-4 mb-4 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all relative';
  fieldElement.dataset.fieldId = field.id;

  let fieldHtml = `
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm text-gray-500 font-medium">${fieldTypeLabels[field.type]}</span>
      <div class="flex space-x-2">
        <button onclick="event.stopPropagation(); moveFieldUp('${field.id}')" class="text-gray-400 hover:text-blue-500">⬆️</button>
        <button onclick="event.stopPropagation(); moveFieldDown('${field.id}')" class="text-gray-400 hover:text-blue-500">⬇️</button>
        <button onclick="event.stopPropagation(); deleteField('${field.id}')" class="text-gray-400 hover:text-red-500">🗑️</button>
      </div>
    </div>
    <label class="block font-medium text-gray-700 mb-1">
      ${field.label}
      ${field.required ? '<span class="text-red-500">*</span>' : ''}
    </label>
  `;

  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
      fieldHtml += `<input type="${field.type === 'number' ? 'number' : (field.type === 'email' ? 'email' : 'text')}" 
                          placeholder="${field.placeholder || '请输入...'}" 
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">`;
      break;
    case 'textarea':
      fieldHtml += `<textarea placeholder="${field.placeholder || '请输入...'}" 
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" 
                              rows="3"></textarea>`;
      break;
    case 'radio':
      fieldHtml += '<div class="space-y-2">';
      field.options.forEach((opt, idx) => {
        fieldHtml += `
          <label class="flex items-center">
            <input type="radio" name="${field.id}" class="mr-2 text-blue-600">
            <span>${opt}</span>
          </label>`;
      });
      fieldHtml += '</div>';
      break;
    case 'checkbox':
      fieldHtml += '<div class="space-y-2">';
      field.options.forEach((opt, idx) => {
        fieldHtml += `
          <label class="flex items-center">
            <input type="checkbox" class="mr-2 text-blue-600 rounded">
            <span>${opt}</span>
          </label>`;
      });
      fieldHtml += '</div>';
      break;
    case 'date':
      fieldHtml += `<input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">`;
      break;
    case 'time':
      fieldHtml += `<input type="time" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">`;
      break;
    case 'select':
      fieldHtml += `
        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">请选择...</option>
          ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
        </select>`;
      break;
    case 'file':
      fieldHtml += `
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
          <div class="text-3xl mb-2">📎</div>
          <p class="text-sm text-gray-600">点击或拖拽上传文件</p>
          ${field.maxSize ? `<p class="text-xs text-gray-400 mt-1">最大 ${field.maxSize}MB</p>` : ''}
          ${field.acceptTypes ? `<p class="text-xs text-gray-400">支持格式: ${field.acceptTypes}</p>` : ''}
        </div>`;
      break;
  }

  fieldElement.innerHTML = fieldHtml;
  fieldElement.addEventListener('click', () => selectField(field.id));
  
  formPreview.appendChild(fieldElement);
}

function reRenderAllFields() {
  const formPreview = document.getElementById('form-preview');
  formPreview.innerHTML = fields.length === 0 ? 
    '<div class="text-center text-gray-400 py-20" id="empty-hint"><p class="text-lg">将左侧组件拖拽到此处</p><p class="text-sm mt-2">开始创建您的表单</p></div>' : 
    '';
  
  fields.forEach(field => renderField(field));
  
  if (selectedFieldId) {
    const element = document.querySelector(`[data-field-id="${selectedFieldId}"]`);
    if (element) {
      element.classList.add('border-blue-500', 'bg-blue-50');
    }
  }
}

function selectField(fieldId) {
  selectedFieldId = fieldId;
  
  document.querySelectorAll('.field-item').forEach(el => {
    el.classList.remove('border-blue-500', 'bg-blue-50');
  });
  
  const element = document.querySelector(`[data-field-id="${fieldId}"]`);
  if (element) {
    element.classList.add('border-blue-500', 'bg-blue-50');
  }
  
  showFieldEditor(fieldId);
}

function showFieldEditor(fieldId) {
  const field = fields.find(f => f.id === fieldId);
  if (!field) return;

  const editor = document.getElementById('field-editor');
  const editorContent = document.getElementById('field-editor-content');
  editor.classList.remove('hidden');

  let html = `
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">字段标签</label>
        <input type="text" value="${field.label}" 
               onchange="updateField('${fieldId}', 'label', this.value)"
               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
      </div>
      
      <div class="flex items-center">
        <input type="checkbox" id="required-${fieldId}" ${field.required ? 'checked' : ''}
               onchange="updateField('${fieldId}', 'required', this.checked)"
               class="mr-2 text-blue-600 rounded">
        <label for="required-${fieldId}" class="text-sm font-medium text-gray-700">必填字段</label>
      </div>
  `;

  if (['text', 'textarea', 'email', 'number'].includes(field.type)) {
    html += `
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">占位符</label>
        <input type="text" value="${field.placeholder}" 
               onchange="updateField('${fieldId}', 'placeholder', this.value)"
               placeholder="请输入占位符..."
               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
      </div>
    `;
  }

  if (['radio', 'checkbox', 'select'].includes(field.type)) {
    html += `
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">选项（每行一个）</label>
        <textarea id="options-${fieldId}" 
                  onchange="updateOptions('${fieldId}')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" 
                  rows="4">${field.options.join('\n')}</textarea>
      </div>
    `;
  }

  if (field.type === 'file') {
    html += `
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">最大文件大小 (MB)</label>
        <input type="number" value="${field.maxSize || 10}" 
               min="1" max="100"
               onchange="updateField('${fieldId}', 'maxSize', parseInt(this.value))"
               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">允许的文件类型（可选，用逗号分隔）</label>
        <input type="text" value="${field.acceptTypes || ''}" 
               placeholder="例如: .jpg,.png,.pdf"
               onchange="updateField('${fieldId}', 'acceptTypes', this.value)"
               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
      </div>
    `;
  }

  html += '</div>';
  editorContent.innerHTML = html;
}

function updateField(fieldId, key, value) {
  const field = fields.find(f => f.id === fieldId);
  if (field) {
    field[key] = value;
    reRenderAllFields();
    showFieldEditor(fieldId);
  }
}

function updateOptions(fieldId) {
  const field = fields.find(f => f.id === fieldId);
  const textarea = document.getElementById(`options-${fieldId}`);
  if (field && textarea) {
    field.options = textarea.value.split('\n').filter(opt => opt.trim() !== '');
    reRenderAllFields();
    showFieldEditor(fieldId);
  }
}

function moveFieldUp(fieldId) {
  const index = fields.findIndex(f => f.id === fieldId);
  if (index > 0) {
    [fields[index], fields[index - 1]] = [fields[index - 1], fields[index]];
    reRenderAllFields();
  }
}

function moveFieldDown(fieldId) {
  const index = fields.findIndex(f => f.id === fieldId);
  if (index < fields.length - 1) {
    [fields[index], fields[index + 1]] = [fields[index + 1], fields[index]];
    reRenderAllFields();
  }
}

function deleteField(fieldId) {
  fields = fields.filter(f => f.id !== fieldId);
  if (selectedFieldId === fieldId) {
    selectedFieldId = null;
    document.getElementById('field-editor').classList.add('hidden');
  }
  reRenderAllFields();
}

async function saveForm() {
  const title = document.getElementById('form-title').value.trim();
  const description = document.getElementById('form-description').value.trim();

  if (!title) {
    alert('请输入表单标题');
    return;
  }

  if (fields.length === 0) {
    alert('请添加至少一个表单字段');
    return;
  }

  try {
    const response = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, fields })
    });

    const data = await response.json();
    
    if (response.ok) {
      currentShareCode = data.shareCode;
      const shareUrl = `${window.location.origin}/form/${data.shareCode}`;
      document.getElementById('share-link').value = shareUrl;
      document.getElementById('share-modal').classList.remove('hidden');
    } else {
      alert(data.error || '保存失败');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('保存失败，请重试');
  }
}

function copyShareLink() {
  const input = document.getElementById('share-link');
  input.select();
  document.execCommand('copy');
  alert('链接已复制到剪贴板！');
}

function openForm() {
  if (currentShareCode) {
    window.open(`/form/${currentShareCode}`, '_blank');
  }
}

function viewSubmissions() {
  if (currentShareCode) {
    window.open(`/submissions/${currentShareCode}`, '_blank');
  }
}

function closeShareModal() {
  document.getElementById('share-modal').classList.add('hidden');
  resetBuilder();
}

function resetBuilder() {
  document.getElementById('form-title').value = '';
  document.getElementById('form-description').value = '';
  fields = [];
  selectedFieldId = null;
  fieldCounter = 0;
  currentShareCode = null;
  document.getElementById('field-editor').classList.add('hidden');
  reRenderAllFields();
}
